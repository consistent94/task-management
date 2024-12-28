import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const TaskService = {
    getAllTasks: () => api.get('/tasks'),
    createTask: (task) => api.post('/tasks', task),
    updateTask: (id, task) => api.put(`/tasks/${id}`, task),
    deleteTask: (id) => api.delete(`/tasks/${id}`)
};

export const AuthService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData)
};