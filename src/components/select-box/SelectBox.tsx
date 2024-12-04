/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { OutlinedInput, Typography } from '@mui/material';

type SelectBoxProps = SelectProps & {
    id?: string;
    value: any;
    onChange: (event: SelectChangeEvent<any>) => void;
    options: { value: any; label: string }[];
    label: string;
    className?: string;
};

const SelectBox: React.FC<SelectBoxProps> = ({
    id,
    value,
    onChange,
    options,
    label,
    className,
    ...props
}) => {
    return (
        <div className='flex flex-col w-full'>
            <Typography variant='subtitle1' color='white'>{label}</Typography>
            <Select
                id={id}
                value={value}
                input={<OutlinedInput label="" />}
                className={`bg-white  h-[40px] min-w-[100px] w-full className ${className}`}
                onChange={onChange}
                {...props}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
};

export default SelectBox;
