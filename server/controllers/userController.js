const { db, demoMode } = require('../config/firebase');
const demoStore = require('../config/demoStore');

exports.registerUser = async (req, res) => {
  const { uid, mobile, name, email } = req.body;

  if (!uid) {
    return res.status(400).json({ error: 'uid is required' });
  }

  try {
    const profile = {
      mobileNumber: mobile || '',
      email: email || '',
      name: name || 'Citizen',
      points: 0,
      rank: 'Level 1',
      reportsCount: 0,
      joinedAt: new Date(),
    };

    if (demoMode) {
      demoStore.users.set(uid, profile);
    } else {
      await db.collection('users').doc(uid).set(profile);
    }

    res.status(201).json({ message: 'Profile created', profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  const { uid } = req.params;

  try {
    if (demoMode) {
      const profile = demoStore.users.get(uid);
      if (!profile) return res.status(404).json({ error: 'User not found' });
      return res.json(profile);
    }

    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });
    res.json(doc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
