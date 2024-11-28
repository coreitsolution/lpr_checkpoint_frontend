import { useState } from 'react'
import { motion } from "framer-motion"
import CCTVIcon from "../assets/icon/cctv.png"
import BarChart from "../assets/icon/bar-chart.png"
import Car from "../assets/icon/car.png"
import Search from "../assets/icon/search.png"
import Setting from "../assets/icon/setting.png"
import AddUser from "../assets/icon/add-user.png"
import UpIcon from "../assets/icon/up-icon.png"
import DownIcon from "../assets/icon/down-icon.png"

interface NavProps {
  onButtonClick: (componentName: string) => void
}

const Nav: React.FC<NavProps> = ({ onButtonClick }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [activeButton, setActiveButton] = useState("car")
  
  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <motion.nav 
      id="nav" 
      className="flex items-center justify-center flex-col items-start m-[20px] w-[70px] border-[2px] border-dodgerBlue rounded-[10px] p-[10px]"
      animate={{
        width: isOpen ? "70px" : "70px",
        height: isOpen ? "420px" : "70px",
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
      }}

    >
      {/* Arrow button to toggle collapse */}
      <button
        onClick={toggleMenu}
        className="flex space-x-2 text-gray-600 hover:text-gray-800"
      >
        <img src={isOpen ? UpIcon : DownIcon} alt="Up/Down" />
      </button>

      {/* The section that contains the image buttons */}
      {isOpen && (
        <motion.div 
          className="grid grid-cols-1 gap-3 mt-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Rounded image buttons */}
          {/* CCTV Menu Button */}
          <button
              key="cctv-menu-button"
              className={`flex items-center justify-center w-12 h-12 rounded-full bg-blackPearl border-[1px] border-dodgerBlue hover:bg-slate-700 ${ activeButton === 'cctv' ? 'bg-white border-curiousBlue' : '' }`}
              onClick={() => {
                onButtonClick('cctv')
                setActiveButton('cctv')
              }}
            >
              <img
                src={ CCTVIcon }
                alt="CCTV"
                className="w-[60%] h-[60%]"
              />
          </button>
          {/* Bar Chart Menu Button */}
          <button
              key="bar-chart-menu-button"
              className={`flex items-center justify-center w-12 h-12 rounded-full bg-blackPearl border-[1px] border-dodgerBlue hover:bg-slate-700 ${ activeButton === 'bar-chart' ? 'bg-white border-curiousBlue' : '' }`}
              onClick={() => {
                onButtonClick('bar-chart')
                setActiveButton('bar-chart')
              }}
            >
              <img
                src={ BarChart }
                alt="Bar-Chart"
                className="w-[55%] h-[55%]"
              />
          </button>
          {/* Search Menu Button */}
          <button
              key="search-menu-button"
              className={`flex items-center justify-center w-12 h-12 rounded-full bg-blackPearl border-[1px] border-dodgerBlue hover:bg-slate-700 ${ activeButton === 'search' ? 'bg-white border-curiousBlue' : '' }`}
              onClick={() => {
                onButtonClick('search')
                setActiveButton('search')
              }}
            >
              <img
                src={ Search }
                alt="Search"
                className="w-[55%] h-[55%]"
              />
          </button>
          {/* Car Menu Button */}
          <button
              key="car-menu-button"
              className={`flex items-center justify-center w-12 h-12 rounded-full bg-blackPearl border-[1px] border-dodgerBlue hover:bg-slate-700 ${ activeButton === 'car' ? 'bg-curiousBlue border-white' : '' }`}
              onClick={() => {
                onButtonClick('car')
                setActiveButton('car')
              }}
            >
              <img
                src={ Car }
                alt="Car"
                className="w-[55%] h-[55%]"
              />
          </button>
          {/* Setting Menu Button */}
          <button
              key="setting-menu-button"
              className={`flex items-center justify-center w-12 h-12 rounded-full bg-blackPearl border-[1px] border-dodgerBlue hover:bg-slate-700 ${ activeButton === 'setting' ? 'bg-white border-curiousBlue' : '' }`}
              onClick={() => {
                onButtonClick('setting')
                setActiveButton('setting')
              }}
            >
              <img
                src={ Setting }
                alt="Setting"
                className="w-[55%] h-[55%]"
              />
          </button>
          {/* Add User Menu Button */}
          <button
              key="add-user-menu-button"
              className={`flex items-center justify-center w-12 h-12 rounded-full bg-blackPearl border-[1px] border-dodgerBlue hover:bg-slate-700 ${ activeButton === 'add-user' ? 'bg-white border-curiousBlue' : '' }`}
              onClick={() => {
                onButtonClick('add-user')
                setActiveButton('add-user')
              }}
            >
              <img
                src={ AddUser }
                alt="Add User"
                className="w-[55%] h-[55%]"
              />
          </button>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default Nav
