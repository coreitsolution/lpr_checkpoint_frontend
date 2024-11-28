import React, { useState } from 'react'
import HeaderBar from '../HeaderBar/HeaderBar'
import Nav from '../Nav/NavBar'
import SearchFilter from '../SearchFilter/SearchFilter'
import ExtraRegistration from '../ExtraRegistration/ExtraRegistration'
import CCTVSideBar from '../CCTVSideBar/CCTVSideBar'
import CCTV from '../CCTV/CCTV'

const HomePage = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>('car')

  const handleOnButtonClick = (componentName: string) => {
    setSelectedComponent(componentName)
  }

  return (
    <div className="App flex flex-col min-w-[1246px] min-h-screen">
      <HeaderBar />
      <div className="flex flex-1 relative">
        <Nav onButtonClick={handleOnButtonClick}/>
        <div className="flex-1 mx-4">
          {selectedComponent === "car" && <ExtraRegistration />}
          {selectedComponent === "cctv" && <CCTV />}
        </div>
        <div className='flex-none'>
          {selectedComponent === "car" && <SearchFilter />}
          {selectedComponent === "cctv" && <CCTVSideBar />}
        </div>
      </div>
    </div>
  )
}

export default HomePage