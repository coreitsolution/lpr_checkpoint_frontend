import React from 'react'
import { IMAGE_URL } from '../../../config/apiConfig'

// Types
import { LastRecognitionData } from "../../../features/live-view-real-time/liveViewRealTimeTypes"

// Utils
import { capitalizeFirstLetter } from "../../../utils/comonFunction"

interface CarDetectDialogProps {
  closeDialog: () => void
  lastRecognitionResult : LastRecognitionData | null
}

const CarDetectDialog: React.FC<CarDetectDialogProps> = ({closeDialog, lastRecognitionResult}) => {
  
  const checkRegistrationTypeColor = (): string => {
    const type = lastRecognitionResult?.registration_type?.toLocaleLowerCase()
    if (type === "blacklist") {
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
          {`${lastRecognitionResult?.plate} ${lastRecognitionResult?.region_info.name_th ? lastRecognitionResult.region_info.name_th : ""}`}
        </div>
        <div className='grid grid-cols-[auto_250px] gap-2'>
          <div>
            <div className='relative'>
              <img src={`${IMAGE_URL}${lastRecognitionResult?.vehicle_image}`} alt="Vehicle Image" className='w-full' />
              <img src={`${IMAGE_URL}${lastRecognitionResult?.plate_image}`} alt="Plate Image" className='absolute bottom-0 left-0 w-[40%] h-[25%]' />
            </div>
            <div className='border-[1px] border-dodgerBlue p-3 mt-[5px] flex items-center justify-center'>
              <p className={`text-[20px] ${checkRegistrationTypeColor()}`}>{lastRecognitionResult?.registration_type}</p>
            </div>
          </div>
          <div className='border-[1px] border-dodgerBlue p-3 flex flex-col justify-between h-[49vh] overflow-y-auto'>
            <div className='grid grid-cols-2 gap-y-5'>
              <p>ประเภท : </p>
              <p className='text-wrap'>{capitalizeFirstLetter(lastRecognitionResult?.vehicle_body_type ? lastRecognitionResult?.vehicle_body_type : "")}</p>
              <p>ยี่ห้อ : </p>
              <p className='text-wrap'>{capitalizeFirstLetter(lastRecognitionResult?.vehicle_make ? lastRecognitionResult?.vehicle_make : "")}</p>
              <p>รุ่น : </p>
              <p className='text-wrap'>{capitalizeFirstLetter(lastRecognitionResult?.vehicle_make_model ? lastRecognitionResult?.vehicle_make_model : "")}</p>
              <p>สี : </p>
              <p className='text-wrap'>{capitalizeFirstLetter(lastRecognitionResult?.vehicle_color ? lastRecognitionResult?.vehicle_color : "")}</p>
              <p>กลุ่มทะเบียน : </p>
              <p className='text-wrap'>{lastRecognitionResult?.registration_type}</p>
            </div>
            <div className='grid grid-cols-2 gap-y-5'>
              <p>เจ้าของข้อมูล : </p>
              <p className='text-wrap'>{lastRecognitionResult?.case_owner_name}</p>
              <p>หน่วยงาน : </p>
              <p className='text-wrap'>{lastRecognitionResult?.case_owner_agency}</p>
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