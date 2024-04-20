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
    <div className="flex flex-col  h-full justify-around  ">
      <div>
        <h2 className="capitalize font-black text-lg mb-4 text-center">
          API and tools from
        </h2>
        <div className="flex flex-row justify-around items-center gap-x-2  ">
          <FontAwesomeIcon
            icon={faAws}
            className=" transition-all duration-300 ease-out text-9xl text-orange-400  shadow-md w-40 h-40 p-2 hover:scale-110 cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faReact}
            className=" transition-all duration-300 ease-out text-9xl text-blue-400 shadow-md w-40 h-40 p-2 hover:scale-110 cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faGoogle}
            className="transition-all duration-300 ease-out text-9xl text-red-400 shadow-md w-40 h-40 p-2 hover:scale-110 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-center items-center mt-4">
        <button
          className="border-2 border-white font-black w-60 h-14 rounded-full "
          typeof="button"
          onClick={handleLogin}
        >
          <span className="capitalize text-lg"> app </span>
        </button>
      </div>
    </div>
  );
};
