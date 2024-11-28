import React from "react";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Typography } from "@mui/material";

interface TextBoxProps {
  id?: string;
  label?: string;
  variant?: "outlined" | "filled" | "standard";
  className?: string;
  placeHolder: string;
}

const TextBox: React.FC<TextBoxProps> = ({
  id = "custom-textbox",
  label,
  variant = "outlined",
  className,
  placeHolder,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <Typography variant="subtitle1" color="white">
        {label}
      </Typography>
      <TextField
        sx={{ marginTop: "15px" }}
        size="small"
        id={id}
        variant={variant}
        slots={{
          input: OutlinedInput, // Define the input component
        }}
        placeholder={placeHolder}
        slotProps={{
          input: {
            className: `bg-white w-full ${className}`, // Custom styling for the input
            style: { color: "black" }, // Ensure text is white
          },
        }}
        {...props}
      />
    </div>
  );
};

export default TextBox;
