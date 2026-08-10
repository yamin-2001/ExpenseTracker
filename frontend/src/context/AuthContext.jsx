import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const register = async (userData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', userData);
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            navigate('/');
        } catch (error) {
            console.error(error);
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const login = async (userData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', userData);
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            navigate('/');
        } catch (error) {
            console.error(error);
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
