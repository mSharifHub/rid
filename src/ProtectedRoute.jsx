// import React, { useEffect } from "react";
// import { Hub } from "aws-amplify/utils";
import { Navigate } from "react-router-dom";
// import { getCurrentUser } from "aws-amplify/auth";
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
