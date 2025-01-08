import React from "react";
import { TextField, Autocomplete } from "@mui/material";
import { Typography } from '@mui/material';

type OptionType = {
  value: any;
  label: string;
};

type AutoCompleteProps = {
  id?: string;
  value: any;
  onChange: (event: React.SyntheticEvent<Element, Event>, value: OptionType | null) => void;
  options: OptionType[];
  label: string;
  placeholder?: string;
  labelFontSize?: string;
  sx?: object;
  disabled?: boolean;
};

const AutoComplete: React.FC<AutoCompleteProps> = ({
  id,
  value,
  onChange,
  options,
  label,
  placeholder,
  labelFontSize = "15px",
  sx,
  disabled,
  ...props
}) => {
  return (
    <div className={`flex flex-col w-full`}>
      <Typography sx={{ fontSize: labelFontSize || undefined }} variant='subtitle1' color='white'>{label}</Typography>
      <Autocomplete
        disablePortal
        value={options.find((option) => option.value === value) || null}
        onChange={onChange}
        options={options}
        getOptionLabel={(option) => option.label || ""}
        noOptionsText={'ไม่พบข้อมูล'}
        filterOptions={(options, state) =>
          options.filter((option) =>
            option.label.toLowerCase().startsWith(state.inputValue.toLowerCase())
          )
        }
        sx={{
          width: "100%",
          "& .MuiInputBase-root": {
            height: "40px",
          },
          ...sx,
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder || ""}
            InputLabelProps={{
              sx: { fontSize: labelFontSize },
            }}
            sx={{
              borderRadius: "5px",
              backgroundColor: "white",
              "& .MuiInputBase-input": {
                height: "40px",
                padding: "8px",
              },
            }}
          />
        )}
        disabled={disabled ? disabled : false}
        {...props}
      />
    </div>
  );
};


export default AutoComplete;
