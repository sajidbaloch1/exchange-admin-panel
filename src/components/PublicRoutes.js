import React from 'react';

import { Navigate, Outlet } from 'react-router-dom'

const PublicRoutes = () => {

    //const auth = useAuth()
    let token = localStorage.getItem('token');
    return token ? <Navigate to="/dashboard" /> : <Outlet />
}

export default PublicRoutes;