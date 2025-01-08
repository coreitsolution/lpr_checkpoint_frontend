import { DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { Typography } from '@mui/material'
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import buddhistEraAdapter from "../../utils/buddhistEraAdapter"
import dayjs, { Dayjs } from 'dayjs';

type CustomDatePickerProps = Omit<DatePickerProps<Dayjs>, 'value' | 'onChange'> & {
    id?: string
    label?: string
    className?: string
    value: Date | null
    onChange: (date: Date | null, context: any) => void
}

const DatePickerBuddhist: React.FC<CustomDatePickerProps> = ({
    id,
    label,
    onChange,
    value,
    ...props
}) => {
  const dayjsValue = value ? dayjs(value) : null;

  const handleDateChange = (date: dayjs.Dayjs | null, context: any) => {
    if (onChange) {
      onChange(date?.toDate() || null, context);
    }
  };
  return (
    <div id={id} className='flex flex-col w-full'>
      <Typography variant='subtitle1' color='white'>{label}</Typography>
      <LocalizationProvider dateAdapter={buddhistEraAdapter} adapterLocale="th" >
        <DatePicker
          {...props}
          value={dayjsValue}
          onChange={handleDateChange}
          slotProps={{ 
            textField: { 
              size: "medium",
              style: { height: '40px', justifyContent: "center" },
              fullWidth: true,
              inputProps: {
                placeholder: "วว/ดด/ปปปป",
              },
            },
          }}
        />
      </LocalizationProvider>
    </div>
  )
}

export default DatePickerBuddhist