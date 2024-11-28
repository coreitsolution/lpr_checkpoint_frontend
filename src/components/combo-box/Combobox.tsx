import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";

interface ComboBoxProps {
  options: any[];
  labelField: string;
  placeHolder: string;
}

const StyledAutocomplete = styled(Autocomplete)({
  "& .MuiAutocomplete-option": {
    "&[aria-selected='true']": {
      backgroundColor: "#2196f3",
      color: "white",
    },
    "&:hover": {
      backgroundColor: "#bbdefb",
      color: "black",
    },
  },
});

const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  labelField,
  placeHolder,
}) => {
  return (
    <StyledAutocomplete
      disablePortal
      options={options}
      getOptionLabel={(option) => option[labelField] || ""}
      sx={{
        width: "100%",
        backgroundColor: "white",
        borderRadius: "4px",
        marginTop: "15px",
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label=""
          size="small"
          placeholder={placeHolder}
        />
      )}
      renderOption={(props, option, { selected }) => (
        <li
          {...props}
          style={{
            backgroundColor: selected ? "#2196f3" : "white",
            color: selected ? "white" : "black",
          }}
        >
          {option[labelField]}
        </li>
      )}
    />
  );
};

export default ComboBox;
