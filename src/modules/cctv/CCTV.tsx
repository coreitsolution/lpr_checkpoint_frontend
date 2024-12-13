import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../app/store"
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

// Components
import { VideoPlayer } from '../../components/video-player/VideoPlayer.js'

// Modules
import CCTVSideBar from '../cctv-side-bar/CCTVSideBar'
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

// API
import { 
  fetchCameraSettingsThunk,
  postStartStreamThunk
} from "../../features/camera-settings/cameraSettingsSlice"

// Types
import { 
  StreamDetail
} from "../../features/camera-settings/cameraSettingsTypes"
import { LastRecognitionResult } from "../../features/live-view-real-time/liveViewRealTimeTypes"

const CCTV = () => {
  const dispatch: AppDispatch = useDispatch()
  const { cameraSetting, status, error } = useSelector(
    (state: RootState) => state.cameraSettings
  )
  const [isFullWidth, setIsFullWidth] = useState(false)
  const { isOpen } = useHamburger()

  const setCollapse = (status: boolean) =>  {
    setIsFullWidth(status)
  }

  const [cameraSettingDropdown, setCameraSettingDropdown] = useState<{ id: number, name: string }[]>([])
  const [liveView, setLiveView] = useState<StreamDetail[]>([])
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([])
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [activeStreamUrls, setActiveStreamUrls] = useState<Record<number, { id: string, url: string, name:string}>>({})
  const [streamLPRMapping, setStreamLPRMapping] = useState<Record<string, LastRecognitionResult>>({})
  const [streamLPRData, setStreamLPRData] = useState<LastRecognitionResult | null>(null)
  const [isCarDetectOpen, setIsCarDetectOpen] = useState(false)

  const setUpdateLastRecognition = (update: LastRecognitionResult) => {
    setStreamLPRMapping((prevMapping) => ({
      ...prevMapping,
      [update.cameraName]: update,
    }))
    setStreamLPRData(update)
    setIsCarDetectOpen(true)
  }

  const checkRegistrationTypeColor = (): string => {
    const type = streamLPRData?.registration_type.toLocaleLowerCase()
    if (type === "black list") {
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

  const handleCameraSelect = (selectedId: number, cameraIndex: number) => {
    const selectedCamera = cameraSetting?.cameraSettings.find(
      (camera) => camera.id === selectedId
    );
    if (selectedCamera) {
      const newStreamUrl = createStreamUrl(
        selectedCamera.rtsp_live_view,
        selectedCamera.port ? selectedCamera.port : ""
      );
      setActiveStreamUrls((prevUrls) => ({
        ...prevUrls,
        [cameraIndex]: { id: `CCTV-${selectedCamera.checkpoint_id}`, url: newStreamUrl, name: selectedCamera.checkpoint_id},
      }));
    }
    setDropdownVisible(null);
  };

  const createStreamUrl = (rstp: string, port: string):string => {
    const httpUrl = rstp.replace("rtsp://", "http://")
    const parsedUrl = new URL(httpUrl)
    const ip = parsedUrl.hostname

    const streamURL = `ws://${ip}:${port}`
    return streamURL
  }

  useEffect(() => {
    dispatch(fetchCameraSettingsThunk())
  }, [dispatch])

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const requestStartStream = useCallback(async () => {
    if (cameraSetting?.cameraSettings) {
      const reqStartStream = cameraSetting.cameraSettings.map((camera) => ({
        name: camera.checkpoint_id,
        streamUrl: camera.rtsp_live_view,
        port: camera.port ? camera.port : "",
      }))
  
      const response = await dispatch(postStartStreamThunk(reqStartStream))

      if (Array.isArray(response.payload)) {
        setLiveView(response.payload)
      } 
      else {
        console.error('Failed to start streams:', response)
      }
    }
  }, [cameraSetting, dispatch])

  useEffect(() => {
    if (cameraSetting?.cameraSettings) {
      const dropdownData = cameraSetting.cameraSettings.map(({ id, checkpoint_id }) => ({
        id,
        name: checkpoint_id,
      }))
      setCameraSettingDropdown(dropdownData)
      requestStartStream()
    }
  }, [cameraSetting, requestStartStream])

  return (
    <div className={`main-content pe-1 min-w-[950px] ${isOpen ? "pl-[130px]" : "pl-[2px]"} transition-all duration-500`}>
      <div 
        id="cctv" 
        className={`flex h-full ${
          isFullWidth ? "w-full" : `${isOpen ? "w-[70%]" : "w-[72%]"}`
        } transition-all duration-500`}
      >
        <div className="w-full h-[88vh] pl-[10px] pr-[20px] py-[15px] mt-[22px] border-[1px] border-dodgerBlue rounded-[10px]">
          <div className={`w-full ${cameraSetting && cameraSetting?.screen > 1 ? "grid grid-cols-2 lt1535:grid-cols-1" : "grid grid-cols-1"} h-[85vh] gap-5 overflow-y-auto`}>
          {
            liveView.slice(0, cameraSetting?.screen).map((live, index) => (
              <div key={live.uid} id={`CCTV${index + 1}`} className="flex relative">
                {/* CCTV Stream */}
                <div
                  className="flex float-left justify-center items-center w-full bg-geyser"
                  style={{
                    shapeOutside: "polygon(0% 0%, 129px 0%, 149px 35px, 100% 35px, 100% 100%, 0% 100%)",
                    clipPath: "polygon(0% 0%, 129px 0%, 149px 35px, 100% 35px, 100% 100%, 0% 100%)",
                  }}
                >
                  <div
                    className="w-[99.5%] h-[99.5%] bg-black"
                    style={{
                      shapeOutside: "polygon(0% 0%, 125px 0%, 145px 36px, 100% 36px, 100% 100%, 0% 100%)",
                      clipPath: "polygon(0% 0%, 125px 0%, 145px 36px, 100% 36px, 100% 100%, 0% 100%)",
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
                    <div className="pb-2">
                      <VideoPlayer
                        streamUrl={(activeStreamUrls[index] && activeStreamUrls[index].url) || createStreamUrl(live.streamUrl, live.wsPort || "")}
                        id={(activeStreamUrls[index] && activeStreamUrls[index].id) || `CCTV-${live.name}`}
                        customClass="w-full h-[33vh]"  // Ensuring uniform size
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute top-1 left-[160px] text-[15px] text-white">
                  <label>จุดตรวจ : {activeStreamUrls[index] && activeStreamUrls[index].name || live.name}</label>
                </div>

                <div className="absolute top-0 right-1">
                  <button
                    type="button"
                    ref={(el) => (buttonRefs.current[index] = el)}
                    onClick={(e) => handleButtonClick(e, index)}
                    className="relative z-10"
                  >
                    <img src={CCTVSetting} alt="Setting" className="w-[30px] h-[30px]" />
                  </button>

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
                  if (cameraSetting?.screen === 1) return 0;
                  if (cameraSetting?.screen === 2) return 2;
                  if (cameraSetting?.screen === 3) return 1;
                  return 0; // For screen = 4 or undefined
                })();

                if (lprCount === 0) {
                  return <div></div>
                }

                const liveViewWithLPR = liveView
                  .slice(0, cameraSetting?.screen)
                  .map((live, index) => ({
                    lprData: streamLPRMapping[live.name] || null,
                    isLPRIncluded: index < lprCount,
                  }));

                return liveViewWithLPR.map(({ lprData, isLPRIncluded }, index) => (
                  <div key={`LPR-${index}`} id={`LPR-${index + 1}`} className="flex relative">
                    {isLPRIncluded && (
                      <div
                        className="flex float-left justify-center items-center w-full bg-geyser"
                        style={{
                          shapeOutside: "polygon(0% 0%, 129px 0%, 149px 35px, 100% 35px, 100% 100%, 0% 100%)",
                          clipPath: "polygon(0% 0%, 129px 0%, 149px 35px, 100% 35px, 100% 100%, 0% 100%)",
                        }}
                      >
                        <div
                          className="w-[99.5%] h-[99.5%] bg-black pb-1"
                          style={{
                            shapeOutside: "polygon(0% 0%, 125px 0%, 145px 36px, 100% 36px, 100% 100%, 0% 100%)",
                            clipPath: "polygon(0% 0%, 125px 0%, 145px 36px, 100% 36px, 100% 100%, 0% 100%)",
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
                            {lprData && cameraSetting?.screen !== 3 ? (
                              <div className="flex flex-1 flex-col">
                                <div className={`flex items-center justify-center align-middle h-[19vh] w-full`}>
                                  <div className={`inline-flex items-center justify-center w-[564px] h-[276px]`}>
                                    <img
                                      className="h-full w-[50%]"
                                      src={streamLPRData?.pathImageVehicle}
                                      alt={`Car ${index + 1}`}
                                    />
                                    <img
                                      className="h-[50%] w-[50%]"
                                      src={streamLPRData?.pathImage}
                                      alt={`Car ${index + 1}`}
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col h-[12vh] text-center bg-tuna">
                                  <p className="text-white text-[24px] font-medium">{lprData.plate}</p>
                                  <p className='border-b-[2px] border-gainsboro mx-[25px] mt-[10px]'></p>
                                  <div className="grid grid-cols-2 text-white text-[18px] font-light p-2">
                                    <div className='border-r-[1px] border-gainsboro'>
                                      <p>{lprData.brand} {lprData.model}</p>
                                      <p>{lprData.color}</p>
                                    </div>
                                    <div>
                                      <p>{lprData.vehicle.date}</p>
                                      <p>{lprData.vehicle.time}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : ""}
                            {streamLPRData && cameraSetting?.screen === 3 ? (
                              <div className="flex flex-1 flex-col">
                                <div className={`flex items-center justify-center align-middle h-[19vh] w-full`}>
                                  <div className={`inline-flex items-center justify-center w-[564px] h-[276px]`}>
                                    <img
                                      className="h-full w-[50%]"
                                      src={streamLPRData?.pathImageVehicle}
                                      alt={`Car ${index + 1}`}
                                    />
                                    <img
                                      className="h-[50%] w-[50%]"
                                      src={streamLPRData?.pathImage}
                                      alt={`Car ${index + 1}`}
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col h-[12vh] text-center bg-tuna">
                                  <p className="text-white text-[24px] font-medium">{streamLPRData?.plate}</p>
                                  <p className='border-b-[2px] border-gainsboro mx-[25px] mt-[10px]'></p>
                                  <div className="grid grid-cols-2 text-white text-[18px] font-light p-2">
                                    <div className='border-r-[1px] border-gainsboro'>
                                      <p>{streamLPRData?.brand} {streamLPRData?.model}</p>
                                      <p>{streamLPRData?.color}</p>
                                    </div>
                                    <div>
                                      <p>{streamLPRData?.vehicle.date}</p>
                                      <p>{streamLPRData?.vehicle.time}</p>
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
        className={`w-[27%] fixed right-0 top-0 pt-[60px] overflow-auto ${
          isFullWidth ? "right-[-490px] none" : "!right-0 block"
        } transition-all duration-500`}
      >
        <CCTVSideBar setCollapse={setCollapse} cameraSetting={cameraSetting} setUpdateLastRecognition={setUpdateLastRecognition}/>
      </div>
      {/* Car Detect Dialog */}
      <Dialog open={isCarDetectOpen} onClose={() => setIsCarDetectOpen(false)} className="relative z-50">
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
              lastRecognitionResult={streamLPRData}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default CCTV