import React from "react"
import { TextField, Autocomplete } from "@mui/material"
import { Typography } from '@mui/material'

// i18n
import { useTranslation } from "react-i18next";

export type OptionType = {
  value: any
  label: string
}

type AutoCompleteProps = {
  id?: string
  value: any
  onChange: (event: React.SyntheticEvent<Element, Event>, value: OptionType | null) => void
  options: OptionType[]
  label: string
  placeholder?: string
  labelFontSize?: string
  sx?: object
  disabled?: boolean
  required?: boolean
  title?: string
  error?: boolean;
  register?: any;
}

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
  title,
  error = false,
  required = false,
  register, 
  ...props
}) => {

  // i18n
  const { t } = useTranslation();
  
  const handleSelectionChange = (event: React.SyntheticEvent, newValue: OptionType | null) => {
    event.stopPropagation();
    event.preventDefault();
    onChange(event, newValue);

    if (register) {
      register.onChange({
        target: { name: register.name, value: newValue || "" },
      });
    }
  };

  const renderHighlightedText = (label: string, inputValue: string) => {
    if (!inputValue) return label

    const index = label.toLowerCase().indexOf(inputValue.toLowerCase())
    if (index === -1) return label

    return (
      <span>
        <b className="font-extrabold">
          {label.slice(index, index + inputValue.length)}
        </b>
        <span className="font-light">
          {label.slice(index + inputValue.length)}
        </span>
      </span>
    )
  }

  return (
    <div className={`flex flex-col w-full`}>
      <Typography sx={{ fontSize: labelFontSize || undefined }} variant='subtitle1' color='white'>
        {label}
        {
          required && <span className="text-red-500"> *</span>
        }
      </Typography>
      <Autocomplete
        disablePortal={false}
        value={options.find((option) => option.value === value) || null}
        onChange={handleSelectionChange}
        options={options}
        getOptionLabel={(option) => option.label || ""}
        noOptionsText={t('text.not-found-data')}
        filterOptions={(options, state) =>
          options.filter((option) =>
            option.label.toLowerCase().startsWith(state.inputValue.toLowerCase())
          )
        }
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
          "& .MuiOutlinedInput-root": {
            "& > div": {
              padding: "3px !important",
              gap: "4px",
              display: "flex",
            }
          },
          ...sx,
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder || ""}
            error={error}
            InputLabelProps={{
              sx: { fontSize: labelFontSize },
            }}
          />
        )}
        disabled={disabled}
        title={title || ""}
        renderOption={(props, option, { inputValue }) => {
          const { key, ...otherProps } = props
          return (
            <li {...otherProps} key={key}>
              {renderHighlightedText(option.label, inputValue)}
            </li>
          )
        }}
        {...props}
      />
    </div>
  )
}

export default AutoComplete