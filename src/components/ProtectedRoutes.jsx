import React, { useEffect } from "react";

import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ allowedRoles }) => {
  const location = useLocation();
  let token = localStorage.getItem("jws_token");
  const { role } = JSON.parse(localStorage.getItem("user_info")) || {};

  useEffect(() => {}, [role, allowedRoles]);

  if (allowedRoles && token) {
    return <Outlet />;
  } else if (token) {
    return <Navigate to="/errorpage404" state={{ from: location }} replace />;
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // const isRoleAllowed = allowedRoles && allowedRoles.includes(role);
  // if (isRoleAllowed) {
  //     return <Outlet />;
  // } else if (token) {
  //     return <Navigate to="/errorpage404" state={{ from: location }} replace />;
  // } else {
  //     return <Navigate to="/login" state={{ from: location }} replace />;
  // }
};

export default ProtectedRoutes;
