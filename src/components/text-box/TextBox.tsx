import React, { useState } from "react"
import { InputAdornment, IconButton, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TextField, {TextFieldProps} from "@mui/material/TextField";

type TextBoxProps = TextFieldProps & {
  id?: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  label: string
  placeholder?: string
  labelFontSize?: string
  sx?: object
  disabled?: boolean
  title?: string
  error?: boolean
  helperText?: string | null;
  variant?: "outlined" | "filled" | "standard"
  required?: boolean
  type?: string
  register?: any;
  isMultiline?: boolean;
  rows?: number;
  autoComplete?: string;
}

const TextBox: React.FC<TextBoxProps> = ({
  id,
  value,
  onChange,
  onKeyPress,
  label,
  placeholder,
  labelFontSize = "15px",
  sx,
  disabled,
  title,
  error,
  helperText,
  variant = "outlined",
  required = false,
  type = "text",
  register,
  isMultiline = false,
  rows,
  autoComplete,
  ...props
}) => {
  // State
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const actualType = isPasswordType && showPassword ? "text" : type;

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event)
      if (register) {
        register.onChange({
          target: { name: register.name, value: event.target.value || "" },
        });
      }
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyPress) {
      onKeyPress(event)
    }
  }

  return (
    <div className="flex flex-col w-full">
      <Typography sx={{ fontSize: labelFontSize || undefined }} variant='subtitle1' color='white'>
        {`${label}`}
        {
          required && <span className="text-red-500"> *</span>
        }
      </Typography>
      <TextField
        id={id}
        value={value}
        type={actualType}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || ""}
        disabled={disabled}
        error={error}
        helperText={helperText ?? ""}
        variant={variant}
        multiline={isMultiline}
        rows={rows}
        autoComplete={autoComplete ?? (type === "password" ? "current-password" : undefined)}
        sx={{
          borderRadius: "5px",
          backgroundColor: "white",
          "& .MuiInputBase-root": {
            minHeight: "40px",
            padding: "2px 8px",
            "& .MuiInputBase-input": {
              height: "25px",
              padding: "0 !important"
            },
            "&.Mui-error": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#d32f2f",
                borderWidth: "2px"
              }
            },
          },
          "& .Mui-disabled": {
            backgroundColor: "#DDD",
          },
          ...sx,
        }}
        InputLabelProps={{
          sx: { fontSize: labelFontSize },
        }}
        InputProps={{
          endAdornment: isPasswordType && (
            <InputAdornment position="end" className="mr-2">
              <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
        title={title || ""}
        {...props}
      />
    </div>
  )
}

export default TextBox