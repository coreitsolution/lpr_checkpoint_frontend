import React, {useState} from 'react'

// Components
import DatePickerBuddhist from "../../../components/date-picker-buddhist/DatePickerBuddhist"

interface ConnectionStatusProps {
  closeDialog: () => void
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({closeDialog}) => {
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)

  return (
    <div 
      id='connection-status' 
      className='bg-black text-white'
    >
      <div className='grid grid-cols-2 gap-x-[20px]'>
        <div>
          <label>From Date</label>
          <DatePickerBuddhist
            value={fromDate}
            sx={{
              marginTop: "8px",
              borderRadius: "5px",
              backgroundColor: "white",
              "& .MuiTextField-root": {
                height: "fit-content",
              },
              "& .MuiOutlinedInput-input": {
                fontSize: 14
              }
            }}
            className="w-full"
            id="start-arrest-date"
            onChange={(value) => setFromDate(value)}
          >
          </DatePickerBuddhist>
        </div>

        <div>
        <label>To Date</label>
          <DatePickerBuddhist
            value={toDate}
            sx={{
              marginTop: "8px",
              borderRadius: "5px",
              backgroundColor: "white",
              "& .MuiTextField-root": {
                height: "fit-content",
              },
              "& .MuiOutlinedInput-input": {
                fontSize: 14
              }
            }}
            className="w-full"
            id="start-arrest-date"
            onChange={(value) => setToDate(value)}
          >
          </DatePickerBuddhist>
        </div>
      </div>
      <div className='flex justify-end space-x-2 mt-[20px]'>
        <button 
          className='flex justify-center items-center bg-dodgerBlue text-white mt-[20px] rounded-[5px] w-[100px] hover:bg-blue-500'
        >
          <img src="/icons/chart-icon.png" alt="Chart Img" className='w-[30px] h-[30px]' />
          <span>แสดงผล</span>
        </button>
        <button 
          className='text-dodgerBlue bg-white p-[10px] mt-[20px] rounded-[5px] hover:bg-gray-200'
          onClick={closeDialog}
        >
          ล้างข้อมูล
        </button>
      </div>
    </div>
  )
}

export default ConnectionStatus