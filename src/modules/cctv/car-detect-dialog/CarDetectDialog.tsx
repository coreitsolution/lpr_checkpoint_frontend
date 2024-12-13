import React from 'react'

// Types
import { LastRecognitionResult } from "../../../features/live-view-real-time/liveViewRealTimeTypes"

interface CarDetectDialogProps {
  closeDialog: () => void
  lastRecognitionResult : LastRecognitionResult | null
}

const CarDetectDialog: React.FC<CarDetectDialogProps> = ({closeDialog, lastRecognitionResult}) => {
  
  const checkRegistrationTypeColor = (): string => {
    const type = lastRecognitionResult?.registration_type.toLocaleLowerCase()
    if (type === "black list") {
      return "text-cinnabar"
    }
    else if (type === "vip") {
      return "text-fruitSalad"
    }
    else {
      return "text-white"
    }
  }
  
  return (
    <div id='car-detect-dialog'>
      <div className="bg-black p-4 w-full">
        <div className='text-[20px] mb-[5px]'>
          {lastRecognitionResult?.registration_type}
        </div>
        <div className='grid grid-cols-[auto_250px] gap-2'>
          <div>
            <div className='relative'>
              <img src={lastRecognitionResult?.pathImageVehicle} alt="Vehicle Image" />
              <img src={lastRecognitionResult?.pathImage} alt="Plate Image" className='absolute bottom-0 left-0 w-[40%] h-[25%]' />
            </div>
            <div className='border-[1px] border-dodgerBlue p-3 mt-[5px] flex items-center justify-center'>
              <p className={`text-[20px] ${checkRegistrationTypeColor()}`}>{lastRecognitionResult?.plate}</p>
            </div>
          </div>
          <div className='border-[1px] border-dodgerBlue p-3 flex flex-col justify-between h-[49vh] overflow-y-auto'>
            <div className='grid grid-cols-2 gap-y-5'>
              <p>ประเภท : </p>
              <p className='text-wrap'>{lastRecognitionResult?.vehicle.type}</p>
              <p>ยี่ห้อ : </p>
              <p className='text-wrap'>{lastRecognitionResult?.vehicle.brand}</p>
              <p>รุ่น : </p>
              <p className='text-wrap'>{lastRecognitionResult?.vehicle.model}</p>
              <p>สี : </p>
              <p className='text-wrap'>{lastRecognitionResult?.vehicle.color}</p>
              <p>กลุ่มทะเบียน : </p>
              <p className='text-wrap'>{lastRecognitionResult?.registration_type}</p>
            </div>
            <div className='grid grid-cols-2 gap-y-5'>
              <p>เจ้าของข้อมูล : </p>
              <p className='text-wrap'>{lastRecognitionResult?.ownerPerson.name}</p>
              <p>หน่วยงาน : </p>
              <p className='text-wrap'>{lastRecognitionResult?.agency.agency}</p>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className='flex justify-end my-2 ml-7'>
          <button 
            type="button" 
            className="bg-white border-[1px] border-dodgerBlue text-dodgerBlue w-[90px] h-[40px] rounded" 
            onClick={closeDialog}
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  )
}

export default CarDetectDialog