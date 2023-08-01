import React, { useEffect } from 'react';

import { Navigate, Outlet, useLocation } from 'react-router-dom'

const ProtectedRoutes = ({ allowedRoles }) => {

    //const auth = useAuth()
    const location = useLocation();
    let token = localStorage.getItem('jws_token');
    const { role } = JSON.parse(localStorage.getItem('user_info')) || {};

    // console.log(allowedRoles?.find(roles => roles === role));
    // console.log(role);
    // console.log(allowedRoles);

    useEffect(() => {

    }, [role, allowedRoles]);

    const isRoleAllowed = allowedRoles && allowedRoles.includes(role);

    if (isRoleAllowed) {
        return <Outlet />;
    } else if (token) {
        return <Navigate to="/errorpage404" state={{ from: location }} replace />;
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }


}

export default ProtectedRoutes;