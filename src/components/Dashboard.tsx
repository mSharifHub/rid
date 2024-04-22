import React from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  return (
    <>
      <h2>Welcome, {user.username}!</h2>
      <button onClick={signOut}>Sign Out</button>
    </>
  );
};
