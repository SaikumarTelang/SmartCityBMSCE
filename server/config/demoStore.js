const users = new Map();
const reports = [];

let reportId = 1;

function nextId() {
  return String(reportId++);
}

module.exports = {
  users,
  reports,
  nextId,
};
