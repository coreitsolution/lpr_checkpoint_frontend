import { DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import { Typography } from '@mui/material'
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import buddhistEraAdapter from "../../utils/buddhistEraAdapter"
import dayjs, { Dayjs } from 'dayjs';

type CustomDatePickerProps = Omit<DatePickerProps<Dayjs>, 'value' | 'onChange'> & {
    id?: string
    label?: string
    labelTextSize?: string
    className?: string
    value: Date | null
    onChange: (date: Date | null, context: any) => void
    isWithTime?: boolean
}

const DatePickerBuddhist: React.FC<CustomDatePickerProps> = ({
    id,
    label,
    labelTextSize,
    onChange,
    value,
    isWithTime,
    ...props
}) => {
  const dayjsValue = value ? dayjs(value) : null;

  const handleDateChange = (date: dayjs.Dayjs | null, context: any) => {
    if (onChange) {
      onChange(date?.toDate() || null, context);
    }
  }

  const textFieldProps = {
    size: 'medium' as 'medium',
    style: { height: '40px', justifyContent: 'center' },
    fullWidth: true,
    inputProps: {
      placeholder: 'วว/ดด/ปปปป ชช:นน',
    },
  }

  return (
    <div id={id} className='flex flex-col w-full'>
      {label && (
        <Typography
          variant="subtitle1"
          color="white"
          sx={{ fontSize: labelTextSize }}
        >
          {label}
        </Typography>
      )}
      <LocalizationProvider dateAdapter={buddhistEraAdapter} adapterLocale="th" >
        {
          !isWithTime ? 
          (
            <DatePicker
              {...props}
              value={dayjsValue}
              onChange={handleDateChange}
              slotProps={{ textField: textFieldProps }}
            />
          ) : 
          (
            <DateTimePicker
              {...props as DateTimePickerProps<Dayjs>}
              value={dayjsValue}
              onChange={handleDateChange}
              slotProps={{ textField: textFieldProps }}
            />
          )}
      </LocalizationProvider>
    </div>
  )
}

export default DatePickerBuddhist