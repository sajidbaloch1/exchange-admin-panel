// AuthContext.js
import React, { createContext, useState } from 'react';
import { postData } from '../utils/fetch-services-without-token';
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const BaseURL = process.env.REACT_APP_BASE_URL;

    // const ipAddressDetail = fetch("https://api.ipdata.co")
    //     .then(response => {
    //         return response.json();
    //     }, "jsonp")
    //     .then(res => {
    //         console.log(res.ip)
    //     })
    //     .catch(err => console.log(err))

    // console.log(ipAddressDetail);

    const navigate = useNavigate();
    const login = async (username, password) => {
        setLoading(true);
        const result = await postData('auth/login', {
            username: username,
            password: password
        });
        if (result.success) {
            if (result.data.user.forcePasswordChange) {
                navigate('/reset-password');
                navigate("/reset-password", { state: { id: result.data.user._id, token: result.data.token } });
            } else {
                localStorage.setItem('user_info', JSON.stringify(result.data.user));
                localStorage.setItem('jws_token', result.data.token);
                setIsAuthenticated(true);
                setLoginError('')
                navigate('/dashboard');
            }
        } else {
            setLoginError(result.message);
        }
        setLoading(false);
    };

    const resetPassword = async (request, token) => {
        setLoading(true);

        const response = await fetch(`${BaseURL}/auth/resetPassword`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json; charset=utf-8',
                Accept: 'application/json',
            },
            body: JSON.stringify(request),
        });

        const result = await response.json();
        if (result.success) {

            localStorage.setItem('user_info', JSON.stringify(result.data));
            localStorage.setItem('jws_token', token);
            setIsAuthenticated(true);
            setLoginError('')
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
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loginError, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};
