import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAws, faReact, faGoogle } from "@fortawesome/free-brands-svg-icons";

export const Home: React.FunctionComponent = () => {
  const navigate: NavigateFunction = useNavigate();

  const handleLogin = (): void => {
    navigate("/auth");
  };
  return (
    <div className="flex flex-col min-h-screen  justify-around items-center ">
      <div>
        <h2 className="capitalize font-extralight text-lg mb-4 justify-center items-center ">
          API and tools from
        </h2>
        <div className="flex  flex-wrap  justify-around items-center gap-x-4   ">
          <FontAwesomeIcon
            icon={faAws}
            className=" transition-all duration-200 ease-out text-7xl sm:text-9xl text-orange-400   p-2 hover:scale-110 cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faReact}
            className=" transition-all duration-200 ease-out  text-7xl sm:text-9xl text-blue-400   p-2 hover:scale-110 cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faGoogle}
            className="transition-all duration-200 ease-out   text-7xl sm:text-9xl text-red-400   p-2 hover:scale-110 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-center items-center mt-4">
        <button
          className="border-2 rounded-full w-40 h-10  transition-all duration-200 ease-in-out  cursor-pointer hover:scale-105"
          typeof="button"
          onClick={handleLogin}
        >
          <span className="capitalize text-md"> app </span>
        </button>
      </div>
    </div>
  );
};
