import React from 'react';

import { Navigate, Outlet } from 'react-router-dom'

// const useAuth = () => {
//     const user = localStorage.getItem('user')
//     if (user) {
//         return true
//     } else {
//         return false
//     }
// }

const ProtectedRoutes = () => {

    //const auth = useAuth()
    let token = localStorage.getItem('token');

    return token ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoutes;