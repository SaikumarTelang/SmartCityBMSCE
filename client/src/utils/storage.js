function getUserId() {
  return localStorage.getItem('userId');
}

function getUserKey(key) {
  const userId = getUserId();
  if (!userId) return null;
  return `user_${userId}_${key}`;
}

export function getUserData(key, defaultValue = null) {
  const userKey = getUserKey(key);
  if (!userKey) return defaultValue;
  const data = localStorage.getItem(userKey);
  if (data === null) return defaultValue;
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
}

export function setUserData(key, value) {
  const userKey = getUserKey(key);
  if (!userKey) return;
  localStorage.setItem(userKey, JSON.stringify(value));
}

export function removeUserData(key) {
  const userKey = getUserKey(key);
  if (!userKey) return;
  localStorage.removeItem(userKey);
}

export function clearAllUserData() {
  const userId = getUserId();
  if (!userId) return;
  const prefix = `user_${userId}_`;
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
}
