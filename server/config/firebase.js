const fs = require('fs');
const path = require('path');

const demoMode = process.env.DEMO_MODE === 'true';
const keyPath = path.join(__dirname, 'serviceAccountKey.json');

let db = null;
let auth = null;
let admin = null;
let storage = null;

function initFirebase() {
  if (!fs.existsSync(keyPath)) {
    if (!demoMode) {
      console.error(
        '\n*** Firebase service account missing ***\n' +
          'Place your key at: server/config/serviceAccountKey.json\n' +
          'Download from: Firebase Console → Project Settings → Service Accounts\n' +
          'Or set DEMO_MODE=true in server/.env for local testing without Firebase.\n'
      );
    }
    return false;
  }

  admin = require('firebase-admin');
  const serviceAccount = require('./serviceAccountKey.json');

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
    });
  }

  db = admin.firestore();
  auth = admin.auth();
  storage = admin.storage();
  console.log('Firebase Admin connected');
  return true;
}

const connected = initFirebase();
const useDemo = demoMode || !connected;

if (useDemo && !demoMode) {
  console.warn('Falling back to DEMO_MODE (no valid Firebase credentials)');
}

module.exports = {
  db: useDemo ? null : db,
  auth: useDemo ? null : auth,
  admin: useDemo ? null : admin,
  storage: useDemo ? null : storage,
  demoMode: useDemo,
};
