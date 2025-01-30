import axios from 'axios';
import { ApiResponse, ChatData } from '../enum/apiTypes'; // Импортируйте интерфейс

const api = axios.create({
    baseURL: 'http://localhost:8000',  // URL вашего FastAPI приложения localhost:8000 api.michat.pw
});

export const register = (data: { email: string; username: string; password: string }) => api.post<ApiResponse<void>>('/a/register', data);
export const authorize = (data: { username: string; password: string }) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    return api.post<ApiResponse<void>>('/a/authorize', formData);
};

export const checkUsername = (username: string) => api.get<ApiResponse<void>>(`/a/check_username?username=${username}`);
export const getUsersWithChats = () => api.get<ApiResponse<ChatData[]>>('/chat/users');