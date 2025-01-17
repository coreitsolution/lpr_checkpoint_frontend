import React from "react";
import Typography from "@mui/material/Typography";

interface VehicleDisplayProps {
  vehicleImage: string;
  pathImage: string;
  desc: string;
}

const VehicleDisplay: React.FC<VehicleDisplayProps> = ({
  vehicleImage,
  pathImage,
  desc,
}) => {
  return (
    <div className="bg-black w-full flex flex-col items-center overflow-hidden h-full">
      <div className="w-full h-full relative">
        <div className="flex items-center justify-center">
          <img
            src={vehicleImage}
            alt="Vehicle"
            className="h-[260px] w-full"
          />
        </div>

        <img
          src={pathImage}
          alt="License Plate"
          className="h-[80px] w-[180px] bottom-0 absolute border-[1px] border-white"
        />
      </div>

      {desc && (
        <div
          className="w-full bg-black text-center p-3"
          style={{
            borderTop: "1px solid gray",
            zIndex: 2,
          }}
        >
          <Typography color="white" fontSize={"0.8vw"}>{desc}</Typography>
        </div>
      )}
    </div>
  );
};

export default VehicleDisplay;
