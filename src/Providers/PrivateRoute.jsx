import React, { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  const location = useLocation();

  if (loading) {
    <span className="loading loading-spinner loading-lg"></span>;
  }

  if (user) {
    return children;
  }

  return (
    <Navigate to={"/"} state={{ from: location }} replace>
      {children}
    </Navigate>
  );
};

export default PrivateRoute;
