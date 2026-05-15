function distanceMeters(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function isWithinRadius(a, b, radiusM = 12) {
  return distanceMeters(a, b) <= radiusM;
}

function calcWeightScore(report) {
  const base = report.severity === 'High' ? 30 : report.severity === 'Low' ? 5 : 10;
  const votes = report.votes || 1;
  const multiplier = votes >= 10 ? 2.0 : votes >= 5 ? 1.5 : 1.0;
  return Math.round(base * multiplier + votes * 5);
}

module.exports = { distanceMeters, isWithinRadius, calcWeightScore };
