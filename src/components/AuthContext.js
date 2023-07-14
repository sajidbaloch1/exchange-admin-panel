// AuthContext.js
import React, { createContext, useState } from 'react';
import { postData } from '../utils/fetch-services-without-token';
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();
    const login = async (username, password) => {
        setLoading(true);
        const result = await postData('auth/login', {
            username: username,
            password: password
        });
        if (result.success) {

            localStorage.setItem('user_info', JSON.stringify(result.data.user));
            localStorage.setItem('jws_token', result.data.token);
            setIsAuthenticated(true);
            navigate('/dashboard');
        } else {
            setLoginError(result.message);
        }
        setLoading(false);
    };

    const logout = () => {

        setIsAuthenticated(false);
        localStorage.removeItem('user_info');
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loginError }}>
            {children}
        </AuthContext.Provider>
    );
};
