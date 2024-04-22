// import React, { useEffect } from "react";
// import { Hub } from "aws-amplify/utils";
import { Navigate } from "react-router-dom";
// import { getCurrentUser } from "aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";

const ProtectedRoute = ({ children }) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  // useEffect(() => {
  //   return Hub.listen("auth", ({ payload }) => {
  //     switch (payload.event) {
  //       case "signedIn":
  //         fetchUser();
  //         break;
  //     }
  //   });
  // }, []);

  // const fetchUser = async () => {
  //   const user = await getCurrentUser();
  //   console.log(user.username);
  // };

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
