import axios from 'axios';

const API = 'http://localhost:8000/api';

const headers = () => ({ Authorization: 'Bearer ' + localStorage.getItem('token') });

export const login  = (data) => axios.post(`${API}/login`, data);
export const register = (data) => axios.post(`${API}/register`, data);
export const logout = () => axios.post(`${API}/logout`, {}, { headers: headers() });
export const getMe  = () => axios.get(`${API}/me`, { headers: headers() });
export const updateProfile = (data) => axios.put(`${API}/profile`, data, { headers: headers() });
