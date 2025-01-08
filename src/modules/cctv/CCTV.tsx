import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../app/store"
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { format } from "date-fns"
import {
  Button,
  keyframes
} from "@mui/material"

// Components
import { VideoPlayer } from '../../components/video-player/VideoPlayer.js'
import Loading from "../../components/loading/Loading"

// Modules
import CCTVSideBar from './cctv-side-bar/CCTVSideBar.js'
import CarDetectDialog from './car-detect-dialog/CarDetectDialog'

// Image
import CCTVIcon from "/icons/cctv-active.png"
import CCTVSetting from "/icons/cctv-setting.png"
import LPRData from "/icons/search-car.png"

// Context
import { useHamburger } from "../../context/HamburgerContext"

// Icon
import { Icon } from '../../components/icons/Icon'
import { CircleAlert } from 'lucide-react'
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';

// API
import { 
  fetchCameraSettingsThunk,
  postStartStreamThunk,
  postStopStreamThunk,
  postRestartStreamThunk,
} from "../../features/camera-settings/cameraSettingsSlice"
import { 
  fetchSpecialPlateDataThunk,
} from "../../features/registration-data/RegistrationDataSlice"
import { 
  sendMessageThunk,
} from "../../features/telegram/TelegramSlice"
import { 
  fetchSettingsThunk,
} from "../../features/settings/settingsSlice"

// Types
import { 
  CameraDetailSettings,
  StartStopStream,
} from "../../features/camera-settings/cameraSettingsTypes"
import { LastRecognitionData } from "../../features/live-view-real-time/liveViewRealTimeTypes"

// Utils
import { capitalizeFirstLetter } from "../../utils/comonFunction"

// Config
import { IMAGE_URL, TELEGRAM_CHAT_ID } from '../../config/apiConfig'

const CCTV = () => {
  const dispatch: AppDispatch = useDispatch()
  const { cameraSettings } = useSelector(
    (state: RootState) => state.cameraSettings
  )

  const { specialPlatesData } = useSelector(
    (state: RootState) => state.registrationData
  )

  const { registrationTypes, provinces } = useSelector(
    (state: RootState) => state.dropdown
  )

  const { settingData } = useSelector(
    (state: RootState) => state.settingsData
  )

  const [isFullWidth, setIsFullWidth] = useState(false)
  const { isOpen } = useHamburger()

  const setCollapse = (status: boolean) =>  {
    setIsFullWidth(status)
  }
  const [isLoading, setIsLoading] = useState(true)
  const [cameraDetailSettingData, setCameraDetailSettingData] = useState<CameraDetailSettings[]>([])
  const [cameraSettingDropdown, setCameraSettingDropdown] = useState<{ id: number, name: string }[]>([])
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([])
  const startButtonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const stopButtonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const restartButtonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [activeStreamUrls, setActiveStreamUrls] = useState<Record<number, { id: number, url: string, name:string}>>({})
  const [streamLPRMapping, setStreamLPRMapping] = useState<Record<string, LastRecognitionData>>({})
  const [streamLPRData, setStreamLPRData] = useState<LastRecognitionData | null>(null)
  const [alertLPRData, setAlertLPRData] = useState<LastRecognitionData | null>(null)
  const [isCarDetectOpen, setIsCarDetectOpen] = useState(false)
  const [selectedScreenValue, setSelectedScreenValue] = useState<number>(1)
  const [isRestartStreamDisabled, setIsRestartStreamDisabled] = useState(false);
  const [isRestartStreamAnimating, setIsRestartStreamAnimating] = useState(false);

  const spinAnimation = keyframes`
    0% {
      transform: scaleX(-1) rotate(0deg);
    }
    100% {
      transform: scaleX(-1) rotate(-360deg);
    }
  `;

  useLayoutEffect(() => {
    setIsLoading(false)
  }, [])

  const checkSpecialPlates = useCallback((lastRecognition:LastRecognitionData): LastRecognitionData | null => {
    if (specialPlatesData && registrationTypes && provinces) {
      const matchedPlate = specialPlatesData.data?.find((spPlate) => {
        const provice = provinces.data?.find((row) => row.id === spPlate.province_id)?.name_th
        const plate = `${spPlate.plate_group}${spPlate.plate_number}${provice}`
        const lastRecognitionPlate = `${lastRecognition.plate}${lastRecognition.region_info.name_th}`
        return plate === lastRecognitionPlate && spPlate.active === 1
      })

      if (matchedPlate) {
        const registrationType = registrationTypes.data?.find((row) => row.id === matchedPlate.plate_class_id)?.title_en
        const data: LastRecognitionData = { 
          ...lastRecognition, 
          registration_type: registrationType,
          case_owner_name: matchedPlate.case_owner_name,
          case_owner_agency: matchedPlate.case_owner_agency,
        }
        return data
      }
      else {
        return null
      }
    }
    else {
      return null
    }
  }, [specialPlatesData, registrationTypes, provinces])

  const setUpdateLastRecognition = useCallback(
    async (update: LastRecognitionData | null) => {
      if (update) {
        const data = checkSpecialPlates(update)
        if (data) {
          setIsCarDetectOpen(true)
          setAlertLPRData(data)
          await dispatch(sendMessageThunk({ 
            chatId: TELEGRAM_CHAT_ID, 
            message: `Special Plate found: ${data.plate} ${data.region_info.name_th} ${data.plate_confidence}% Type: ${data.registration_type}` 
          }))
        }
        else {
          setStreamLPRData(update)
        }
        setStreamLPRMapping((prevMapping) => ({
          ...prevMapping,
          [update.camera_id]: update,
        }))
        
      }
      else {
        setStreamLPRData(null)
        setIsCarDetectOpen(false)
      }
    }, [dispatch]
  )

  const checkRegistrationTypeColor = (): string => {
    const type = alertLPRData?.registration_type?.toLocaleLowerCase()
    if (type === "blacklist") {
      return "bg-cinnabar"
    }
    else if (type === "vip") {
      return "bg-fruitSalad"
    }
    else {
      return "bg-white"
    }
  }

  const handleButtonClick = (event: React.MouseEvent, index: number) => {
    event.stopPropagation()
    setDropdownVisible(dropdownVisible === index ? null : index)
  }

  const handleClickOutside = (event: MouseEvent) => {
    const isDropdownClick = dropdownRefs.current.some(
      ref => ref && ref.contains(event.target as Node)
    )
    const isButtonClick = buttonRefs.current.some(
      ref => ref && ref.contains(event.target as Node)
    )

    if (!isDropdownClick && !isButtonClick) {
      setDropdownVisible(null)
    }
  }

  const handleRestartButtonClick = useCallback(async (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsRestartStreamDisabled(true);
    setIsRestartStreamAnimating(true);
    try {
      await dispatch(postRestartStreamThunk())
    }
    catch {
      
    } 
    finally {
      setTimeout(() => {
        setIsRestartStreamDisabled(false);
        setIsRestartStreamAnimating(false);
      }, 30000)
    }
  }, [dispatch])

  const handleStartButtonClick = useCallback(async (event: React.MouseEvent, index: number) => {
    event.stopPropagation()
    
    try {
      const uid: StartStopStream = { cam_uid: cameraDetailSettingData[index].cam_uid }
      await dispatch(postStartStreamThunk(uid))
    }
    catch {

    }
  }, [dispatch])

  const handleStopButtonClick = useCallback(async (event: React.MouseEvent, index: number) => {
    event.stopPropagation()
    
    try {
      const uid: StartStopStream = { cam_uid: cameraDetailSettingData[index].cam_uid }
      await dispatch(postStopStreamThunk(uid))
    }
    catch {

    }
  }, [dispatch])

  const handleCameraSelect = (selectedId: number, cameraIndex: number) => {
    const selectedCamera = cameraDetailSettingData.find(
      (camera) => camera.id === selectedId
    );
    if (selectedCamera) {
      setActiveStreamUrls((prevUrls) => ({
        ...prevUrls,
        [cameraIndex]: { id: selectedCamera.alpr_cam_id, url: selectedCamera.live_stream_url, name: selectedCamera.cam_id},
      }));
    }
    setDropdownVisible(null);
  };

  useEffect(() => {
    dispatch(fetchSpecialPlateDataThunk({
      "filter": "deleted:0"
    }))
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchCameraSettingsThunk())
    dispatch(fetchSettingsThunk({
      "filter": "id:1"
    }))
  }, [dispatch])

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (cameraSettings && cameraSettings.data) {
      const dropdownData = cameraSettings.data.map(({ id, cam_id }) => ({
        id,
        name: cam_id,
      }))
      setCameraSettingDropdown(dropdownData)
      setCameraDetailSettingData(cameraSettings.data)
    }
  }, [cameraSettings])

  useEffect(() => {
    if (settingData && settingData.data) {
      const numValue = Number(settingData.data[0].value) || 1
      setSelectedScreenValue(numValue)
    }
  }, [settingData])

  return (
    <div className={`main-content pe-1 ${isOpen ? "pl-[130px]" : "pl-[2px]"} transition-all duration-500`}>
      {isLoading && <Loading />}
      <div 
        id="cctv" 
        className={`flex h-full ${
          isFullWidth ? "w-full" : `${isOpen ? "w-[calc(100%-525px)]" : "w-[calc(100%-520px)]"}`
        } transition-all duration-500 lt1200:w-full`}
      >
        <div className="w-full h-full pl-[10px] pr-[20px] pt-[15px] pb-2 border-[1px] border-dodgerBlue rounded-[10px]">
          <div className={`w-full ${selectedScreenValue > 1 ? "grid grid-cols-2 lt1535:grid-cols-1" : "grid grid-cols-1 h-[98%]"} h-full gap-5 overflow-y-auto`}>
          {
            cameraDetailSettingData.slice(0, selectedScreenValue).map((live, index) => (
              <div key={live.cam_id} id={`CCTV${index + 1}`} className="flex relative">
                {/* CCTV Stream */}
                <div
                  className="flex float-left justify-center items-center w-full bg-geyser p-[2px]"
                  style={{
                    shapeOutside: "polygon(0% 0%, 130px 0%, 150px 35px, 100% 35px, 100% 100%, 0% 100%)",
                    clipPath: "polygon(0% 0%, 130px 0%, 150px 35px, 100% 35px, 100% 100%, 0% 100%)",
                  }}
                >
                  <div
                    className="h-full w-full bg-black"
                    style={{
                      shapeOutside: "polygon(0% 0%, 125px 0%, 145px 35px, 100% 35px, 100% 100%, 0% 100%)",
                      clipPath: "polygon(0% 0%, 125px 0%, 145px 35px, 100% 35px, 100% 100%, 0% 100%)",
                    }}
                  >
                    <div>
                      <div className="flex flex-row w-[95%] px-4 pt-2 pb-4 bg-black">
                        <img
                          src={CCTVIcon}
                          alt="CCTV"
                          className="w-[30px] h-[30px] mr-[10px]"
                        />
                        <label className="text-white">Live View</label>
                      </div>
                    </div>
                    <div className="pb-2 h-[92%]">
                      <VideoPlayer
                        streamUrl={(activeStreamUrls[index] && activeStreamUrls[index].url) || live.live_stream_url}
                        id={(activeStreamUrls[index] && activeStreamUrls[index].id) || live.alpr_cam_id}
                        customClass={`${selectedScreenValue > 1 ? "h-[33vh]" : "h-[80vh]"} w-full`}
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute top-1 left-[160px] text-[15px] text-white">
                  <label>จุดตรวจ : {activeStreamUrls[index] && activeStreamUrls[index].name || live.cam_id}</label>
                </div>

                <div className="absolute top-0 right-0">
                  <div className='flex'>
                    <Button
                      ref={(el) => (startButtonRefs.current[index] = el)}
                      onClick={(e) => handleStartButtonClick(e, index)}
                      className="relative z-10 h-[26px] bg-gradient-to-b from-dodgerBlue to-darkCerulean"
                      sx={{
                        textTransform: 'none',
                        marginRight: '5px',
                        display: "none",
                      }}
                    >
                      <span className='text-[14px] text-white'>Start</span>
                    </Button>

                    <Button
                      ref={(el) => (stopButtonRefs.current[index] = el)}
                      onClick={(e) => handleStopButtonClick(e, index)}
                      className="hidden relative z-10 h-[26px] bg-gradient-to-b from-dodgerBlue to-darkCerulean"
                      sx={{
                        textTransform: 'none',
                        marginRight: '5px',
                        display: "none",
                      }}
                    >
                      <span className='text-[14px] text-white'>Stop</span>
                    </Button>

                    <Button
                      ref={(el) => (restartButtonRefs.current[index] = el)}
                      onClick={(e) => handleRestartButtonClick(e)}
                      className="relative z-10 h-[26px] bg-gradient-to-b from-dodgerBlue to-darkCerulean"
                      sx={{
                        textTransform: 'none',
                        opacity: isRestartStreamDisabled ? 0.6 : 1,
                        cursor: isRestartStreamDisabled ? 'not-allowed' : 'pointer',
                      }}
                      startIcon={
                        <ReplayCircleFilledIcon 
                        sx={{
                          color: 'white',
                          transform: 'scaleX(-1)',
                          animation: isRestartStreamAnimating ? `${spinAnimation} 2s linear infinite` : 'none',
                        }}
                        />
                      }
                    >
                      {/* <Icon icon={RotateCw} size={16} color="white"></Icon> */}
                      <span className='text-[14px] text-white '>Restart Live</span>
                    </Button>

                    <Button
                      ref={(el) => (buttonRefs.current[index] = el)}
                      onClick={(e) => handleButtonClick(e, index)}
                      className="relative z-10"
                      sx={{
                        padding: "0px",
                        margin: "0px",
                        width: "0px"
                      }}
                    >
                      <img src={CCTVSetting} alt="Setting" className="w-[30px] h-[30px]" />
                    </Button>
                  </div>

                  {dropdownVisible === index && (
                    <div
                      ref={(el) => (dropdownRefs.current[index] = el)}
                      className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-sm shadow-lg z-50"
                    >
                      <ul className="py-1">
                        {cameraSettingDropdown.map((option) => (
                          <li
                            key={option.id}
                            onClick={() => handleCameraSelect(option.id, index)}
                            className={`px-4 py-2 hover:bg-gray-300 cursor-pointer text-sm text-gray-700 text-start ${index % 2 === 0 ? "bg-white" : "bg-whiteSmoke"}`}
                          >
                            {option.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* LPR Data */}
            {
              (() => {
                const lprCount = (() => {
                  if (selectedScreenValue === 1) return 0;
                  if (selectedScreenValue === 2) return 2;
                  if (selectedScreenValue === 3) return 1;
                  return 0; // For screen = 4 or undefined
                })();

                if (lprCount === 0) {
                  return ""
                }

                const liveViewWithLPR = cameraDetailSettingData
                  .slice(0, selectedScreenValue)
                  .map((live, index) => ({
                    lprData: (activeStreamUrls[index] && activeStreamUrls[index].id && streamLPRMapping[activeStreamUrls[index].id]) || streamLPRMapping[live.alpr_cam_id] || null,
                    isLPRIncluded: index < lprCount,
                  }));

                return liveViewWithLPR.map(({ lprData, isLPRIncluded }, index) => (
                  <div key={`LPR-${index}`} id={`LPR-${index + 1}`} className="flex relative">
                    {isLPRIncluded && (
                      <div
                        className="flex float-left justify-center items-center w-full bg-geyser p-[2px]"
                        style={{
                          shapeOutside: "polygon(0% 0%, 130px 0%, 150px 35px, 100% 35px, 100% 100%, 0% 100%)",
                          clipPath: "polygon(0% 0%, 130px 0%, 150px 35px, 100% 35px, 100% 100%, 0% 100%)",
                        }}
                      >
                        <div
                          className="h-full w-full bg-black pb-1"
                          style={{
                            shapeOutside: "polygon(0% 0%, 125px 0%, 145px 35px, 100% 35px, 100% 100%, 0% 100%)",
                            clipPath: "polygon(0% 0%, 125px 0%, 145px 35px, 100% 35px, 100% 100%, 0% 100%)",
                          }}
                        >
                          <div>
                            <div className="flex flex-row w-[95%] px-4 pt-2 pb-4 bg-black">
                              <img
                                src={LPRData}
                                alt="LPR Data"
                                className="w-[30px] h-[30px] mr-[10px]"
                              />
                              <label className="text-white">LPR Data</label>
                            </div>
                          </div>
                          <div className="px-4 pb-2 w-full h-[33.5vh] py-[0.3rem] overflow-y-auto">
                            {lprData && selectedScreenValue !== 3 ? (
                              <div className="flex flex-1 flex-col">
                                <div className={`flex items-center justify-center align-middle h-[190px] w-full
                                  ${ isFullWidth || !isOpen ? "bg-celti" : "" }
                                  `}>
                                  <div className={`flex items-center justify-center w-[564px] h-full
                                    ${ isFullWidth || !isOpen ? "bg-celti" : "" }
                                    `}>
                                    <img
                                      className="h-full w-[50%]"
                                      src={`${IMAGE_URL}${lprData?.vehicle_image}`}
                                      alt={`Car ${index + 1}`}
                                    />
                                    <img
                                      className="h-[60%] w-[50%]"
                                      src={`${IMAGE_URL}${lprData?.plate_image}`}
                                      alt={`Car ${index + 1}`}
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col h-[114px] text-center bg-tuna">
                                  <p className="text-white text-[24px] font-medium">{`${lprData.plate} ${lprData.region_info.name_th}`}</p>
                                  <p className='border-b-[2px] border-gainsboro mx-[25px] mt-[10px]'></p>
                                  <div className="grid grid-cols-2 text-white text-[18px] font-light p-2">
                                    <div className='border-r-[1px] border-gainsboro'>
                                      <p>{capitalizeFirstLetter(lprData.vehicle_make)} {capitalizeFirstLetter(lprData.vehicle_make_model)}</p>
                                      <p>{capitalizeFirstLetter(lprData.vehicle_color)}</p>
                                    </div>
                                    <div>
                                      <p>{format(new Date(lprData.epoch_start), "dd/MM/yyyy")}</p>
                                      <p>{format(new Date(lprData.epoch_start), "HH:mm:ss")}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : ""}
                            {streamLPRData && selectedScreenValue === 3 ? (
                              <div className="flex flex-1 flex-col">
                                <div className={`flex items-center justify-center align-middle h-[190px] w-full
                                  ${ isFullWidth || !isOpen ? "bg-celti" : "" }
                                  `}>
                                  <div className={`flex items-center justify-center w-[564px] h-full
                                    ${ isFullWidth || !isOpen ? "bg-celti" : "" }
                                    `}>
                                    <img
                                      className="h-full w-[50%]"
                                      src={`${IMAGE_URL}${streamLPRData?.vehicle_image}`}
                                      alt={`Car ${index + 1}`}
                                    />
                                    <img
                                      className="h-[60%] w-[50%]"
                                      src={`${IMAGE_URL}${streamLPRData?.plate_image}`}
                                      alt={`Car ${index + 1}`}
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col h-[114px] text-center bg-tuna">
                                  <p className="text-white text-[24px] font-medium">{`${streamLPRData?.plate} ${streamLPRData?.region_info.name_th}`}</p>
                                  <p className='border-b-[2px] border-gainsboro mx-[25px] mt-[10px]'></p>
                                  <div className="grid grid-cols-2 text-white text-[18px] font-light p-2">
                                    <div className='border-r-[1px] border-gainsboro'>
                                      <p>{capitalizeFirstLetter(streamLPRData.vehicle_make)} {capitalizeFirstLetter(streamLPRData.vehicle_make_model)}</p>
                                      <p>{capitalizeFirstLetter(streamLPRData.vehicle_color)}</p>
                                    </div>
                                    <div>
                                      <p>{format(new Date(streamLPRData.epoch_start), "dd/MM/yyyy")}</p>
                                      <p>{format(new Date(streamLPRData.epoch_start), "HH:mm:ss")}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : ""}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ));
              })()
            }
          </div>
        </div>
      </div>
      <div
        id="detail-form"
        className={`w-[515px] fixed right-0 top-[80px] overflow-auto ${
          isFullWidth ? "right-[-490px] none" : "!right-0 block"
        } transition-all duration-500 lt1200:right-[-490px] lt1200:hidden`}
      >
        <CCTVSideBar setCollapse={setCollapse} cameraSetting={cameraDetailSettingData} setUpdateLastRecognition={setUpdateLastRecognition}/>
      </div>
      {/* Car Detect Dialog */}
      <Dialog open={isCarDetectOpen} onClose={() => {}} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-25 backdrop-blur-sm ">
          <DialogPanel 
          className="bg-black 
          w-[300px] min-w-[700px] max-h-[900px] overflow-y-auto"
          >
            <DialogTitle className={`text-[25px] ${checkRegistrationTypeColor()}`}>
              <div className='flex items-center justify-start'>
                <Icon icon={CircleAlert} size={40} color="black"></Icon>
                <span className='text-black ml-[15px]'>แจ้งเตือน</span>
              </div>
            </DialogTitle>
            <CarDetectDialog 
              closeDialog={() => setIsCarDetectOpen(false)} 
              lastRecognitionResult={alertLPRData}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default CCTV