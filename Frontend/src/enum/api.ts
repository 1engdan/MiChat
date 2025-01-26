import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',  // URL вашего FastAPI приложения
});

export const register = (data: { email: string; password: string }) => api.post('/a/register', data);
export const authorize = (data: { username: string; password: string }) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    return api.post('/a/authorize', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};