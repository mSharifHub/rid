import React, { ReactElement, Suspense } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { useAuthenticator } from "@aws-amplify/ui-react";
const LazyMap = React.lazy(() => import("./Map")); // Dynamically import the Map component

export const Dashboard: React.FC = () => {
  const { signOut } = useAuthenticator((context) => [context.user]);

  const render = (status: "LOADING" | "FAILURE" | "SUCCESS"): ReactElement => {
    switch (status) {
      case "LOADING":
        return <h1>Loading map...</h1>;
      case "FAILURE":
        return <h1>Failed to load map</h1>;
      case "SUCCESS":
        return (
          <Suspense fallback={<div>Loading Map...</div>}>
            <LazyMap />
          </Suspense>
        );
      default:
        return <div> {status}</div>;
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-12 ">
        <div className=" flex  flex-row justify-between items-center ">
          <div></div>
          <div>
            <button
              className="flex  justify-center items-center  text-black border-2 rounded-lg w-20 h-8 text-xs capitalize"
              onClick={signOut}
            >
              sign out
            </button>
          </div>
        </div>
        <div className=" flex justify-center items-center ">
          <Wrapper
            apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
            render={render}
          />
        </div>
      </div>
    </>
  );
};
