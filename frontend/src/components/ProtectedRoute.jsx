import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  if (userInfo) {
    return <Outlet />;
  } else {
    return <Navigate to="/signin" />;
  }
};

export default ProtectedRoute;
