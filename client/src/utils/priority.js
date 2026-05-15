export function calcWeightScore(report) {
  const severity = report.severity || 'Medium';
  const base = severity === 'High' ? 30 : severity === 'Low' ? 5 : 10;
  const votes = report.votes || 1;
  const multiplier = votes >= 10 ? 2.0 : votes >= 5 ? 1.5 : 1.0;
  return Math.round(base * multiplier + votes * 5);
}

export function getPriorityLabel(weightScore, votes = 1) {
  if (weightScore >= 40 || votes >= 8) return 'Critical';
  if (weightScore >= 25 || votes >= 4) return 'High';
  return 'Medium';
}

export function generateTicketId() {
  return `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
}
