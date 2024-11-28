import { Us, Th } from "react-flags-select"
import { useState, useEffect } from "react"
import { ReactComponent as LOGO} from "../../assets/svg/sm-logo.svg"

function Header() {
  const [language, setLanguage] = useState("TH")
  const [currentTime, setCurrentTime] = useState<string>("")

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value
    setLanguage(selectedLanguage)
  }

  const formatDate = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${hours}:${minutes}:${seconds}`
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatDate(new Date()))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div id="header" className="h-[8%]">
      <div className="flex justify-between items-center">
        {/* Status Section */}
        <div 
          className="flex-1 bg-dodgerBlue"
          style={{ clipPath: "polygon(0% 0%, 98.3% 0%, 95% 100%, 0% 100%)" }}
        >
          <div 
            id="status" 
            className="flex pt-[6px] justify-center bg-[var(--background-color)] mb-[3px]" 
            style={{ clipPath: "polygon(0% 0%, 98.1% 0%, 94.9% 100%, 0% 100%)" }}
          >
            <div className="flex w-full">
              <div className="flex inline-block items-center justify-center space-x-1 ml-[10px]">
                <LOGO className="w-[60px] h-[60px]" />
                <span className="text-[25px]">License Plate Recognition</span>
              </div>
            </div>
            <div className="flex space-x-2 w-full">
              <div className="h-[20px]">
                <label className="flex w-[80px] items-center justify-center text-[#FFFFFF] text-[15px] mt-[10px] rounded-full bg-gradient-to-b from-[#2DAD59] to-[#124725]">Online</label>
              </div>
              <div className="grid grid-cols-[200px] mb-[4px]">
                <p className="text-[20px]">ด่าน</p>
                <p className="text-[15px] h-[25px] text-aqua">
                  {currentTime}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* User Section */}
        <div id="user" className="flex items-center space-x-5 mr-[50px]">
          <label className="text-[20px]">นางสาวธรพร ศรีสมร</label>
          <img src={`https://randomuser.me/api/portraits/women/1.jpg`} alt="User" className="w-12 h-12 rounded-full border-[2px] border-blue-600" />
          <div className="grid grid-cols-[20px_auto] border-[1px] border-white rounded-[5px] py-[3px] px-[12px]">
            <label className="mr-[5px]">{language === "TH" ? <Th /> : <Us />}</label>
            <select 
              className="flex-2 bg-transparent text-[12px] text-center focus:outline-none focus:ring-0" 
              name="language" 
              id="languages" 
              value={language} 
              onChange={handleLanguageChange}
            >
              <option className="text-black" value="TH">TH</option>
              <option className="text-black" value="EN">EN</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )  
}

export default Header