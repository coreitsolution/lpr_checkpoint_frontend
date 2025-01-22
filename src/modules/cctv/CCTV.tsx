import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../app/store"
import {
  Button,
  keyframes,
  Dialog,
  DialogTitle
} from "@mui/material"
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'

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
  fetchSettingsShortThunk,
} from "../../features/settings/settingsSlice"
import { fetchLastRecognitionsThunk } from "../../features/live-view-real-time/liveViewRealTimeSlice"

// Types
import { 
  CameraDetailSettings,
  StartStopStream,
} from "../../features/camera-settings/cameraSettingsTypes"
import { LastRecognitionData } from "../../features/live-view-real-time/liveViewRealTimeTypes"

// Utils
import { reformatString } from "../../utils/comonFunction"

// Config
import { IMAGE_URL, TELEGRAM_CHAT_ID } from '../../config/apiConfig'

dayjs.extend(buddhistEra)

const CCTV = () => {
  const dispatch: AppDispatch = useDispatch()
  const { cameraSettings } = useSelector(
    (state: RootState) => state.cameraSettings
  )

  const { settingDataShort } = useSelector(
    (state: RootState) => state.settingsData
  )

  const { filteredLiveViewRealTimeData } = useSelector(
    (state: RootState) => state.liveViewRealTimes
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
  const [isCarDetectOpen, setIsCarDetectOpen] = useState(false)
  const [selectedScreenValue, setSelectedScreenValue] = useState<number>(1)
  const [isRestartStreamDisabled, setIsRestartStreamDisabled] = useState(false)
  const [isRestartStreamAnimating, setIsRestartStreamAnimating] = useState(false)
  const [lprDetectHistoryList, setLprDetectHistoryList] = useState<LastRecognitionData[]>([])
  const [latestLprDetect, setLatestLprDetect] = useState<LastRecognitionData | null>(null)

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

  const setUpdateLastRecognition = useCallback(
    async (update: LastRecognitionData | null) => {
      if (update) {
        setStreamLPRData(update)
        setStreamLPRMapping((prevMapping) => ({
          ...prevMapping,
          [update.camera_id]: update,
        }))
        
      }
      else {
        setStreamLPRData(null)
      }
    }, [dispatch]
  )

  const setUpdateSpecialPlate = async(update: LastRecognitionData) => {
    await fetchLastRecognitions()
    await dispatch(sendMessageThunk({ 
      chatId: TELEGRAM_CHAT_ID, 
      message: `Special Plate found: ${update.plate} ${update.region_info.name_th} ${update.plate_confidence}% Type: ${update.special_plate?.plate_class_info.title_en}` 
    }))
  }

  const fetchLastRecognitions = async () => {
    try {
      const query: Record<string, string> = {
        "limit": "11",
        "orderBy": "id",
        "reverseOrder": "true",
        "filter": "is_special_plate:1",
        "includesVehicleInfo": "1",
      }
      await dispatch(fetchLastRecognitionsThunk(query))
    }
    catch (ex) {
      setLprDetectHistoryList([])
    }
  }

  useEffect(() => {
    if (filteredLiveViewRealTimeData && filteredLiveViewRealTimeData.data) {
      if (filteredLiveViewRealTimeData.data.length > 1) {
        const data = [...filteredLiveViewRealTimeData.data]
        const shiftData = data.shift()
        setLatestLprDetect(shiftData ? shiftData : null)
        setLprDetectHistoryList(filteredLiveViewRealTimeData.data.slice(1, 11))
      }
      else {
        setLatestLprDetect(filteredLiveViewRealTimeData.data[0])
        setLprDetectHistoryList([])
      }
      setIsCarDetectOpen(true)
    }
  }, [filteredLiveViewRealTimeData])

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
    catch (error) {
      console.error(error)
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
    catch (error) {
      console.error(error)
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
    dispatch(fetchSettingsShortThunk())
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
    if (settingDataShort && settingDataShort.data) {
      const numValue = Number(settingDataShort.data.live_view_count) || 1
      setSelectedScreenValue(numValue)
    }
  }, [settingDataShort])

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
          <div className={`w-full ${selectedScreenValue > 1 ? "grid grid-cols-2 lt1535:grid-cols-1" : "grid grid-cols-1 h-[98%]"} h-full gap-y-1 gap-x-5 overflow-y-auto`}>
          {
            cameraDetailSettingData.slice(0, selectedScreenValue).map((live, index) => (
              <div key={live.cam_id} id={`CCTV${index + 1}`} className="flex flex-col relative">
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
                    <div className="pb-5 flex justify-center items-center">
                      <VideoPlayer
                        streamUrl={(activeStreamUrls[index] && activeStreamUrls[index].url) || live.live_stream_url}
                        id={(activeStreamUrls[index] && activeStreamUrls[index].id) || live.alpr_cam_id}
                        customClass={`${selectedScreenValue > 1 ? "h-[34vh]" : "h-[80vh]"} w-full`}
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
                  <div key={`LPR-${index}`} id={`LPR-${index + 1}`} className="flex relative flex-col">
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
                          <div className="px-4 pb-2 w-full h-[35.7vh] py-[0.3rem] overflow-y-auto">
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
                                      <p className='truncate' title={`${reformatString(lprData.vehicle_make)} ${reformatString(lprData.vehicle_make_model)}`}>{reformatString(lprData.vehicle_make)} {reformatString(lprData.vehicle_make_model)}</p>
                                      <p className='truncate' title={`${reformatString(lprData.vehicle_color)}`}>{reformatString(lprData.vehicle_color)}</p>
                                    </div>
                                    <div>
                                      <p>{dayjs(lprData.epoch_start).format('DD-MM-BBBB')}</p>
                                      <p>{dayjs(lprData.epoch_start).format('HH:mm:ss')}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : ""}
                            {streamLPRData && selectedScreenValue === 3 ? (
                              <div className="flex flex-1 flex-col h-full">
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
                                <div className="flex flex-col h-[122px] text-center bg-tuna">
                                  <p className="text-white text-[24px] font-medium">{`${streamLPRData?.plate} ${streamLPRData?.region_info.name_th}`}</p>
                                  <p className='border-b-[2px] border-gainsboro mx-[25px] mt-[10px]'></p>
                                  <div className="grid grid-cols-2 text-white text-[18px] font-light p-2">
                                    <div className='border-r-[1px] border-gainsboro'>
                                      <p className='truncate' title={`${reformatString(streamLPRData.vehicle_make)} ${reformatString(streamLPRData.vehicle_make_model)}`}>{reformatString(streamLPRData.vehicle_make)} {reformatString(streamLPRData.vehicle_make_model)}</p>
                                      <p className='truncate' title={`${reformatString(streamLPRData.vehicle_color)}`}>{reformatString(streamLPRData.vehicle_color)}</p>
                                    </div>
                                    <div>
                                      <p>{dayjs(lprData.epoch_start).format('DD-MM-BBBB')}</p>
                                      <p>{dayjs(lprData.epoch_start).format('HH:mm:ss')}</p>
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
        <CCTVSideBar 
          setCollapse={setCollapse} 
          cameraSetting={cameraDetailSettingData} 
          setUpdateLastRecognition={setUpdateLastRecognition}
          setUpdateSpecialPlate={setUpdateSpecialPlate}
        />
      </div>
      {/* Car Detect Dialog */}
      <Dialog open={isCarDetectOpen} onClose={() => {}} className="absolute z-30">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-25 backdrop-blur-sm ">
          <div 
          className="bg-black 
          w-[85vw] h-[95vh] overflow-y-auto flex flex-col"
          >
            <DialogTitle className={`text-[25px] p-[20px]`}>
              <div className='flex items-center justify-start'>
                <img src="/icons/exclamation.png" alt="Exclamation" className='w-[40px] h-[40px]' />
                <span className='text-white ml-[15px]'>แจ้งเตือนรถเฝ้าระวัง</span>
              </div>
            </DialogTitle>
            <CarDetectDialog 
              closeDialog={() => setIsCarDetectOpen(false)} 
              latestLprDetect={latestLprDetect}
              lprDetectHistoryList={lprDetectHistoryList}
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default CCTV