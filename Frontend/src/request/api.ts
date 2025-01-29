import axios from 'axios';
import { ApiResponse } from '../enum/apiTypes'; // Импортируйте интерфейс

const api = axios.create({
    baseURL: 'https://api.michat.pw',  // URL вашего FastAPI приложения
});

export const register = (data: { email: string; username: string; password: string }) => api.post<ApiResponse>('/a/register', data);
export const authorize = (data: { username: string; password: string }) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    return api.post<ApiResponse>('/a/authorize', formData);
};

export const checkUsername = (username: string) => api.get<ApiResponse>(`/a/check_username?username=${username}`);
