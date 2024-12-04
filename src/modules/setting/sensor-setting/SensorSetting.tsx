import React, {useState, useRef, useCallback, useEffect} from 'react'
import { AppDispatch } from "../../../app/store"
import { useSelector, useDispatch } from "react-redux"

// Types
import {
  CameraSettings
} from '../../../features/camera-settings/cameraSettingsTypes'
import { CustomShape } from "../../../components/drawing-canvas/types"

// Components
import TextBox from '../../../components/text-box/TextBox'
import DrawingCanvas from '../../../components/drawing-canvas/DrawingCanvas'

// Icon
import { Icon } from '../../../components/icons/Icon'
import { Save } from 'lucide-react'

// Pop-up
import PopupMessage from "../../../utils/popupMessage"

// API
import { 
  putCameraSettingThunk,
} from "../../../features/camera-settings/cameraSettingsSlice"

interface SensorSettingProps {
  closeDialog: () => void
  selectedRow: CameraSettings | null
}

const SensorSetting: React.FC<SensorSettingProps> = ({closeDialog, selectedRow}) => {

  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false)
  const [clearCanvas, setClearCanvas] = useState(false)
  const [sensorSettingData, setSensorSettingData] = useState<CustomShape | null>(null)
  const [originalData, setOriginalData] = useState<CustomShape | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    if (selectedRow) {
      if (selectedRow.sensor_setting) {
        setSensorSettingData(selectedRow.sensor_setting)
        setOriginalData(selectedRow.sensor_setting)
      }
    }
  }, [selectedRow])

  const handleCustomShapeDrawn = (customShape: CustomShape) => {
    setIsDrawingEnabled(false)
    setSensorSettingData(customShape)
    console.log('CustomShape drawn:', customShape)
  }

  const handleClearCanvas = () => {
    setClearCanvas(true)
    setTimeout(() => setClearCanvas(false), 0)
    setSensorSettingData(null)
  }

  const hasChanges = () => {
    return JSON.stringify(sensorSettingData ? sensorSettingData : "") !== JSON.stringify(originalData ? originalData : "")
  }

  const handleSubmitClick = useCallback(async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()

    try {
      if (selectedRow) {
        if (!hasChanges()) {
          PopupMessage("ไม่พบการเปลี่ยนแปลง", "ข้อมูลไม่มีการเปลี่ยนแปลง", "warning")
          return
        }
        else {
          let updateData = selectedRow
          updateData = {
            ...selectedRow, 
            sensor_setting: sensorSettingData ? sensorSettingData : null
          }
          if (updateData) {
            await dispatch(putCameraSettingThunk(updateData))
            PopupMessage("", "บันทึกข้อมูลสำเร็จ", 'success')
          } 
          else {
            PopupMessage("พบข้อผิดพลาด", "กรุณาใส่ข้อมูลให้ครบถ้วน", 'error')
          }
        }
      }
    } 
    catch (error) {
      PopupMessage("พบข้อผิดพลาด", `ไม่สามารถสร้างการตั้งค่ากล้องได้: ${error}`, 'error')
    }
  }, [dispatch, sensorSettingData, selectedRow])

  return (
    <div id='sensor-setting'>
      <div className="bg-black text-white p-[5px] w-full">
        <div className='flex justify-between mb-3 h-[120px]'>
          <div className='w-[50%]'>
            <TextBox
              id="camera-id"
              label="กล้อง (ID)"
              placeHolder=""
              className="w-full"
              value={selectedRow?.checkpoint_id}
              disabled={true}
            />
          </div>
          <div className='flex items-end justify-end'>
            {/* Clear Button */}
            <button 
              type="button" 
              className="flex items-center justify-center bg-white w-[90px] h-[40px] rounded mr-[10px]" 
              onClick={() => handleClearCanvas()}
            >
              <img src="/icons/clear.png" alt="Clear" className='w-[20px] h-[20px]' />
              <span className='ml-[5px] text-dodgerBlue'>Clear</span>
            </button>
            {/* Submit Button */}
            <button 
              type="button" 
              className="flex items-center justify-center bg-dodgerBlue w-[90px] h-[40px] rounded mr-[10px]" 
              onClick={(e) => handleSubmitClick(e)}
            >
              <Icon icon={Save} size={20} color='white' />
              <span className='ml-[5px]'>Submit</span>
            </button>
          </div>
        </div>
        <div className='p-5 border-[1px] border-dodgerBlue mb-[30px]'>
          <div className='relative mb-[10px]'>
            <img 
              src="/images/car_test.png" 
              alt="Sensor Image"
              className='w-full h-[450px]'
              ref={imgRef}
            />
            {imgRef.current && (
              <DrawingCanvas
                imgRef={imgRef.current}
                onShapeDrawn={handleCustomShapeDrawn}
                selectedRow={selectedRow}
                isDrawingEnabled={isDrawingEnabled}
                clearCanvas={clearCanvas}
              />
            )}  
          </div>
          <div className='flex justify-center'>
            <div className='flex justify-between w-[60%]'>
              {/* Start Button */}
              <button 
                type="button" 
                className={`flex items-center justify-center w-[90px] h-[40px] rounded mr-[10px] ${ !isDrawingEnabled ? "bg-dodgerBlue" : "bg-dodgerBlue/30"}`} 
                onClick={() => setIsDrawingEnabled(!isDrawingEnabled)}
                disabled={isDrawingEnabled}
              >
                <img src="/icons/start.png" alt="Start" className='w-[20px] h-[20px]' />
                <span className='ml-[5px]'>Start</span>
              </button>
              {/* Stop Button */}
              <button 
                type="button" 
                className="flex items-center justify-center bg-dodgerBlue w-[90px] h-[40px] rounded mr-[10px]" 
              >
                <img src="/icons/stop.png" alt="Stop" className='w-[20px] h-[20px]' />
                <span className='ml-[5px]'>Stop</span>
              </button>
              {/* Restart Button */}
              <button 
                type="button" 
                className="flex items-center justify-center bg-dodgerBlue w-[90px] h-[40px] rounded mr-[10px]" 
              >
                <img src="/icons/restart.png" alt="Restart" className='w-[20px] h-[20px]' />
                <span className='ml-[5px]'>Restart</span>
              </button>
              {/* Apply Button */}
              <button 
                type="button" 
                className="flex items-center justify-center bg-dodgerBlue w-[90px] h-[40px] rounded mr-[10px]" 
              >
                <img src="/icons/apply.png" alt="Apply" className='w-[20px] h-[20px]' />
                <span className='ml-[5px]'>Apply</span>
              </button>
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <button 
            type="button" 
            className="bg-white border-[1px] border-dodgerBlue text-dodgerBlue w-[90px] h-[40px] rounded" 
            onClick={closeDialog}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  )
}

export default SensorSetting