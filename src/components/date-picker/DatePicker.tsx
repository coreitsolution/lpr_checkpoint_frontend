import React from 'react';
import { DatePicker as MuiDatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Typography } from '@mui/material';

type CustomDatePickerProps = DatePickerProps<Dayjs> & {
    label?: string;
    className?: string;
};

const DatePicker: React.FC<CustomDatePickerProps> = ({
    label = "Basic date picker",
    ...props
}) => {
    return (
        <div className='flex flex-col w-full'>
            <Typography variant='subtitle1' color='white'>{label}</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb" >
                <MuiDatePicker
                    {...props}
                    slotProps={{
                        textField: {
                            size: 'small',
                            variant: 'outlined',
                            fullWidth: true,
                            className: `bg-white rounded-sm !h-[40px]`,

                        },

                    }}
                />
            </LocalizationProvider>
        </div>
    );
};

export default DatePicker;
