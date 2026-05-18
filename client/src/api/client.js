import axios from 'axios';
import { hasConfig } from '../firebase';
import * as firestoreApi from './firestoreApi';
import { getCurrentPosition } from '../utils/geo';

const api = axios.create({ baseURL: '/api', timeout: 120000 });

export { getCurrentPosition };

export async function detectImage(file) {
  const form = new FormData();
  form.append('image', file);
  const { data } = await api.post('/detection/detect', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function registerUser(payload) {
  if (hasConfig) return firestoreApi.registerUser(payload);
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function loginUser(payload) {
  if (hasConfig) return firestoreApi.loginUser(payload);
  const { data } = await api.post('/auth/login', payload);
  return data;
}

export async function getUser(uid) {
  if (hasConfig) return firestoreApi.getUser(uid);
  const { data } = await api.get(`/auth/user/${uid}`);
  return data;
}

export async function getReports() {
  if (hasConfig) return firestoreApi.getReports();
  const { data } = await api.get('/reports');
  return data;
}

export async function submitReport(payload) {
  if (hasConfig) return firestoreApi.submitReport(payload);
  const { data } = await api.post('/reports/submit', payload);
  return data;
}

export async function upvoteReport(reportId, userId) {
  if (hasConfig) return firestoreApi.upvoteReport(reportId, userId);
  const { data } = await api.post(`/reports/${reportId}/upvote`, { userId });
  return data;
}

export async function getAdminStats(categoryFilter) {
  if (hasConfig) return firestoreApi.getAdminStats(categoryFilter);
  const { data } = await api.get('/admin/dashboard-stats');
  return data;
}

export async function updateReportStatus(id, status) {
  if (hasConfig) return firestoreApi.updateReportStatus(id, status);
  const { data } = await api.patch(`/reports/${id}/status`, { status });
  return data;
}

export async function dispatchReport(id) {
  if (hasConfig) return firestoreApi.dispatchReport(id);
  const { data } = await api.post(`/reports/${id}/dispatch`);
  return data;
}

export default api;
