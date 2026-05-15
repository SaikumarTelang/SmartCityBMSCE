const { db } = require('../config/firebase');

exports.registerUser = async (req, res) => {
  const { uid, mobile } = req.body;
  try {
    await db.collection('users').doc(uid).set({
      mobileNumber: mobile,
      points: 0,
      rank: "Level 1",
      reportsCount: 0,
      joinedAt: new Date()
    });
    res.status(201).send({ message: "Profile Created" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Add a function here later to update points when an admin fixes a pothole!