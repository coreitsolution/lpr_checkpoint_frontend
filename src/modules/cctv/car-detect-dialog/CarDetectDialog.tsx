import React, {useState, useEffect} from 'react'
import { getUrls } from '../../../config/runtimeConfig';
import { format } from "date-fns";
import Skeleton from '@mui/material/Skeleton';
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

// Types
import { LastRecognitionData } from "../../../features/live-view-real-time/liveViewRealTimeTypes"

// Utils
import { reformatString } from "../../../utils/commonFunction"

// Component
import Loading from "../../../components/loading/Loading"

// i18n
import { useTranslation } from "react-i18next";

interface CarDetectDialogProps {
  open: boolean
  closeDialog: () => void
  latestLprDetect: LastRecognitionData | null
  lprDetectHistoryList: LastRecognitionData[]
}

const CarDetectDialog: React.FC<CarDetectDialogProps> = ({open, closeDialog, latestLprDetect, lprDetectHistoryList}) => {
  // i18n
  const { t } = useTranslation();
  
  const [isLoading, setIsLoading] = useState(false)
  const { IMAGE_URL } = getUrls();

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  }, [latestLprDetect, lprDetectHistoryList])

  const checkRegistrationTypeColor = (value: string | undefined): {icon: string, textColor: string} => {
    let textColor = ""
    let icon = ""
    if (!value) {
      return { icon: icon, textColor: textColor }
    }

    const type = value.toLocaleLowerCase() 
    if (type === "blacklist") {
      textColor = "text-darkRed"
      icon = "/icons/red-waring.png"
    }
    else if (type === "vip") {
      textColor = "text-fruitSalad"
      icon = "/icons/vip.png"
    }
    else {
      textColor = "text-dodgerBlue"
      icon = "/icons/member.png"
    }

    return { icon: icon, textColor: textColor }
  }

  const createVehicleInfo = (data: LastRecognitionData | null, newLine: boolean): JSX.Element | string => {
    if (!data) return ""

    const brand = checkBrand(data)
    const model = checkModel(data)
    const color = checkColor(data)

    return newLine ? 
    (
      <>
        {brand}
        <br />
        {model}
        <br />
        {color}
      </>
    ) : 
    `${brand}_${model}_${color}`
  }

  const checkBrand = (data: LastRecognitionData): string => {
    if (data.vehicle_make_info) {
      return data.vehicle_make_info.make_en
    }
    else {
      return reformatString(data.vehicle_make)
    }
  }

  const checkModel = (data: LastRecognitionData): string => {
    if (data.vehicle_model_info) {
      return data.vehicle_model_info.model_en
    }
    else {
      return reformatString(data.vehicle_make_model)
    }
  }

  const checkColor = (data: LastRecognitionData): string => {
    if (data.vehicle_color_info) {
      return data.vehicle_color_info.color_th
    }
    else {
      return reformatString(data.vehicle_color)
    }
  }
  
  return (
    <Dialog id="car-detect-dialog" open={open} onClose={() => {}} maxWidth="xl" fullWidth sx={{ zIndex: 1000 }}>
      <DialogTitle className={`text-[25px] p-[20px] bg-black`}>
        <div className='flex items-center justify-start'>
          <img src="/icons/exclamation.png" alt="Exclamation" className='w-[40px] h-[40px]' />
          <span className='text-white ml-[15px]'>{t('screen.special-plate-alert')}</span>
        </div>
      </DialogTitle>
      <DialogContent className="bg-black text-white">
        <div id='h-full'>
          {isLoading && <Loading />}
          <div className="bg-black px-[20px] w-full h-full">
            <div className='grid grid-cols-[600px_1fr] h-full pb-4 gap-4'>
              {/* Latest Infomation */}
              <div className='border-[1px] border-charade py-2 px-4 h-full'>
                {/* header */}
                {
                  latestLprDetect ? 
                  (
                    <div className='flex items-center justify-start space-x-2 text-white'>
                      <img src={`${checkRegistrationTypeColor(latestLprDetect?.special_plate?.plate_class_info.title_en).icon}`} alt="Icon" className='h-[30px] w-[30px]' />
                      <p className='text-[20px] font-bold'>{latestLprDetect?.special_plate?.plate_class_info.title_en}</p>
                    </div>
                  ) :
                  (
                    <div className='flex space-x-2'>
                      <Skeleton sx={{ bgcolor: 'grey.900' }} variant="circular" width={30} height={30} />
                      <Skeleton sx={{ bgcolor: 'grey.900' }} variant="rectangular" width={100} height={30} />
                    </div>
                  )
                }
                {/* body */}
                {
                  latestLprDetect ? 
                  (
                    <div className='flex flex-col mt-2'>
                    <div className='flex relative h-[26vh]'>
                      <img src={`${IMAGE_URL}${latestLprDetect?.vehicle_image}`} alt="Vehicle Image" className='w-full h-full' />
                      <img src={`${IMAGE_URL}${latestLprDetect?.plate_image}`} alt="Plate Image" className='w-[200px] h-[10vh] absolute bottom-0' />
                    </div>
                    <div className='bg-swamp text-center p-2'>
                      <span className='text-[17px] text-white'>{`${latestLprDetect?.plate} ${latestLprDetect?.region_info.name_th}`}</span>
                    </div>
                  </div>
                  ) :
                  (
                    <div className='mt-2'>
                      <Skeleton sx={{ bgcolor: 'grey.900' }} variant="rectangular" width={"100%"} height={"30vh"} />
                    </div>
                  )
                }
                {/* Footer */}
                <div className='mt-2 h-[62%] overflow-auto'>
                  {
                    latestLprDetect ?
                    (
                      <table className='text-[13.5px] w-full text-white'>
                        <tbody>
                          <tr className='border-b-[1px] border-dashed border-darkGray h-[45px]'>
                            <td className='bg-celtic p-2 w-[150px]'>{t('table.column.brand-model-color')}</td>
                            <td className='bg-tuna p-2 w-[416px]'>
                              {
                                createVehicleInfo(latestLprDetect, false)
                              }
                            </td>
                          </tr>
                          <tr className='border-b-[1px] border-dashed border-darkGray h-[45px]'>
                            <td className='bg-celtic p-2 w-[150px]'>{t('table.column.type')}</td>
                            <td className='bg-tuna p-2 w-[416px]'>{latestLprDetect?.vehicle_body_type_info.body_type_th}</td>
                          </tr>
                          <tr className='border-b-[1px] border-dashed border-darkGray h-[45px]'>
                            <td className='bg-celtic p-2 w-[150px]'>{t('table.column.plate-type')}</td>
                            <td className={`bg-tuna p-2 w-[416px] font-bold ${checkRegistrationTypeColor(latestLprDetect?.special_plate?.plate_class_info.title_en).textColor}`}>{latestLprDetect?.special_plate?.plate_class_info.title_en}</td>
                          </tr>
                          <tr className='border-b-[1px] border-dashed border-darkGray h-[60px]'>
                            <td className='bg-celtic p-2 w-[150px]'>{t('table.column.behavior')}</td>
                            <td className='bg-tuna p-2 w-[416px]'>{latestLprDetect?.special_plate?.behavior}</td>
                          </tr>
                          <tr className='border-b-[1px] border-dashed border-darkGray h-[45px]'>
                            <td className='bg-celtic p-2 w-[150px]'>{t('table.column.owner-data')}</td>
                            <td className='bg-tuna p-2 w-[416px]'>{latestLprDetect?.special_plate?.case_owner_name}</td>
                          </tr>
                          <tr className='border-b-[1px] border-dashed border-darkGray h-[45px]'>
                            <td className='bg-celtic p-2 w-[150px]'>{t('table.column.owner-agency')}</td>
                            <td className='bg-tuna p-2 w-[416px]'>{latestLprDetect?.special_plate?.case_owner_agency}</td>
                          </tr>
                          <tr className='border-b-[1px] border-dashed border-darkGray h-[45px]'>
                            <td className='bg-celtic p-2 w-[150px]'>{t('table.column.checkpoint')}</td>
                            <td className='bg-tuna p-2 w-[416px]'>{latestLprDetect?.camera_info ? latestLprDetect?.camera_info.cam_id : ""}</td>
                          </tr>
                          <tr className='border-b-[1px] border-dashed border-darkGray h-[45px]'>
                            <td className='bg-celtic p-2 w-[150px]'>{t('table.column.lpr-detect')}</td>
                            <td className='bg-tuna p-2 w-[416px]'>{latestLprDetect?.epoch_start ? format(new Date(latestLprDetect?.epoch_start), "dd/MM/yyyy (HH:mm:ss)") : ""}</td>
                          </tr>
                        </tbody>
                      </table>
                    ) :
                    <Skeleton sx={{ bgcolor: 'grey.900' }} variant="rectangular" width={"100%"} height={"40vh"} />
                  }
                </div>
              </div>
              {/* History Infomation */}
              <div className='flex flex-col h-full'>
                {/* Header */}
                <div className='w-full h-[78.8vh] overflow-auto'>
                  {
                    latestLprDetect ?
                    (
                      <table className='w-full text-white'>
                        <thead className="text-[14px] sticky top-0 z-10 bg-swamp backdrop-blur-md bg-opacity-80">
                          <tr className='text-center h-[65px]'>
                            <td className='w-[15%]'>{t('table.column.plate')}</td>
                            <td className='w-[13%]'>{t('table.column.image')}</td>
                            <td className='w-[12%]'>{t('table.column.checkpoint')}</td>
                            <td className='w-[8%]'>{t('table.column.group')}<br />{t('table.column.plate')}</td>
                            <td className='w-[12%]'>{t('table.column.brand-model')}</td>
                            <td className='w-[25%]'>{t('table.column.behavior')}</td>
                            <td className='w-[8%] whitespace-pre-line'>{t('table.column.date-time')}<br />{t('table.column.detect')}</td>
                          </tr>
                        </thead>
                        <tbody className='text-[14px]'>
                          { lprDetectHistoryList && lprDetectHistoryList.length > 0
                            ? lprDetectHistoryList.map((data, index) => (
                              <tr
                                key={`history-data-${index + 1}`}
                                className="h-[50px] max-h-[50px] border-b-[1px] border-dashed border-darkGray"
                              >
                                <td className="bg-tuna pl-2">
                                  {  
                                    data.plate + " " + data.region_info.name_th
                                  }
                                </td>
                                <td className="bg-celtic text-center">
                                  <div>
                                    <img key={`${index}_vehicle_image`} src={`${IMAGE_URL}${data.vehicle_image}`} alt={`${index}_vehicle_image`} className="inline-flex items-center justify-center align-middle h-[65px] w-[60px]" />
                                    <img key={`${index}_plate_image`} src={`${IMAGE_URL}${data.plate_image}`} alt={`${index}_plate_image`} className="inline-flex items-center justify-center align-middle h-[65px] w-[60px]" />
                                  </div>
                                </td>
                                <td className="bg-tuna pl-2">{data.camera_info ? data.camera_info.cam_id : ""}</td>
                                <td className={`bg-celtic pl-2 font-bold ${checkRegistrationTypeColor(data.special_plate?.plate_class_info.title_en).textColor}`}>{data.special_plate?.plate_class_info.title_en}</td>
                                <td className="bg-tuna pl-2 max-w-[124px] truncate">
                                  {createVehicleInfo(data, true)}
                                </td>
                                <td className="bg-celtic pl-2">{data.special_plate?.behavior}</td>
                                <td className="bg-tuna text-center">{data?.epoch_start ? format(new Date(data?.epoch_start), "dd/MM/yyyy (HH:mm:ss)") : ""}</td>
                              </tr>
                            ))
                            : null
                          }
                        </tbody>
                      </table>
                    ) :
                    <Skeleton sx={{ bgcolor: 'grey.900' }} variant="rectangular" width={"100%"} height={"78.8vh"} />
                  }
                </div>
              </div>
              {/* Footer */}
              <div className='col-start-2 flex justify-end ml-7'>
                <button 
                  type="button" 
                  className="bg-white text-black w-[90px] h-[40px] rounded" 
                  onClick={closeDialog}
                >
                  {t('button.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CarDetectDialog