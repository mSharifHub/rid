import React, { FormEvent, RefObject } from "react";
import { Autocomplete } from "@react-google-maps/api";

interface RequestRideFormProps {
  calculateAndSetRoute: (event: FormEvent<HTMLFormElement>) => void;
  handleCenterUserPosition: React.MouseEventHandler<HTMLButtonElement>;
  originRef: RefObject<HTMLInputElement>;
  destinationRef: RefObject<HTMLInputElement>;
}

export default function RequestRideForm({
  calculateAndSetRoute,
  handleCenterUserPosition,
  originRef,
  destinationRef,
}: RequestRideFormProps) {
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-white bg-opacity-75 w-[30rem] h-[15rem] rounded-lg">
      <form
        onSubmit={calculateAndSetRoute}
        className="h-full flex flex-col justify-center items-center"
      >
        <label htmlFor="origin-form" className="sr-only">
          Origin
        </label>
        {/* from input or ping location */}
        <div className="w-[90%]  relative">
          <Autocomplete>
            <input
              ref={originRef}
              name="origin-form"
              id="origin-form"
              type="text"
              placeholder="ride from"
              className="w-full  h-10 focus:ring-0 focus:ring-offset-0 focus:outline-none placeholder:capitalize placeholder:text-slate-400 placeholder:px-2 placeholder:text-start text-start text-slate-500 flex justify-start items-center px-2 rounded-lg border-2 border-slate-200"
            />
          </Autocomplete>
          <div className="h-full w-10 absolute right-0 top-1/2 -translate-y-1/2 bg-indigo-500 rounded-r-lg border-2">
            <div className="flex h-full justify-center items-center">
              <button
                type="button"
                onClick={handleCenterUserPosition}
                className="flex transition-all duration-200 ease-in-out bg-white h-3 w-3 rounded-full hover:animate-ping hover:scale-110 cursor-pointer"
              ></button>
            </div>
          </div>
        </div>

        <label htmlFor="destination-form" className="sr-only">
          Destination
        </label>
        <div className="w-[90%]">
          <Autocomplete>
            <input
              ref={destinationRef}
              name="destination-form"
              id="destination-form"
              type="text"
              placeholder="ride to"
              className="mt-4 w-full h-10 focus:ring-0 focus:ring-offset-0 focus:outline-none placeholder:capitalize placeholder:text-slate-400 placeholder:px-2 placeholder:text-start rounded-lg border-2 border-slate-200"
            />
          </Autocomplete>
        </div>

        <button
          type="submit"
          className="flex justify-center items-center mt-4 h-8 w-20 rounded-lg text-white text-center bg-indigo-500 capitalize transition-transform duration-200 ease-out hover:scale-105 cursor-pointer"
        >
          request
        </button>
      </form>
    </div>
  );
}
