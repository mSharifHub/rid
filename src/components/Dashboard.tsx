import React from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import MapComponent from "./MapComponent";

export const Dashboard: React.FC = () => {
  const { signOut } = useAuthenticator((context) => [context.user]);

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
          <MapComponent />
        </div>
      </div>
    </>
  );
};
