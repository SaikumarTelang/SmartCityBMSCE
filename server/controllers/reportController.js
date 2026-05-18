const { db, admin, demoMode } = require('../config/firebase');
const demoStore = require('../config/demoStore');
const { isWithinRadius, calcWeightScore } = require('../utils/geo');

function getLocation(data) {
  if (!data?.location) return null;
  if (typeof data.location.latitude === 'number') {
    return { lat: data.location.latitude, lng: data.location.longitude };
  }
  if (data.location.lat !== undefined) {
    return { lat: data.location.lat, lng: data.location.lng };
  }
  return null;
}

function findNearbyDemo(category, location) {
  for (const report of demoStore.reports) {
    if (report.category !== category || report.status === 'Fixed') continue;
    const loc = getLocation(report);
    if (loc && isWithinRadius(loc, location)) {
      return { id: report.id, ...report, distanceMeters: 12 };
    }
  }
  return null;
}

exports.createReport = async (req, res) => {
  const { category, location, userId, severity, aiConfidence, detections, address } = req.body;

  if (!category || !location?.lat || !location?.lng) {
    return res.status(400).json({ error: 'category and location are required' });
  }

  try {
    if (demoMode) {
      const nearby = findNearbyDemo(category, location);
      if (nearby) {
        return res.status(200).json({
          isDuplicate: true,
          reportId: nearby.id,
          distanceMeters: 12,
          votes: nearby.votes || 1,
          category: nearby.category,
          message: 'Similar report within 12m',
        });
      }

      const report = {
        category,
        severity: severity || 'Medium',
        location: { lat: location.lat, lng: location.lng },
        reportedBy: userId || 'anonymous',
        status: 'Reported',
        timestamp: new Date(),
        votes: 1,
        aiConfidence,
        detections: detections || [],
        address: address || 'Bengaluru Central',
        ticketId: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      };
      report.weightScore = calcWeightScore(report);
      const id = demoStore.nextId();
      const fullReport = { id, ...report };
      demoStore.addReport(fullReport);
      
      if (userId) {
        demoStore.updateUser(userId, {
          points: (demoStore.users.get(userId)?.points || 0) + 50,
          reportsCount: (demoStore.users.get(userId)?.reportsCount || 0) + 1
        });
      }
      
      return res.status(201).json({ isDuplicate: false, id, ticketId: report.ticketId });
    }

    const existing = await db.collection('reports').get();
    let duplicate = null;
    existing.forEach((doc) => {
      const data = doc.data();
      if (data.category !== category || data.status === 'Fixed') return;
      const loc = getLocation(data);
      if (loc && isWithinRadius(loc, location)) duplicate = { id: doc.id, ...data };
    });

    if (duplicate) {
      return res.status(200).json({
        isDuplicate: true,
        reportId: duplicate.id,
        votes: duplicate.votes,
        category: duplicate.category,
      });
    }

    const newReport = {
      category,
      severity: severity || 'Medium',
      location: new admin.firestore.GeoPoint(location.lat, location.lng),
      reportedBy: userId || 'anonymous',
      status: 'Reported',
      timestamp: new Date(),
      votes: 1,
      aiConfidence: aiConfidence || null,
      detections: detections || [],
      address: address || 'Bengaluru Central',
    };
    newReport.weightScore = calcWeightScore(newReport);
    const docRef = await db.collection('reports').add(newReport);
    
    if (userId) {
      const userRef = db.collection('users').doc(userId);
      const userSnap = await userRef.get();
      if (userSnap.exists) {
        await userRef.update({
          points: admin.firestore.FieldValue.increment(50),
          reportsCount: admin.firestore.FieldValue.increment(1)
        });
      }
    }
    
    res.status(201).json({ isDuplicate: false, id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.upvoteReport = async (req, res) => {
  const { id } = req.params;
  try {
    if (demoMode) {
      const report = demoStore.reports.find((r) => r.id === id);
      if (!report) return res.status(404).json({ error: 'Not found' });
      report.votes = (report.votes || 1) + 1;
      report.weightScore = calcWeightScore(report);
      report.status = report.votes >= 5 ? 'Critical Queue' : report.status;
      demoStore.updateReport(id, {
        votes: report.votes,
        weightScore: report.weightScore,
        status: report.status
      });
      return res.json({ votes: report.votes, weightScore: report.weightScore });
    }
    const ref = db.collection('reports').doc(id);
    const snap = await ref.get();
    const votes = (snap.data().votes || 1) + 1;
    const weightScore = calcWeightScore({ ...snap.data(), votes });
    await ref.update({ votes, weightScore });
    res.json({ votes, weightScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.dispatchReport = async (req, res) => {
  const { id } = req.params;
  try {
    if (demoMode) {
      const report = demoStore.reports.find((r) => r.id === id);
      if (report) {
        demoStore.updateReport(id, { status: 'In Progress' });
      }
      return res.json({ message: 'Dispatched' });
    }
    await db.collection('reports').doc(id).update({ status: 'In Progress' });
    res.json({ message: 'Dispatched' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    if (demoMode) return res.json(demoStore.reports);
    const snapshot = await db.collection('reports').get();
    const reports = [];
    snapshot.forEach((doc) => {
      reports.push({ id: doc.id, ...doc.data(), location: getLocation(doc.data()) });
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if (demoMode) {
      const report = demoStore.reports.find((r) => r.id === id);
      if (!report) return res.status(404).json({ error: 'Not found' });
      
      const oldStatus = report.status;
      
      demoStore.updateReport(id, { status });
      
      if (status === 'Resolved' && oldStatus !== 'Resolved') {
        if (report.reportedBy && report.reportedBy !== 'anonymous') {
          const user = demoStore.users.get(report.reportedBy);
          if (user) {
            demoStore.updateUser(report.reportedBy, {
              points: (user.points || 0) + 20
            });
          }
        }
      }
      
      return res.json({ message: 'Updated' });
    }
    
    const reportRef = db.collection('reports').doc(id);
    const reportSnap = await reportRef.get();
    if (!reportSnap.exists) return res.status(404).json({ error: 'Not found' });
    
    const oldStatus = reportSnap.data().status;
    await reportRef.update({ status });
    
    if (status === 'Resolved' && oldStatus !== 'Resolved') {
      const reportedBy = reportSnap.data().reportedBy;
      if (reportedBy && reportedBy !== 'anonymous') {
        const userRef = db.collection('users').doc(reportedBy);
        const userSnap = await userRef.get();
        if (userSnap.exists) {
          await userRef.update({
            points: admin.firestore.FieldValue.increment(20)
          });
        }
      }
    }
    
    res.json({ message: 'Updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
