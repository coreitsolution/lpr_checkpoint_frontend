import { Th } from "react-flags-select"
import "./nav.scss";
import { useCallback, useEffect, useState } from "react";
import MenuIcon from "./menu-icon/menuicon";
import { NavLink } from "react-router-dom";
import RiArrowDownSFill from "~icons/ri/arrow-down-s-fill";
import RiArrowUpSFill from "~icons/ri/arrow-up-s-fill";
import clsx from 'clsx';
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../app/store"

// SVG
import LOGO from "../assets/svg/sm-logo.svg"

// Context
import { useHamburger } from "../context/HamburgerContext";

// API
import { 
  fetchSettingsThunk,
} from "../features/settings/settingsSlice"

function Nav() {
  const [languageSelected, setLanguageSelect] = useState("th");
  const [sidePosition, setSidePosition] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>("")
  const [checkpoint, setCheckpoint] = useState<string>("ด่าน: ")
  const { isOpen, toggleMenu } = useHamburger()
  const dispatch: AppDispatch = useDispatch()
  const { settingData } = useSelector(
    (state: RootState) => state.settingsData
  )

  const formatDate = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${hours}:${minutes}:${seconds}`
  }

  useEffect(() => {
    dispatch(fetchSettingsThunk({
      "filter": "key:checkpoint_name"
    }))
    const interval = setInterval(() => {
      setCurrentTime(formatDate(new Date()))
    }, 1000)

    return () => clearInterval(interval)
  }, [dispatch])

  useEffect(() => {
    if (settingData && settingData.checkpoint_name && settingData.checkpoint_name.data) {
      setCheckpoint(`ด่าน: ${settingData.checkpoint_name.data[0].value}`)
    }
  }, [settingData])

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value
    setLanguageSelect(selectedLanguage)
  }

  const handleSlideUp = useCallback(() => {
    setSidePosition((prev: number) => Math.min(prev + 68, 0));
  }, []);

  const handleSlideDown = () => {
    setSidePosition((prev: number) => Math.max(prev - 68, -200));
  };

  const navItems = [
    { path: "/checkpoint/cctv", icon: "cctv", label: "cctv" },
    { path: "/checkpoint/special-registration-detected", icon: "search-nav", label: "search" },
    {
      path: "/checkpoint/suspect-people-detected",
      icon: "magnifying-glass",
      label: "magnifying-glass",
    },
    {
      path: "/checkpoint/special-registration",
      icon: "special-plate",
      label: "special-plate",
    },
    {
      path: "/checkpoint/special-suspect-person",
      icon: "order-detect-person",
      label: "special-suspect-person",
    },
    { path: "/checkpoint/settings", icon: "settings", label: "settings" },
    { path: "/checkpoint/user-manage", icon: "add-user", label: "add-user" },
    { path: "/checkpoint/chart", icon: "bar-chart", label: "bar-chart" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 min-w-[1300px]">
      <div className="flex justify-between items-center bg-black">
        {/* Status Section */}
        <div 
          className="flex-1 bg-blue-500 text-white"
          style={{ clipPath: "polygon(0% 0%, 98.3% 0%, 95% 100%, 0% 100%)" }}
        >
          <div 
            className="flex pt-[6px] justify-center bg-black mb-[3px]" 
            style={{ clipPath: "polygon(0% 0%, 98.1% 0%, 94.9% 100%, 0% 100%)" }}
          >
            <div className="flex w-full">
              <div className="flex items-center justify-center space-x-1 ml-[10px]">
                {/* Hamburger Icon */}
                <div 
                  onClick={toggleMenu}
                  className="hamburger-menu"
                >
                  <button className="hamburger-icon mx-5">
                    <div className={`line ${isOpen ? "open" : ""}`} />
                    <div className={`line ${isOpen ? "open" : ""}`} />
                    <div className={`line ${isOpen ? "open" : ""}`} />
                  </button>
                </div>
                <LOGO />
                <span className="text-[25px]">License Plate Recognition</span>
              </div>
            </div>
            <div className="flex space-x-2 w-full">
              <div className="h-[20px]">
                <span className={clsx(
                  "flex w-[80px] items-center justify-center",
                  "text-white text-[15px] mt-[10px] rounded-full",
                  "bg-gradient-to-b from-green-500 to-green-800"
                )}>
                  Online
                </span>
              </div>
              <div className="grid grid-cols-[150px] mb-[4px]">
                <p className="text-[20px] text-center">{checkpoint}</p>
                <p className="text-[15px] h-[25px] text-cyan-300">
                  {currentTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-5 mr-[50px] text-white">
          <p className="text-[20px]">นางสาวธรพร ศรีสมร</p>
          <img src={`https://randomuser.me/api/portraits/women/1.jpg`} alt="User" className="w-12 h-12 rounded-full border-2 border-blue-600" />
          <div className="grid grid-cols-[20px_auto] border border-white rounded-[5px] py-[3px] px-[12px]">
            {/* <span className="mr-[5px]">{languageSelected === 'th' ? <Th /> : <Us />}</span> */}
            <span className="mr-[5px]">{<Th /> }</span>
            <select 
              className="bg-transparent text-[12px] text-center focus:outline-none focus:ring-0" 
              value={languageSelected} 
              onChange={handleLanguageChange}
            >
              <option className="text-black" value="th">TH</option>
              {/* <option className="text-black" value="en">EN</option> */}
            </select>
          </div>
        </div>
      </div>

      {/* side nav */}
      <div className={`fixed h-[70vh] w-[80px] bg-black mt-[2rem] border-2 border-dodgerBlue rounded-xl px-2 py-12 transition-transform duration-300
        ${isOpen ? "translate-x-0 translate-y-1 left-3" : "-translate-x-full translate-y-1 left-0"}
        `}>
        <div className="absolute top-3 left-0 w-full flex justify-center">
          {sidePosition !== 0 && (
            <RiArrowUpSFill
              className="text-white cursor-pointer w-[2.5em] h-[2.5em]"
              onClick={handleSlideUp}
            />
          )}
        </div>
        <div className="overflow-hidden h-[58vh]">
          <div
            style={{ transform: `translateY(${sidePosition}px)` }}
            className="flex flex-col gap-2 transition-transform duration-300 ease-out"
          >
            {navItems.map((item, index) => (
              <NavLink key={index} to={item.path}>
                {({ isActive }) => (
                  <MenuIcon
                    isActive={isActive}
                    iconUrl={`/icons/${
                      isActive ? `${item.icon}-active` : item.icon
                    }.png`}
                    menuName={item.label}
                  />
                )}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 pb-3 w-full flex justify-center bg-black rounded-b-[10px]">
          {sidePosition !== -200 && (
            <RiArrowDownSFill
              className="text-white cursor-pointer w-[2.5em] h-[2.5em]"
              onClick={handleSlideDown}
            />
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
