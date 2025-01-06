import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth'; 

const authService = {
    async register(userData) {
        const response = await axios.post(`${API_URL}/register`, userData);
        if (response.data.token) {
            localStorage.setItem('token', JSON.stringify(response.data));
            localStorage.setItem('user', JSON.stringify(response.data));
        } 
        return response.data;
    },

    async login(credentials) {
            const response = await axios.post(`${API_URL}/login`, credentials);
            if (response.data.token) {
                localStorage.setItem('token', JSON.stringify(response.data));
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
    },

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    },

    getToken() {
        return localStorage.getItem('token');
    }
};

export default authService;