const express = require('express');
const router = express.Router();
const { db, demoMode } = require('../config/firebase');
const demoStore = require('../config/demoStore');

router.get('/dashboard-stats', async (req, res) => {
  try {
    let reports = [];

    if (demoMode) {
      reports = [...demoStore.reports];
    } else {
      const snapshot = await db.collection('reports').get();
      snapshot.forEach((doc) => {
        const data = doc.data();
        const location =
          data.location?.latitude !== undefined
            ? { lat: data.location.latitude, lng: data.location.longitude }
            : data.location;
        reports.push({ id: doc.id, ...data, location });
      });
    }

    const enriched = reports.map((data) => {
      const weightScore =
        (data.severity === 'High' ? 30 : data.severity === 'Low' ? 5 : 10) +
        (data.votes || 0) * 5;
      return { ...data, weightScore };
    });

    enriched.sort((a, b) => b.weightScore - a.weightScore);
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
