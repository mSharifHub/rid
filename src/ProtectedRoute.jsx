
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";

const ProtectedRoute = ({ children }) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus === "configuring") {
    return <div>Loading...</div>;
  }

  return authStatus === "authenticated" ? (
    children
  ) : (
    <Navigate to="/auth" replace />
  );
};

export default ProtectedRoute;
