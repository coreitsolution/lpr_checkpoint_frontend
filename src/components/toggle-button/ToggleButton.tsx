import React from "react"

type ToggleButtonProps = {
  onChange?: (checked: boolean) => void
  checked?: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({onChange, checked}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.checked)
    }
  }

  return (
    <label className="relative inline-block w-12 h-6">
      <input
        type="checkbox"
        className="opacity-0 w-0 h-0 peer"
        onChange={handleChange}
        checked={checked}
      />
      <span
        className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-nobel2 transition-all duration-300 peer-checked:bg-emerald rounded-full"
      ></span>
      <span
        className="absolute left-1 bottom-1 bg-white transition-transform duration-300 h-4 w-4 peer-checked:translate-x-6 rounded-full"
      ></span>
    </label>
  )
}

export default ToggleButton
