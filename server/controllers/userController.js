const bcrypt = require('bcrypt');
const { db, demoMode } = require('../config/firebase');
const demoStore = require('../config/demoStore');

exports.registerUser = async (req, res) => {
  const { uid, mobile, name, email, password } = req.body;

  if (!uid || !mobile || !password) {
    return res.status(400).json({ error: 'uid, mobile and password are required' });
  }

  try {
    console.log('userController.js - registerUser called with:', { uid, mobile, name, email });
    console.log('userController.js - demoMode:', demoMode);
    
    let existingUser = null;
    
    if (demoMode) {
      console.log('userController.js - checking existing user in demo mode');
      for (const [id, profile] of demoStore.users.entries()) {
        if (profile.mobileNumber === mobile) {
          existingUser = { id, ...profile };
          break;
        }
      }
    } else {
      console.log('userController.js - checking existing user in Firebase mode');
      console.log('userController.js - db available:', !!db);
      const snapshot = await db.collection('users').where('mobileNumber', '==', mobile).limit(1).get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        existingUser = { id: doc.id, ...doc.data() };
      }
    }
    
    if (existingUser) {
      console.log('userController.js - user already exists');
      return res.status(400).json({ error: 'User with this mobile number already exists! Please login.' });
    }
    
    console.log('userController.js - hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const profile = {
      mobileNumber: mobile,
      email: email || '',
      name: name || 'Citizen',
      password: hashedPassword,
      points: 0,
      rank: 'Level 1',
      reportsCount: 0,
      joinedAt: new Date(),
    };

    console.log('userController.js - saving user to database');
    if (demoMode) {
      demoStore.addUser(uid, profile);
    } else {
      await db.collection('users').doc(uid).set(profile);
    }

    console.log('userController.js - user saved successfully');
    const { password: _, ...profileWithoutPassword } = profile;
    res.status(201).json({ message: 'Profile created', profile: profileWithoutPassword });
  } catch (error) {
    console.error('userController.js - registerUser error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({ error: 'mobile and password are required' });
  }

  try {
    let userProfile = null;
    let userId = null;

    if (demoMode) {
      for (const [id, profile] of demoStore.users.entries()) {
        if (profile.mobileNumber === mobile) {
          userProfile = profile;
          userId = id;
          break;
        }
      }
    } else {
      const snapshot = await db.collection('users').where('mobileNumber', '==', mobile).limit(1).get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        userProfile = doc.data();
        userId = doc.id;
      }
    }

    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, userProfile.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const { password: _, ...profileWithoutPassword } = userProfile;
    res.json({ message: 'Login successful', uid: userId, profile: profileWithoutPassword });
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
      const { password: _, ...profileWithoutPassword } = profile;
      return res.json(profileWithoutPassword);
    }

    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });
    const { password: _, ...profileWithoutPassword } = doc.data();
    res.json(profileWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
