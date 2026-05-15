const { db } = require('../config/firebase');

exports.createReport = async (req, res) => {
  const { category, location, userId, severity } = req.body;

  try {
    // 1. SIMPLE DEDUPLICATION LOGIC
    // In a hackathon, we query for reports of the same category
    const existingReports = await db.collection('reports')
      .where('category', '==', category)
      .where('status', '!=', 'Fixed')
      .get();

    let duplicateFound = false;
    
    existingReports.forEach(doc => {
      const data = doc.data();
      // Use Haversine formula or simple coordinate math to check distance (< 0.0002 approx 20m)
      const distance = Math.sqrt(
        Math.pow(data.location.latitude - location.lat, 2) + 
        Math.pow(data.location.longitude - location.lng, 2)
      );

      if (distance < 0.0002) duplicateFound = doc.id;
    });

    if (duplicateFound) {
      return res.status(200).json({ 
        isDuplicate: true, 
        reportId: duplicateFound,
        message: "Similar report found nearby!" 
      });
    }

    // 2. CREATE NEW IF NO DUPLICATE
    const newReport = {
      category,
      severity,
      location: new admin.firestore.GeoPoint(location.lat, location.lng),
      reportedBy: userId,
      status: 'Reported',
      timestamp: new Date(),
      votes: 1
    };

    const docRef = await db.collection('reports').add(newReport);
    res.status(201).json({ isDuplicate: false, id: docRef.id });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};