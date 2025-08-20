import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useSelector } from "react-redux"
import { RootState } from "../../app/store"
import {
  Button,
  // keyframes,
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
// import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import { Icon } from '../../components/icons/Icon'
import { Play, Square } from 'lucide-react'

// Types
import { 
  CameraDetailSettings,
  StartStopStream,
} from "../../features/camera-settings/cameraSettingsTypes"
import { 
  LastRecognitionData, 
  RealTimeLprData, 
  LastRecognitionResult 
} from "../../features/live-view-real-time/liveViewRealTimeTypes"

// Utils
import { reformatString, isNumber } from "../../utils/commonFunction.js"
import { fetchClient, combineURL } from "../../utils/fetchClient"

// Config
import { getUrls } from '../../config/runtimeConfig';

// i18n
import { useTranslation } from "react-i18next";

dayjs.extend(buddhistEra)

const CCTV = () => {
  // i18n
  const { t, i18n } = useTranslation();

  const { 
    IMAGE_URL, 
    TELEGRAM_CHAT_ID, 
    TELEGRAM_URL, 
    API_URL, 
    STREAM_URL 
  } = getUrls();
  const { cameraSettings } = useSelector(
    (state: RootState) => state.cameraSettings
  )

  const { settingDataShort } = useSelector(
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
  // const restartButtonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [activeStreamUrls, setActiveStreamUrls] = useState<Record<number, { id: number, url: string, name:string}>>({})
  const [streamLPRMapping, setStreamLPRMapping] = useState<Record<string, RealTimeLprData>>({})
  const [streamLPRData, setStreamLPRData] = useState<RealTimeLprData | null>(null)
  const [isCarDetectOpen, setIsCarDetectOpen] = useState(false)
  const [selectedScreenValue, setSelectedScreenValue] = useState<number>(1)
  // const [isRestartStreamDisabled, setIsRestartStreamDisabled] = useState(false)
  // const [isRestartStreamAnimating, setIsRestartStreamAnimating] = useState(false)
  const [lprDetectHistoryList, setLprDetectHistoryList] = useState<LastRecognitionData[]>([])
  const [latestLprDetect, setLatestLprDetect] = useState<LastRecognitionData | null>(null)
  const [filteredLiveViewRealTimeData, setFilteredLiveViewRealTimeData] = useState<LastRecognitionData[]>([]);

  // const spinAnimation = keyframes`
  //   0% {
  //     transform: scaleX(-1) rotate(0deg);
  //   }
  //   100% {
  //     transform: scaleX(-1) rotate(-360deg);
  //   }
  // `;

  useLayoutEffect(() => {
    setIsLoading(false)
  }, [])

  const setUpdateLastRecognition = async (update: RealTimeLprData | null) => {
    if (update) {
      setStreamLPRData(update)
      setStreamLPRMapping((prevMapping) => ({
        ...prevMapping,
        [update.alprCamId]: update,
      }))
      
    }
    else {
      setStreamLPRData(null)
    }
  }

  const setUpdateSpecialPlate = async(update: RealTimeLprData) => {
    try {
      if (update.isSpecialPlate !== 1) return
      
      await fetchLastRecognitions()
      await fetchClient(combineURL(TELEGRAM_URL, "/send-message"), {
        method: "POST",
        body: JSON.stringify({ 
          chatId: TELEGRAM_CHAT_ID || "", 
          message: `${t('text.special-plate-found')}: ${update.plateGroup} ${update.plateNumber} ${update.regionNameTH} ${update.plateConfidence}% ${t('text.type')}: ${update.specialPlateClassTH}` 
        }),
        isService1: true,
      })
    } 
    catch (error) {
      console.error(error)
    }
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
      const response = await fetchClient<LastRecognitionResult>(combineURL(API_URL, "/lpr-data/get"), {
        method: "GET",
        queryParams: query,
      });

      if (response.data) {
        setFilteredLiveViewRealTimeData(response.data);
      }
    }
    catch (ex) {
      setLprDetectHistoryList([])
    }
  }

  useEffect(() => {
    if (filteredLiveViewRealTimeData.length > 0) {
      if (filteredLiveViewRealTimeData.length > 1) {
        const data = [...filteredLiveViewRealTimeData]
        const shiftData = data.shift()
        setLatestLprDetect(shiftData ? shiftData : null)
        setLprDetectHistoryList(filteredLiveViewRealTimeData.slice(1, 11))
      }
      else {
        setLatestLprDetect(filteredLiveViewRealTimeData[0])
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

  // const handleRestartButtonClick = useCallback(async (event: React.MouseEvent) => {
  //   event.stopPropagation()
  //   setIsRestartStreamDisabled(true);
  //   setIsRestartStreamAnimating(true);
  //   try {
  //     await dispatch(postRestartStreamThunk())
  //   }
  //   catch (error) {
  //     console.error(error)
  //   } 
  //   finally {
  //     setTimeout(() => {
  //       setIsRestartStreamDisabled(false);
  //       setIsRestartStreamAnimating(false);
  //     }, 30000)
  //   }
  // }, [dispatch])

  const handleStartButtonClick = async (event: React.MouseEvent, index: number) => {
    event.stopPropagation() 
    
    try {
      const uid: StartStopStream = { cam_uid: cameraDetailSettingData[index].cam_uid }
      await fetchClient(combineURL(STREAM_URL, "/live/start"), {
        method: "POST",
        body: JSON.stringify(uid),
        isStream: true,
      })
    }
    catch (error) {
      console.error(error)
    }
  }

  const handleStopButtonClick = async (event: React.MouseEvent, index: number) => {
    event.stopPropagation()
    
    try {
      const uid: StartStopStream = { cam_uid: cameraDetailSettingData[index].cam_uid }
      await fetchClient(combineURL(STREAM_URL, "/live/stop"), {
        method: "POST",
        body: JSON.stringify(uid),
        isStream: true,
      })
    }
    catch (error) {
      console.error(error)
    }
  }

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
                        <label className="text-white">{t('text.live-view')}</label>
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

                <div className="absolute top-1 left-[160px] text-[15px] text-white max-w-[200px]">
                  {
                    (() => {
                      const checkpointName = `${t('text.checkpoint')}: ${activeStreamUrls[index] && activeStreamUrls[index].name || live.cam_id}`
                      return (
                        <label className="block truncate" title={checkpointName}>{checkpointName}</label>
                      )
                    })()
                  }
                </div>

                <div className="absolute top-0 right-0">
                  <div className='flex'>
                    <Button
                      ref={(el) => (startButtonRefs.current[index] = el)}
                      onClick={(e) => handleStartButtonClick(e, index)}
                      className="relative z-10 h-[26px] bg-gradient-to-b from-dodgerBlue to-darkCerulean space-x-1"
                      sx={{
                        textTransform: 'none',
                        marginRight: '5px',
                      }}
                    >
                      <Icon icon={Play} size={15} color="#FFFFFF" />
                      <span className='text-[14px] text-white'>{t('button.start-video')}</span>
                    </Button>

                    <Button
                      ref={(el) => (stopButtonRefs.current[index] = el)}
                      onClick={(e) => handleStopButtonClick(e, index)}
                      className="relative z-10 h-[26px] bg-gradient-to-b from-dodgerBlue to-darkCerulean space-x-1"
                      sx={{
                        textTransform: 'none',
                        marginRight: '5px',
                      }}
                    >
                      <Icon icon={Square} size={15} color="#FFFFFF" />
                      <span className='text-[14px] text-white'>{t('button.stop-video')}</span>
                    </Button>

                    {/* <Button
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
                      <span className='text-[14px] text-white '>Restart Live</span>
                    </Button> */}

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
                              <label className="text-white">{t('text.lpr-data')}</label>
                            </div>
                          </div>
                          <div className="px-4 pb-2 w-full h-[35.7vh] py-[0.3rem] overflow-y-auto">
                            {lprData && selectedScreenValue !== 3 ? (
                              <div className="flex flex-1 flex-col h-full items-center justify-center">
                                <div className={`flex items-center justify-center align-middle h-[190px] w-full
                                  ${ isFullWidth || !isOpen ? "bg-celti" : "" }
                                  `}>
                                  <div className={`flex items-center justify-center w-[564px] h-full
                                    ${ isFullWidth || !isOpen ? "bg-celti" : "" }
                                    `}>
                                    <img
                                      className="h-full w-[50%]"
                                      src={`${IMAGE_URL}${lprData?.vehicleImage}`}
                                      alt={`Car ${index + 1}`}
                                    />
                                    <img
                                      className="h-[60%] w-[50%]"
                                      src={`${IMAGE_URL}${lprData?.plateImage}`}
                                      alt={`Car ${index + 1}`}
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col h-[114px] w-full text-center bg-tuna">
                                  <p className="text-white text-[24px] font-medium">
                                    {`
                                      ${isNumber(lprData.plateGroup) && isNumber(lprData.plateNumber) ? 
                                      `${lprData.plateGroup}-${lprData.plateNumber}` : 
                                      `${lprData.plateGroup} ${lprData.plateNumber}`} 
                                      ${lprData.regionNameTH}
                                    `}
                                  </p>
                                  <p className='border-b-[2px] border-gainsboro mx-[25px] mt-[10px]'></p>
                                  <div className="grid grid-cols-2 text-white text-[18px] font-light p-2">
                                    <div className='border-r-[1px] border-gainsboro'>
                                      <p className='truncate' title={`${reformatString(lprData.make)} ${reformatString(lprData.model)}`}>{reformatString(lprData.make)} {reformatString(lprData.model)}</p>
                                      <p className='truncate' title={`${reformatString(lprData.color)}`}>{reformatString(lprData.color)}</p>
                                    </div>
                                    <div>
                                      <p>{dayjs(lprData.detectionDatetime).format(i18n.language === "th" ? "DD-MM-BBBB" : 'DD-MM-YYYY')}</p>
                                      <p>{dayjs(lprData.detectionDatetime).format('HH:mm:ss')}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : ""}
                            {streamLPRData && selectedScreenValue === 3 ? (
                              <div className="flex flex-1 flex-col h-full items-center justify-center">
                                <div className={`flex items-center justify-center align-middle h-[190px] w-full
                                  ${ isFullWidth || !isOpen ? "bg-celti" : "" }
                                  `}>
                                  <div className={`flex items-center justify-center w-[564px] h-full
                                    ${ isFullWidth || !isOpen ? "bg-celti" : "" }
                                    `}>
                                    <img
                                      className="h-full w-[50%]"
                                      src={`${IMAGE_URL}${streamLPRData?.vehicleImage}`}
                                      alt={`Car ${index + 1}`}
                                    />
                                    <img
                                      className="h-[60%] w-[50%]"
                                      src={`${IMAGE_URL}${streamLPRData?.plateImage}`}
                                      alt={`Car ${index + 1}`}
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col h-[122px] w-full text-center bg-tuna">
                                  <p className="text-white text-[24px] font-medium">
                                    {`
                                      ${isNumber(streamLPRData?.plateGroup) && isNumber(streamLPRData?.plateNumber) ? 
                                      `${streamLPRData?.plateGroup}-${streamLPRData?.plateNumber}` : 
                                      `${streamLPRData?.plateGroup} ${streamLPRData?.plateNumber}`} 
                                      ${streamLPRData?.regionNameTH}
                                    `}
                                  </p>
                                  <p className='border-b-[2px] border-gainsboro mx-[25px] mt-[10px]'></p>
                                  <div className="grid grid-cols-2 text-white text-[18px] font-light p-2">
                                    <div className='border-r-[1px] border-gainsboro'>
                                      <p className='truncate' title={`${reformatString(streamLPRData.make)} ${reformatString(streamLPRData.model)}`}>{reformatString(streamLPRData.make)} {reformatString(streamLPRData.model)}</p>
                                      <p className='truncate' title={`${reformatString(streamLPRData.color)}`}>{reformatString(streamLPRData.color)}</p>
                                    </div>
                                    <div>
                                      <p>{dayjs(lprData.detectionDatetime).format(i18n.language === "th" ? "DD-MM-BBBB" : 'DD-MM-YYYY')}</p>
                                      <p>{dayjs(lprData.detectionDatetime).format('HH:mm:ss')}</p>
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
      <CarDetectDialog 
        open={isCarDetectOpen}
        closeDialog={() => setIsCarDetectOpen(false)} 
        latestLprDetect={latestLprDetect}
        lprDetectHistoryList={lprDetectHistoryList}
      />
    </div>
  )
}

export default CCTV