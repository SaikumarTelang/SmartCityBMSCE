const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'demoData.json');

let users = new Map();
let reports = [];
let reportId = 1;

function loadFromFile() {
  try {
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      reportId = data.reportId || 1;
      reports = data.reports || [];
      users = new Map(data.users || []);
    }
  } catch (error) {
    console.error('Error loading demo data:', error);
  }
}

function saveToFile() {
  try {
    const data = {
      reportId,
      reports,
      users: Array.from(users.entries())
    };
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving demo data:', error);
  }
}

function nextId() {
  const id = String(reportId++);
  saveToFile();
  return id;
}

function addUser(uid, profile) {
  users.set(uid, profile);
  saveToFile();
}

function addReport(report) {
  reports.push(report);
  saveToFile();
}

function updateUser(uid, updates) {
  const user = users.get(uid);
  if (user) {
    Object.assign(user, updates);
    saveToFile();
  }
}

function updateReport(id, updates) {
  const report = reports.find(r => r.id === id);
  if (report) {
    Object.assign(report, updates);
    saveToFile();
  }
}

loadFromFile();

module.exports = {
  users,
  reports,
  nextId,
  addUser,
  addReport,
  updateUser,
  updateReport,
};
