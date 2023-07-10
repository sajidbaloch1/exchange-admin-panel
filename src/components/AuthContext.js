// AuthContext.js
import React, { createContext, useState } from 'react';
import { postData } from '../utils/fetch-services-without-token';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);

    const login = (username, password) => {
        setLoading(true);
        const result = postData('auth/login', {
            username: username,
            password: password
        });
        if (result.success) {
            console.log(result);
            // setTransactions(result.data);
            // setTotalPages(Math.ceil(result.data.totalRecords / rowsPerPage));
        }
        setLoading(false);
        //localStorage.setItem('token', 'new test');
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
