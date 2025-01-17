import React from "react";
import { TextField, Autocomplete, Typography, Chip, Checkbox } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

export type OptionType = {
  value: any;
  label: string;
};

type AutoCompleteProps = {
  id?: string;
  value: OptionType[];
  onChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: OptionType[]
  ) => void;
  options: OptionType[];
  label: string;
  placeholder?: string;
  labelFontSize?: string;
  sx?: object;
  disabled?: boolean;
  limitTags?: number;
};

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AutoCompleteMultiple: React.FC<AutoCompleteProps> = ({
  id,
  value,
  onChange,
  options,
  label,
  placeholder,
  labelFontSize = "15px",
  sx,
  disabled = false,
  limitTags = 1,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <Typography
        sx={{ fontSize: labelFontSize }}
        variant="subtitle1"
        color="white"
      >
        {label}
      </Typography>
      <Autocomplete
        multiple
        id={id || "tags-outlined"}
        value={value}
        onChange={onChange}
        limitTags={limitTags}
        options={options}
        noOptionsText={'ไม่พบข้อมูล'}
        disableCloseOnSelect
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
                sx={{
                  height: "20px"
                }}
              />
              {option.label}
            </li>
          );
        }}
        renderTags={(tagValue, getTagProps) => {
          const numTags = tagValue.length;
          const limitTags = 1;

          return (
            <>
              {tagValue.slice(0, limitTags).map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={index}
                  label={option.label}
                  sx={{
                    backgroundColor: "#2B9BED",
                    color: "white",
                    display: "flex",
                    height: "23px",
                    alignItems: "center",
                    "& .MuiChip-label": {
                      padding: "0 8px",
                    },
                    "& .MuiChip-deleteIcon": {
                      color: "white",
                      marginRight: "4px",
                      marginTop: "1px"
                    }
                  }}
                />
              ))}

              {numTags > limitTags && ` +${numTags - limitTags}`}
            </>
          );
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
              "& .MuiInputBase-root": {
                minHeight: "40px",
                padding: "2px 8px",
                "& .MuiInputBase-input": {
                  height: "25px",
                  padding: "0 !important"
                }
              },
              "& .MuiOutlinedInput-root": {
                "& > div": {
                  padding: "3px !important",
                  gap: "4px",
                  display: "flex",
                }
              },
            }}
          />
        )}
        disabled={disabled ? disabled : false}
        sx={{
          width: "100%",
          ...sx,
        }}
        {...props}
      />
    </div>
  );
};

export default AutoCompleteMultiple;