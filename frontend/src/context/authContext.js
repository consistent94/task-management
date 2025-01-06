import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

// Create the auth context
const AuthContext = createContext(null);

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if the user is logged on mount 
        const user = authService.getCurrentUser();
        if (user) {
            setUser(user);
        }
        setLoading(false);
    }, []);
    
    // Login function
    const login = async (credentials) => {
        const response = await authService.login(credentials);
        setUser(response.user);
        return response;
    };

    // Register function
    const register = async (userData) => {
        const response = await authService.register(userData);
        setUser(response.user);
        return response;
    };

    // Logout function
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);