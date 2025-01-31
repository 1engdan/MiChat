import axios from 'axios';
import { ApiResponse } from '../interface/apiTypes';
import { Chat } from '../interface/Chat';
import { Message } from '../interface/Message';
import { Profile } from '../interface/Profile';

const api = axios.create({
    baseURL: 'http://localhost:8000',  // URL вашего FastAPI приложения localhost:8000 api.michat.pw
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

export const register = (data: { email: string; username: string; password: string }) => api.post<ApiResponse>('/a/register', data);
export const authorize = (data: { username: string; password: string }) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    return api.post<ApiResponse>('/a/authorize', formData);
};

export const checkUsername = (username: string) => api.get<ApiResponse>(`/a/check_username?username=${username}`);

export const fetchChats = async (): Promise<Chat[]> => {
    const response = await api.get<Chat[]>('/chat/chats/all');
    return response.data;
  };

export const fetchProfile = async (username: string): Promise<Profile> => {
    const response = await api.get(`/profile/${username}`);
    return response.data.profile; // Extract the profile object from the response
  };

export const fetchImage = async (username: string): Promise<Blob> => {
    const response = await api.get(`/profile/${username}/image`, { responseType: 'blob' });
    return response.data;
  };

export const fetchMessages = async (username: string): Promise<Message[]> => {
    const response = await api.get<Message[]>(`/chat/${username}`);
    return response.data;
  };

export const sendMessage = async (message: { recipient: string; content: string }): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/chat/', message);
    return response.data;
  };
