import React, {useState, useRef, useCallback, useEffect} from 'react'
import { getUrls } from '../../../config/runtimeConfig';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material"
import { fetchClient, combineURL } from "../../../utils/fetchClient"

// Types
import {
  CameraDetailSettings,
  CameraSettingsData,
} from '../../../features/camera-settings/cameraSettingsTypes'
import { DetectionArea } from "../../../components/drawing-canvas/types"

// Components
import TextBox from '../../../components/text-box/TextBox'
import DrawingCanvas from '../../../components/drawing-canvas/DrawingCanvas'

// Icon
import { Icon } from '../../../components/icons/Icon'
import { Save } from 'lucide-react'

// Pop-up
import { PopupMessage } from "../../../utils/popupMessage"


// i18n
import { useTranslation } from "react-i18next";

interface SensorSettingProps {
  open: boolean
  closeDialog: () => void
  selectedRow: CameraDetailSettings | null
}

const SensorSetting: React.FC<SensorSettingProps> = ({open, closeDialog, selectedRow}) => {
  // i18n
  const { t } = useTranslation();

  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false)
  const [clearCanvas, setClearCanvas] = useState(false)
  const [sensorSettingData, setSensorSettingData] = useState<DetectionArea | null>(null)
  const [originalData, setOriginalData] = useState<DetectionArea | null>(null)
  const [isRestarting, setIsRestarting] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const { IMAGE_URL, API_URL } = getUrls();

  useEffect(() => {
    if (selectedRow) {
      if (selectedRow.detection_area) {
        setSensorSettingData(JSON.parse(selectedRow.detection_area))
        setOriginalData(JSON.parse(selectedRow.detection_area))
      }
    }
  }, [selectedRow])

  const handleCustomShapeDrawn = (customShape: DetectionArea) => {
    setIsDrawingEnabled(false)
    setSensorSettingData(customShape)
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
          PopupMessage(t('message.warning.no-change-found'), t('message.warning.data-not-change'), "warning")
          return
        }
        else if (!sensorSettingData) {
          PopupMessage(t('message.warning.data-incomplete'), t('message.warning.please-input-sensor-data'), "warning")
          return
        }
        else {
          let updateData = selectedRow
          updateData = {
            ...selectedRow, 
            detection_area: sensorSettingData ? JSON.stringify(sensorSettingData) : ""
          }
          if (updateData) {
            await fetchClient<CameraSettingsData>(combineURL(API_URL, "/cameras/update"), {
              method: "PATCH",
              body: JSON.stringify(updateData),
            })
            PopupMessage(t('message.success.data-saved-successfully'), t('message.success.data-saved-successfully-detail'), "success")
          } 
          else {
            PopupMessage(t('message.error.something-wrong-occur'), t('message.error.please-input-all-data'), 'error')
          }
        }
      }
    } 
    catch (error) {
      PopupMessage(t('message.error.something-wrong-occur'), t('message.error.setting-camera-error', { error: error }), 'error')
    }
  }, [sensorSettingData, selectedRow])

  const onRestartClick = useCallback(async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setIsRestarting(true)
    
    try {
      if (selectedRow) {
        await fetchClient<CameraSettingsData>(combineURL(API_URL, "/cameras/update"), {
          method: "PATCH",
          body: JSON.stringify(selectedRow),
        })
        PopupMessage(t('message.success.restart-engine-success'), "", "success")
        setTimeout(() => {
          setIsRestarting(false)
        }, 30000)
      }
    } 
    catch (error) {
      PopupMessage(t('message.error.something-wrong-occur'), t('message.error.restart-engine-error', { error: error }), 'error')
      setIsRestarting(false)
    }
  }, [selectedRow])

  return (
    <Dialog id='sensor-setting' open={open} maxWidth={false} 
    sx={{ zIndex: 1000 }}
    slotProps={{
      paper: {
        sx: {
          maxWidth: '950px',
          width: '100%'
        },
      }
    }}
    >
      <DialogTitle className='bg-black'>
        <div className="flex justify-between items-center">
          <Typography variant="h5" color="white" className="font-bold">{t('screen.sensor-setting')}</Typography>
          <button
            onClick={closeDialog} 
            className="text-white bg-transparent border-0 text-[28px] pr-6"
          >
            &times;
          </button>
        </div>
      </DialogTitle>
      <DialogContent className='bg-black'>
        <div>
          <div className="bg-black text-white p-[5px] w-full">
            <div className='flex justify-between mb-3 h-[120px]'>
              <div className='w-[50%]'>
                <TextBox
                  id="camera-id"
                  label={t('component.camera-id')}
                  className="w-full"
                  value={selectedRow?.cam_id}
                  disabled={true}
                />
              </div>
              <div className='flex items-end justify-end space-x-2'>
                {/* Clear Button */}
                <button 
                  type="button" 
                  className="flex items-center justify-center bg-white w-[90px] h-[40px] rounded" 
                  onClick={() => handleClearCanvas()}
                >
                  <img src="/icons/clear.png" alt="Clear" className='w-[20px] h-[20px]' />
                  <span className='ml-[5px] text-dodgerBlue'>{t('button.clear')}</span>
                </button>
                {/* Start Button */}
                <button 
                  type="button" 
                  className={`flex items-center justify-center w-[150px] h-[40px] rounded 
                    ${ !isDrawingEnabled ? "bg-dodgerBlue" : "bg-dodgerBlue/30"}
                    disabled:bg-celti
                  `} 
                  onClick={() => setIsDrawingEnabled(!isDrawingEnabled)}
                  disabled={isDrawingEnabled || sensorSettingData !== null}
                >
                  <img src="/icons/start.png" alt="Start" className='w-[20px] h-[20px]' />
                  <span className='ml-[5px]'>{t('button.start-plot-sensor')}</span>
                </button>
              </div>
            </div>
            <div className='p-5 border-[1px] border-dodgerBlue mb-[30px]'>
              <div className='relative mb-[10px]'>
                <img
                  src={`${IMAGE_URL}${selectedRow?.sample_image_url}`}
                  alt="Sensor Image"
                  className={`w-full h-[450px]`}
                  ref={imgRef}
                  onError={(e) => {
                    e.currentTarget.src = "/images/no-image.png"
                    e.currentTarget.classList.add("object-cover")
                  }}
                />
                { 
                  !selectedRow?.sample_image_url && (
                    <label className='absolute inset-0 flex items-center justify-center text-black bg-white'>{t('text.camera-not-working')}</label>
                  )
                }
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
                {/* Restart Button */}
                <button
                  type="button"
                  disabled={isRestarting}
                  className={`flex items-center justify-center w-[90px] h-[40px] rounded mr-[10px] 
                    ${isRestarting ? 'bg-gray-400 cursor-not-allowed' : 'bg-dodgerBlue'}
                  `}
                  onClick={onRestartClick}
                >
                  <img
                    src={isRestarting ? "/icons/restart-disable.png" : "/icons/restart.png"}
                    alt="Restart"
                    className={`w-[20px] h-[20px] ${isRestarting ? 'animate-spin' : ''}`}
                  />
                  <span className="ml-[5px]">{t('button.restart')}</span>
                </button>
              </div>
            </div>
            <div className='flex space-x-2 justify-end'>
              {/* Submit Button */}
              <button 
                type="button" 
                className="flex items-center justify-center bg-dodgerBlue w-[90px] h-[40px] rounded" 
                onClick={(e) => handleSubmitClick(e)}
              >
                <Icon icon={Save} size={20} color='white' />
                <span className='ml-[5px]'>{t('button.submit')}</span>
              </button>
              <button 
                type="button" 
                className="bg-white border-[1px] border-dodgerBlue text-dodgerBlue w-[90px] h-[40px] rounded" 
                onClick={closeDialog}
              >
                {t('button.cancel')}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SensorSetting