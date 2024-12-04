import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Typography } from "@mui/material";

interface TextBoxProps {
  id?: string;
  label?: string;
  variant?: "outlined" | "filled" | "standard";
  className?: string;
  placeHolder: string;
  value?: string;
  onChange?: (value: string) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  isError?: boolean;
  helperText?: string | null;
  disabled?: boolean;
}

const TextBox: React.FC<TextBoxProps> = ({
  id = "custom-textbox",
  label,
  variant = "outlined",
  className,
  placeHolder,
  onChange,
  value,
  onKeyPress,
  isError = false,
  helperText,
  disabled,
  ...props
}) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyPress) {
      onKeyPress(event);
    }
  };
  
  return (
    <div className="flex flex-col w-full">
      <Typography variant="subtitle1" color="white">
        {label}
      </Typography>
      <TextField
        error={isError}
        sx={{ marginTop: "15px" }}
        size="small"
        id={id}
        variant={variant}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={value}
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
        helperText={isError ? helperText : ""}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};

export default TextBox;
