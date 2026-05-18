import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  GeoPoint,
  getDoc,
  getDocs,
  increment,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { distanceMeters, isWithinRadius, PROXIMITY_RADIUS_M } from '../utils/geo';
import { calcWeightScore, generateTicketId, getPriorityLabel } from '../utils/priority';

function mapDoc(d) {
  const data = d.data();
  const loc = data.location;
  const location =
    loc?.latitude != null
      ? { lat: loc.latitude, lng: loc.longitude }
      : loc;
  const weightScore = data.weightScore ?? calcWeightScore(data);
  return { id: d.id, ...data, location, weightScore };
}

export async function registerUser({ uid, mobile, name, email, password }) {
  await setDoc(
    doc(db, 'users', uid),
    {
      mobileNumber: mobile || '',
      email: email || '',
      name: name || 'Citizen',
      password: password || '',
      points: 0,
      rank: 'Level 1',
      reportsCount: 0,
      joinedAt: new Date(),
    },
    { merge: true }
  );
  const { password: _, ...profileWithoutPassword } = {
    mobileNumber: mobile || '',
    email: email || '',
    name: name || 'Citizen',
    points: 0,
    rank: 'Level 1',
    reportsCount: 0,
    joinedAt: new Date(),
  };
  return { message: 'Profile created', profile: profileWithoutPassword };
}

export async function loginUser({ mobile, password }) {
  const snap = await getDocs(collection(db, 'users'));
  let userDoc = null;
  let userId = null;
  
  for (const doc of snap.docs) {
    const data = doc.data();
    if (data.mobileNumber === mobile) {
      userDoc = data;
      userId = doc.id;
      break;
    }
  }
  
  if (!userDoc) {
    throw new Error('User not found');
  }
  
  if (userDoc.password !== password) {
    throw new Error('Invalid password');
  }
  
  const { password: _, ...profileWithoutPassword } = userDoc;
  return { message: 'Login successful', uid: userId, profile: profileWithoutPassword };
}

export async function getUser(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) throw new Error('User not found');
  const { password: _, ...profileWithoutPassword } = snap.data();
  return profileWithoutPassword;
}

export async function getReports() {
  const snap = await getDocs(collection(db, 'reports'));
  return snap.docs.map(mapDoc);
}

export async function findNearbyReport(category, location) {
  const snap = await getDocs(collection(db, 'reports'));
  let best = null;
  let bestDist = PROXIMITY_RADIUS_M + 1;

  snap.docs.forEach((d) => {
    const data = d.data();
    if (data.category !== category || data.status === 'Fixed') return;
    const loc = data.location;
    if (loc?.latitude == null) return;
    const dist = distanceMeters(
      location,
      { lat: loc.latitude, lng: loc.longitude }
    );
    if (dist <= PROXIMITY_RADIUS_M && dist < bestDist) {
      bestDist = dist;
      best = { id: d.id, ...data, distanceMeters: Math.round(dist) };
    }
  });

  return best;
}

export async function submitReport({
  category,
  location,
  userId,
  severity,
  aiConfidence,
  detections,
  address,
  imagePreview,
}) {
  const nearby = await findNearbyReport(category, location);

  if (nearby) {
    return {
      isDuplicate: true,
      reportId: nearby.id,
      distanceMeters: nearby.distanceMeters,
      votes: nearby.votes || 1,
      category: nearby.category,
      address: nearby.address || address,
      message: 'Similar report found within 12m — upvote to raise priority',
    };
  }

  const votes = 1;
  const report = {
    category,
    severity: severity || 'Medium',
    location: new GeoPoint(location.lat, location.lng),
    reportedBy: userId || 'anonymous',
    status: 'Reported',
    lifecycle: 'AI Verified',
    timestamp: new Date(),
    votes,
    aiConfidence: aiConfidence || null,
    detections: detections || [],
    address: address || 'Bengaluru Central',
    ticketId: generateTicketId(),
    imagePreview: imagePreview || null,
    upvoters: userId ? [userId] : [],
  };
  report.weightScore = calcWeightScore(report);
  report.priority = getPriorityLabel(report.weightScore, votes);

  const docRef = await addDoc(collection(db, 'reports'), report);

  if (userId) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        reportsCount: increment(1),
        points: increment(50),
      });
    }
  }

  return { isDuplicate: false, id: docRef.id, ticketId: report.ticketId };
}

export async function upvoteReport(reportId, userId) {
  const ref = doc(db, 'reports', reportId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Report not found');

  const data = snap.data();
  const upvoters = data.upvoters || [];
  if (userId && upvoters.includes(userId)) {
    return { message: 'Already upvoted', votes: data.votes };
  }

  const votes = (data.votes || 1) + 1;
  const updated = { ...data, votes };
  const weightScore = calcWeightScore(updated);
  const priority = getPriorityLabel(weightScore, votes);

  await updateDoc(ref, {
    votes,
    weightScore,
    priority,
    upvoters: userId ? arrayUnion(userId) : upvoters,
    status: votes >= 5 ? 'Critical Queue' : data.status,
  });

  if (userId) {
    await updateDoc(doc(db, 'users', userId), { points: increment(5) });
  }

  return { votes, weightScore, priority };
}

export async function getAdminStats(categoryFilter) {
  const snap = await getDocs(collection(db, 'reports'));
  let reports = snap.docs.map(mapDoc).filter((r) => r.status !== 'Fixed');

  if (categoryFilter && categoryFilter !== 'all') {
    const map = {
      potholes: 'Pothole',
      garbage: 'Garbage',
      utilities: 'Broken Wire',
    };
    const cat = map[categoryFilter] || categoryFilter;
    reports = reports.filter((r) => r.category === cat);
  }

  reports.sort((a, b) => b.weightScore - a.weightScore);
  return reports;
}

export async function updateReportStatus(id, status) {
  const updates = { status };
  if (status === 'Fixed') updates.lifecycle = 'Fixed';
  if (status === 'In Progress') updates.lifecycle = 'In Progress';
  await updateDoc(doc(db, 'reports', id), updates);
  return { message: 'Updated' };
}

export async function dispatchReport(id) {
  await updateDoc(doc(db, 'reports', id), {
    status: 'In Progress',
    lifecycle: 'Assigned',
    dispatchedAt: new Date(),
  });
  return { message: 'Dispatched' };
}
