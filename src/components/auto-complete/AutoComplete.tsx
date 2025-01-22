import React from "react"
import { TextField, Autocomplete } from "@mui/material"
import { Typography } from '@mui/material'

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
  title?: string
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
  ...props
}) => {

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
        title={ title ? title : ""}
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
