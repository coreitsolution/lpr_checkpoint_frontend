import React from "react";
import Typography from "@mui/material/Typography";

interface VehicleDisplayProps {
  pathImageVehicle: string;
  pathImage: string;
  desc: string;
}

const VehicleDisplay: React.FC<VehicleDisplayProps> = ({
  pathImageVehicle,
  pathImage,
  desc,
}) => {
  return (
    <div className="bg-black w-90 flex flex-col items-center overflow-hidden">
      <div style={{ width: "280px", height: "9vw", position: "relative" }}>
        <img
          src={pathImageVehicle}
          alt="Vehicle"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            display: "block",
          }}
        />

        <img
          src={pathImage}
          alt="License Plate"
          style={{
            width: "5vw",
            position: "absolute",
            bottom: "10px",
            left: "10px",
            border: "2px solid white",
          }}
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
