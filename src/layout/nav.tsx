import { Th, Gb, La } from "react-flags-select"
import "./nav.scss";
import { useCallback, useEffect, useState, useRef } from "react";
import MenuIcon from "./menu-icon/menuicon";
import { NavLink } from "react-router-dom";
import RiArrowDownSFill from "~icons/ri/arrow-down-s-fill";
import RiArrowUpSFill from "~icons/ri/arrow-up-s-fill";
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../app/store"
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import { useNavigate } from "react-router-dom";
import { fetchClient, combineURL } from "../utils/fetchClient"

// Context
import { useHamburger } from "../context/HamburgerContext";

// API
import {
  logout
} from "../features/auth/authSlice"

// Types
import {
  SettingDataShort,
} from "../features/settings/settingsTypes";

// Config
import { getUrls } from '../config/runtimeConfig';

// i18n
import { useTranslation } from "react-i18next";

dayjs.extend(buddhistEra);

function Nav() {
  const dispatch: AppDispatch = useDispatch()
  
  // i18n
  const { t, i18n } = useTranslation();

  const [languageSelected, setLanguageSelect] = useState("th");
  const [sidePosition, setSidePosition] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>("")
  const [checkpoint, setCheckpoint] = useState<string>(`${t("text.station")}: `)
  const { isOpen, toggleMenu } = useHamburger()
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const navigate = useNavigate();

  const { PROJECT_NAME, API_URL, NAV_LOGO_BG_WHITE } = getUrls();

  const { username } = useSelector(
    (state: RootState) => state.auth.authData
  )

  useEffect(() => {
    fetchCheckpointName();
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const format = i18n.language === "th" ? "DD-MM-BBBB HH:mm:ss" : "DD-MM-YYYY HH:mm:ss"
      setCurrentTime(dayjs(new Date()).format(format))
    }, 1000)

    return () => clearInterval(interval)
  }, [i18n.language])

  const fetchCheckpointName = async () => {
    try {
      const response = await fetchClient<SettingDataShort>(combineURL(API_URL, "/settings/get-short"), {
        method: "GET",
      })

      if (response.data) {
        setCheckpoint(`${t('text.station')}: ${response.data.checkpoint_name || ""}`)
      }
    }
    catch (error) {
      console.error(error)
    }
  }

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value
    setLanguageSelect(selectedLanguage)
    i18n.changeLanguage(selectedLanguage);
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
    // {
    //   path: "/checkpoint/suspect-people-detected",
    //   icon: "magnifying-glass",
    //   label: "magnifying-glass",
    // },
    {
      path: "/checkpoint/special-registration",
      icon: "special-plate",
      label: "special-plate",
    },
    // {
    //   path: "/checkpoint/special-suspect-person",
    //   icon: "order-detect-person",
    //   label: "special-suspect-person",
    // },
    { path: "/checkpoint/settings", icon: "settings", label: "settings" },
    // { path: "/checkpoint/user-manage", icon: "add-user", label: "add-user" },
    // { path: "/checkpoint/chart", icon: "bar-chart", label: "bar-chart" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        imgRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !imgRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setDropdownVisible(true)
  }

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDropdownVisible(false)
    navigate('/checkpoint/user-info', { replace: true, state: { allowed: true } })
  };
  
  const handleLogoutClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDropdownVisible(false)
    dispatch(logout())
  };

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
                <div className={`flex justify-center items-center ${NAV_LOGO_BG_WHITE ? "bg-white" : ""}`}>
                  <img src="/project-logo/sm-logo.png" alt="Logo" className="w-[80px] h-[55px]" />
                </div>
                <span className="text-[25px]">{PROJECT_NAME}</span>
              </div>
            </div>
            <div className="flex w-full">
              <div className="flex flex-col items-center justify-center space-y-1 w-[300px]">
                <p className="text-[20px] text-center overflow-hidden whitespace-nowrap text-ellipsis w-full" title={checkpoint}>{checkpoint}</p>
                <p className="text-[15px] h-[25px] text-cyan-300">
                  {currentTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-5 mr-[50px] text-white">
          <div className="flex items-center justify-center w-[150px]">
            <p className="text-center text-[20px] overflow-hidden whitespace-nowrap text-ellipsis w-full" title={username ?? "User"}>{username ?? "User"}</p>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-b from-aqua2 to-blueC p-[2px] rounded-full">
              <img 
                ref={imgRef}
                src={`/icons/user.png`} 
                alt="User" 
                className="w-11 h-11 bg-black rounded-full" 
                onClick={handleButtonClick}
              />
            </div>
            {
              dropdownVisible && (
                <div
                  className="flex items-center justify-center absolute right-0 mt-1 w-[130px] bg-gradient-to-b from-aqua2 to-blueC rounded-[5px] p-[2px] shadow-lg z-51"
                  ref={dropdownRef}
                >
                  <div className="bg-black w-full h-full rounded-[5px]">
                    <ul className="py-1">
                      <li
                        className={`px-4 py-1 hover:bg-linkWater hover:text-black cursor-pointer text-sm text-white text-center`}
                        onClick={handleProfileClick}
                      >
                        {t('button.profile')}
                      </li>
                      <div className="border-b-[1px] border-dodgerBlue mx-2"></div>
                      <li
                        className={`px-4 py-1 hover:bg-linkWater hover:text-black cursor-pointer text-sm text-white text-center`}
                        onClick={handleLogoutClick}
                      >
                        {t('button.logout')}
                      </li>
                    </ul>
                  </div>
                </div>
              )
            }
          </div>
          <div className="grid grid-cols-[20px_auto] border border-white rounded-[5px] py-[3px] px-[12px]">
            {/* <span className="mr-[5px]">{languageSelected === 'th' ? <Th /> : <Us />}</span> */}
            <span className="mr-[5px]">
              {
                (() => {
                  switch (languageSelected) {
                    case 'th':
                      return <Th />;
                    case 'en':
                      return <Gb />;
                    case 'la':
                      return <La />;
                    default:
                      return <Th />;
                  }
                })()
              }
            </span>
            <select 
              className="bg-transparent text-[12px] text-center focus:outline-none focus:ring-0" 
              value={languageSelected} 
              onChange={handleLanguageChange}
            >
              <option className="text-black" value="th">Thai</option>
              <option className="text-black" value="en">English</option>
              <option className="text-black" value="la">Lao</option>
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
