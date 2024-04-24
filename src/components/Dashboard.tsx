import React from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

const MapComponent = React.lazy(() => import("./MapComponent"));

export const Dashboard: React.FC = () => {
  const { signOut } = useAuthenticator((context) => [context.user]);

  return (
    <>
      <div className=" h-screen w-screen">
        <MapComponent />
      </div>
    </>
  );
};
