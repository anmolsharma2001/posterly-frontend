import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// EMPLOYEES
export const getEmployees = () => API.get('/employees');
export const getEmployee = (id) => API.get(`/employees/${id}`);
export const createEmployee = (data) => API.post('/employees', data);
export const updateEmployee = (id, data) => API.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);
export const importCsv = (formData) => API.post('/employees/import-csv', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const sendBulkEmail = () => API.post('/employees/send-bulk-email');
export const sendReminders = () => API.post('/employees/send-reminders');
export const getStats = () => API.get('/employees/stats');
export const getUpcomingEvents = (days = 30) => API.get(`/employees/upcoming-events?days=${days}`);

// AUTH & USERS
export const loginUser = (data) => API.post('/users/login', data);
export const registerUser = (data) => API.post('/users/register', data);
export const verifyToken = (token) => API.get(`/auth/verify?token=${token}`);

// IMAGES
export const uploadImage = (formData, token) =>
  API.post(`/images/upload?token=${token}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getImageUrl = (filename) => `/api/images/${filename}`;
export const getDownloadUrl = (employeeId) =>
  `/api/images/download/${employeeId}`;

export const uploadFinalPoster = (employeeId, occasion, formData) =>
  API.post(`/images/upload-poster/${employeeId}/${occasion}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export default API;
