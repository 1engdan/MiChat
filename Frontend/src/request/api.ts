import axios from 'axios';
import { ApiResponse } from '../interface/apiTypes';
import { Chat } from '../interface/Chat';
import { Message } from '../interface/Message';
import { Profile } from '../interface/Profile';

const api = axios.create({
  baseURL: 'https://api.michat.pw',  // URL вашего FastAPI приложения localhost:8000 api.michat.pw
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

export const fetchUsername = async (userId: string): Promise<string> => {
  try {
    const response = await api.get(`/profile/user/${userId}`); // Replace with your actual API endpoint
    return response.data.username; // Assuming the API returns an object with a `username` field
  } catch (error) {
    console.error('Error fetching username:', error);
    throw error;
  }
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

export const fetchMessages = async (username: string): Promise<Message[]> => {
  const response = await api.get<Message[]>(`/chat/${username}`);
  return response.data;
};

export const sendMessage = async (message: { recipient: string; content: string }): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>('/chat/', message);
  return response.data;
};

export const updateUsername = (data: { new_username: string; current_password: string }) => api.put('/setting/username/update', data);
export const updateEmail = (data: { new_email: string; current_password: string }) => api.put('/setting/email/update', data);
export const updatePassword = (data: { new_password: string; current_password: string }) => api.put('/setting/password/update', data);
export const deleteAccount = (data: { current_password: string }) => api.delete('/setting/profile/delete', { data });

export const updateProfile = (data: { name: string; about_me: string }) => {
  const formattedData = {
    name: data.name,
    about_me: data.about_me,
  };
  return api.put('/setting/profile/update', formattedData);
};

export const uploadImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.put('/setting/profile/image/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteImage = () => api.delete('/setting/profile/image/delete');