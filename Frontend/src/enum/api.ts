import axios from 'axios';
import { data } from 'react-router-dom';

const api = axios.create({
    baseURL: 'http://localhost:8000/v1/access',  // URL вашего FastAPI приложения
});

export const register = (data: { email: string; username: string; password: string }) => api.post('/register', data);
export const authorize = (data: { login: string; password: string }) => api.post('/authorize', data);
export const check_username = (data: { username: string }) => api.post('/check-username', data)