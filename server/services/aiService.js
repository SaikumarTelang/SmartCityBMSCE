const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const AI_DIR = path.resolve(__dirname, '../../aiModel');
const PYTHON = process.env.PYTHON_PATH || 'py';
const WORKER_SCRIPT = path.join(AI_DIR, 'predict_worker.py');

let worker = null;
let ready = false;
let requestId = 0;
const pending = new Map();
let stdoutBuffer = '';

function startWorker() {
  if (worker) return;

  worker = spawn(PYTHON, [WORKER_SCRIPT], {
    cwd: AI_DIR,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  worker.stdout.on('data', (chunk) => {
    stdoutBuffer += chunk.toString();
    const lines = stdoutBuffer.split('\n');
    stdoutBuffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('{')) continue;
      try {
        const data = JSON.parse(trimmed);
        if (data.status === 'ready') {
          ready = true;
          console.log('AI worker ready (garbage, pothole, broken wire)');
          return;
        }
        const id = data.requestId;
        if (id != null && pending.has(id)) {
          const { resolve, reject } = pending.get(id);
          pending.delete(id);
          if (data.error) reject(new Error(data.error));
          else resolve(data);
        }
      } catch (err) {
        console.error('AI worker parse error:', err.message);
      }
    }
  });

  worker.stderr.on('data', (chunk) => {
    const msg = chunk.toString().trim();
    if (msg) console.log('[AI]', msg);
  });

  worker.on('exit', (code) => {
    console.error(`AI worker exited with code ${code}`);
    worker = null;
    ready = false;
    for (const [, { reject }] of pending) {
      reject(new Error('AI worker stopped. Restart the server.'));
    }
    pending.clear();
  });
}

function waitForReady(timeoutMs = 180000) {
  return new Promise((resolve, reject) => {
    if (ready) return resolve();
    const start = Date.now();
    const interval = setInterval(() => {
      if (ready) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        reject(new Error('AI models timed out while loading'));
      }
    }, 500);
  });
}

async function detectFromBuffer(buffer, filename = 'upload.jpg') {
  startWorker();
  await waitForReady();

  const tempPath = path.join(
    os.tmpdir(),
    `smartcity_${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '')}`
  );
  fs.writeFileSync(tempPath, buffer);

  try {
    const id = ++requestId;
    const result = await new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      worker.stdin.write(
        JSON.stringify({ requestId: id, imagePath: tempPath }) + '\n'
      );
      setTimeout(() => {
        if (pending.has(id)) {
          pending.delete(id);
          reject(new Error('AI detection timed out'));
        }
      }, 120000);
    });
    return result;
  } finally {
    try {
      fs.unlinkSync(tempPath);
    } catch {
      /* ignore */
    }
  }
}

module.exports = { startWorker, detectFromBuffer };
