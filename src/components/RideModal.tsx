import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";

interface DriverState {
  position: {
    lat: number;
    lng: number;
  };
  driverDirection: google.maps.DirectionsResult | null;
  driverDistance: string | null;
  driverDuration: string | null;
  isVisible: boolean;
}

type AcceptTripModalProps = {
  children: ReactNode;
  driver: DriverState;
};

export default function RideModal({ children, driver }: AcceptTripModalProps) {
  return (
    <div className="absolute h-40 w-[20rem] top-40 left-1/2 -translate-x-1/2 z-50  rounded-lg bg-slate-50  transition-all duration-500 animate-pulse hover:cursor-pointer border-2">
      <div className="grid h-full grid-cols-[0.25fr,1fr,0.25fr]">
        <div className="cols-span-1 col-start-1  h-full flex justify-center items-center text-6xl text-slate-300 px-2">
          <FontAwesomeIcon icon={faCar} />
        </div>
        <div className="cols-span-1 col-start-2 h-full flex flex-col justify-center items-center text-slate-500 font-bold capitalize">
          <span>{driver.driverDistance}</span>
          <span className="">{driver.driverDuration}</span>
        </div>
        <div className="cols-span-1 col-start-3  h-full flex justify-center items-center">
          fair
        </div>
        <div className="col-span-3 row-start-2 flex justify-center items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
