import React, { Suspense } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
const MapComponent = React.lazy(() => import("./MapComponent"));

export const Dashboard: React.FC = () => {
  const { signOut } = useAuthenticator((context) => [context.user]);

  return (
    <>
      <div className="flex flex-col space-y-12 ">
        <Suspense fallback={<div className="text-black">Loading Map...</div>}>
          <MapComponent />
        </Suspense>

        <button
          className="flex  justify-center items-center  text-black border-2 rounded-lg w-20 h-8 text-xs capitalize"
          onClick={signOut}
        >
          sign out
        </button>
      </div>
    </>
  );
};
