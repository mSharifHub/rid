import React, { Suspense } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { useAuthenticator } from "@aws-amplify/ui-react";
const LazyMap = React.lazy(() => import("./Map")); // Dynamically import the Map component

export const Dashboard: React.FC = () => {
  const { signOut } = useAuthenticator((context) => [context.user]);

  type GoogleMapsStatus = "LOADING" | "FAILURE" | any;
  const render = (status: GoogleMapsStatus) => {
    if (status === "LOADING") {
      return <h1>loading map...</h1>;
    } else if (status === "FAILURE") {
      return <h1>failure</h1>;
    } else {
      return (
        <Suspense fallback={<div>Loading Map...</div>}>
          <LazyMap />
        </Suspense>
      );
    }
  };

  return (
    <>
      <div className="flex flex-col border-2">
        <button onClick={signOut}>Sign Out</button>
        <div className="flex justify-center items-center">
          <Wrapper
            apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
            render={render}
          />
        </div>
      </div>
    </>
  );
};
