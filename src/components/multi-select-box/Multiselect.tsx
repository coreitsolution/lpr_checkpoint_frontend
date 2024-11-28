import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { CheckPointViewModel } from "../../features/api/types";

interface MultiselectProps {
  options: CheckPointViewModel[];
  onChange: (selectedIds: number[]) => void; // Callback to pass selected IDs
}

export default function Multiselect({ options, onChange }: MultiselectProps) {
  const [value, setValue] = useState<CheckPointViewModel[]>([]);

  const handleSelectionChange = (
    event: any,
    newValue: CheckPointViewModel[]
  ) => {
    setValue(newValue);
    const selectedIds = newValue.map((option) => option.id);
    onChange(selectedIds); // Pass selected checkpoint IDs to the parent
  };

  return (
    <Autocomplete
      multiple
      id="tags-demo"
      options={options}
      getOptionLabel={(option) => option.name}
      value={value}
      onChange={handleSelectionChange}
      sx={{
        backgroundColor: "white",
        color: "black",
        borderRadius: "4px",
        marginTop: "15px",
      }}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip
              key={key}
              label={option.name}
              {...tagProps}
              style={{
                backgroundColor: "rgba(26, 109, 223, 1)",
                color: "white",
                borderRadius: "4px",
              }}
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          placeholder="ค้นหาจุดตรวจชื่อด่าน"
          sx={{
            "& .MuiInputBase-input": { color: "black" },
            "& .MuiOutlinedInput-root": {
              border: "1px solid white",
              borderRadius: "4px",
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
          }}
        />
      )}
    />
  );
}
