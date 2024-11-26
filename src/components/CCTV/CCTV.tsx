import React, { useState, useRef, useEffect } from 'react'
import CCTVIcon from "../../assets/icon/cctv-w.png"
import CCTV1 from "../../assets/img/cctv1.png"
import CCTVSettingIcon from "../../assets/icon/cctv-setting.png"

const CCTV = () => {
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
    <div id="cctv" className="flex h-full w-full">
      <div className="w-full h-[88vh] m-[5px] pl-[10px] pr-[20px] py-[15px] my-[22px] border-[1px] border-dodgerBlue rounded-lg">
        <div className="w-full grid grid-cols-2 lt1440:grid-cols-1 h-[85vh] gap-5 overflow-y-auto">
          {cameraSetting.map((camera, index) => (
            <div key={camera.id} id={`CCTV${index + 1}`} className="flex relative mt-2">
              <div 
                className="flex float-left justify-center items-center w-full bg-geyser"
                style={{
                  shapeOutside: "polygon(0% 0%, 129px 0%, 149px 35px, 100% 35px, 100% 100%, 0% 100%)",
                  clipPath: "polygon(0% 0%, 129px 0%, 149px 35px, 100% 35px, 100% 100%, 0% 100%)",
                }}
              >
                <div 
                  className="w-[99.5%] h-[99.5%] bg-[var(--background-color)]"
                  style={{
                    shapeOutside: "polygon(0% 0%, 125px 0%, 145px 36px, 100% 36px, 100% 100%, 0% 100%)",
                    clipPath: "polygon(0% 0%, 125px 0%, 145px 36px, 100% 36px, 100% 100%, 0% 100%)",
                  }}
                >
                  <div>
                    <div className="flex flex-row w-[95%] px-4 pt-2 pb-4 bg-[var(--background-color)]">
                      <img
                        src={CCTVIcon}
                        alt="CCTV"
                        className="w-[30px] h-[30px] mr-[10px]"
                      />
                      <label>Live View</label>
                    </div>
                  </div>
                  <div className="px-4 pb-2">
                    <img src={CCTV1} alt="CCTV1" className="w-full h-[20rem]" />
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1 left-[160px] text-[15px]">
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
                  <img src={CCTVSettingIcon} alt="Setting" className="w-[30px] h-[30px]" />
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
  )
}

export default CCTV