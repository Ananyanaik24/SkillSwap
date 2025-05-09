import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // assuming you store JWT in localStorage after login

  if (!token) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  // If logged in, render the children components (Dashboard, Search, Match, etc.)
  return children;
};

export default PrivateRoute;