import React, { useState, useRef, useEffect } from 'react'

// Modules
import CCTVSideBar from '../cctv-side-bar/CCTVSideBar'

// Image
import CCTVIcon from "/icons/cctv-active.png"
import CCTV1 from "/images/car_test.png"
import CCTVSetting from "/icons/cctv-setting.png"

// Context
import { useHamburger } from "../../context/HamburgerContext"

const CCTV = () => {
  const [isFullWidth, setIsFullWidth] = useState(false)
  const { isOpen } = useHamburger()

  const setCollapse = (status: boolean) =>  {
    setIsFullWidth(status)
  }

  // Mock Data
  const [cameraSetting] = useState([
    { id: 0, name: "โค้งปิง_ขาออก1" },
    { id: 1, name: "โค้งปิง_ขาออก2" },
    { id: 2, name: "โค้งปิง_ขาออก3" },
    { id: 3, name: "โค้งปิง_ขาออก4" }
  ])

  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([])
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCameraSelect = (selectedId: number) => {
    setDropdownVisible(null)
  }

  return (
    <div className={`main-content pe-1 min-w-[950px] ${isOpen ? "pl-[130px]" : "pl-[2px]"} transition-all duration-500`}>
      <div 
        id="cctv" 
        className={`flex h-full ${
          isFullWidth ? "w-full" : `${isOpen ? "w-[70%]" : "w-[72%]"}`
        } transition-all duration-500`}
      >
        <div className="w-full h-[88vh] pl-[10px] pr-[20px] py-[15px] mt-[22px] border-[1px] border-dodgerBlue rounded-[10px]">
          <div className="w-full grid grid-cols-2 lt1535:grid-cols-1 h-[85vh] gap-5 overflow-y-auto">
            {cameraSetting.map((camera, index) => (
              <div key={camera.id} id={`CCTV${index + 1}`} className="flex relative">
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
                        <label className='text-white'>Live View</label>
                      </div>
                    </div>
                    <div className="px-4 pb-2">
                      <img src={CCTV1} alt="CCTV1" className="w-full h-[20rem]" />
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-1 left-[160px] text-[15px] text-white">
                  <label>
                    จุดตรวจ : {camera.name}
                  </label>
                </div>
                
                <div className="absolute top-0 right-1">
                  <button
                    type="button"
                    ref={el => buttonRefs.current[index] = el}
                    onClick={(e) => handleButtonClick(e, index)}
                    className="relative z-10"
                  >
                    <img src={CCTVSetting} alt="Setting" className="w-[30px] h-[30px]" />
                  </button>
                  
                  {dropdownVisible === index && (
                    <div
                      ref={el => dropdownRefs.current[index] = el}
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-sm shadow-lg z-50"
                    >
                      <ul className="py-1">
                        {cameraSetting.map(option => (
                          <li
                            key={option.id}
                            onClick={() => handleCameraSelect(option.id)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 text-start"
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
          </div>
        </div>
      </div>
      <div
        id="detail-form"
        className={`w-[27%] fixed right-0 top-0 pt-[60px] overflow-auto infoside ${
          isFullWidth ? "right-[-490px] none" : "!right-0 block"
        } transition-all duration-500`}
      >
        <CCTVSideBar setCollapse={setCollapse}/>
      </div>
    </div>
  )
}

export default CCTV