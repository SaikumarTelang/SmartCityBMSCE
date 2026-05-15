router.get('/dashboard-stats', async (req, res) => {
  try {
    const snapshot = await db.collection('reports').get();
    const reports = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      // Calculate weight score for prioritization
      const weightScore = (data.severity === 'High' ? 30 : 10) + (data.votes * 5);
      reports.push({ id: doc.id, ...data, weightScore });
    });

    // Sort by weight score (highest priority first)
    reports.sort((a, b) => b.weightScore - a.weightScore);
    
    res.json(reports);
  } catch (error) {
    res.status(500).send(error.message);
  }
});