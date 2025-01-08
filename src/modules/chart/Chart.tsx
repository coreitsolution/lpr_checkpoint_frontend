import { useState, useEffect, useLayoutEffect } from 'react'
import { PieChart } from '@mui/x-charts'
import { motion } from 'framer-motion'
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer'
import { BarPlot, LinePlot, AxisConfig, ChartsXAxis, ChartsYAxis, ChartsXAxisProps, ChartsGrid, axisClasses, chartsGridClasses } from '@mui/x-charts'
import { Box } from '@mui/material'

// Context
import { useHamburger } from "../../context/HamburgerContext"

// Components
import Loading from "../../components/loading/Loading"

const Chart = () => {
  const { isOpen } = useHamburger()
  const [isLoading, setIsLoading] = useState(true)
  const progress = [
    { id: 1, car: "2ขต 7943 กรุงเทพทหานคร : Pickup/ Blcklist", duplicate: 55 },
    { id: 2, car: "4กจ 5253 กรุงเทพทหานคร : Pickup/ Member", duplicate: 45 },
    { id: 3, car: "บธ 1898 กรุงเทพทหานคร : Sedan/ VIP", duplicate: 38 },
    { id: 4, car: "ผค 9464 กรุงเทพทหานคร : Pickup/ Member", duplicate: 35 },
    { id: 5, car: "บท 7665 เชียงใหม่ : Sedan/ Member", duplicate: 30 },
    { id: 6, car: "2ขต 7943 กรุงเทพทหานคร : Pickup/ Member", duplicate: 28 },
    { id: 7, car: "4กจ 5253 กรุงเทพทหานคร : Pickup/ Member", duplicate: 25 },
    { id: 8, car: "บธ 1898 กรุงเทพทหานคร : Sedan/ Member", duplicate: 18 },
    { id: 9, car: "ผค 9464 กรุงเทพทหานคร : Pickup/ Member", duplicate: 15 },
    { id: 10, car: "บท 7665 เชียงใหม่ : Sedan/ Member", duplicate: 14 },
  ]

  const carDetect = [
    { time: '06:00', value: 50 },
    { time: '07:00', value: 60 },
    { time: '08:00', value: 80 },
    { time: '09:00', value: 70 },
    { time: '10:00', value: 90 },
    { time: '11:00', value: 120 },
    { time: '12:00', value: 100 },
    { time: '13:00', value: 130 },
    { time: '14:00', value: 110 },
    { time: '15:00', value: 140 },
    { time: '16:00', value: 150 },
    { time: '17:00', value: 160 },
    { time: '18:00', value: 180 },
  ]

  const timeCarDetectList = carDetect.map((row) => row.time)
  const valueCarDetectList = carDetect.map((row) => row.value)

  const specialCarDetect = [
    { time: '06:00', value: 20 },
    { time: '07:00', value: 0 },
    { time: '08:00', value: 0 },
    { time: '09:00', value: 10 },
    { time: '10:00', value: 0 },
    { time: '11:00', value: 0 },
    { time: '12:00', value: 0 },
    { time: '13:00', value: 0 },
    { time: '14:00', value: 0 },
    { time: '15:00', value: 0 },
    { time: '16:00', value: 0 },
    { time: '17:00', value: 0 },
    { time: '18:00', value: 30 },
  ]

  const combined = carDetect.map((carItem) => {
    const specialItem = specialCarDetect.find(
      (special) => special.time === carItem.time
    );
    return carItem.value + (specialItem?.value || 0)
  })

  const specialValueCarDetectList = specialCarDetect.map((row) => row.value)

  const maxValueProgress = Math.max(...progress.map(row => row.duplicate))

  const palette = ['#4374A0', '#5089BC', '#5B9BD5', '#97B9E0', '#BED1EA']

  const pieRightParams = {
    height: 250,
    margin: { right: 0 },
    slotProps: { legend: { hidden: true } },
    style: { border: 'none' }
  }

  const pieFooterParams = {
    height: 200,
    width: 225,
    margin: { right: 0 },
    slotProps: { legend: { hidden: true } },
    style: { border: 'none' }
  }

  const pieData = [
    { id: '1', value: 25 }, 
    { id: '2', value: 35 }, 
    { id: '3', value: 40 },
    { id: '4', value: 40 },
    { id: '5', value: 40 }
  ]

  const carTypes = [
    { type: "Sedan", color: "bg-[#3F73A3]" },
    { type: "Pickup", color: "bg-[#4987C0]" },
    { type: "Van", color: "bg-[#4B90D1]" },
    { type: "Truck", color: "bg-[#8FB1DE]" },
    { type: "Other", color: "bg-[#ACC1DE]" }
  ]

  const carBrands = [
    { brand: "Toyota", color: "bg-[#346794]" },
    { brand: "Honda", color: "bg-[#437DAF]" },
    { brand: "Isuzu", color: "bg-[#4B89C2]" },
    { brand: "Mitsubishi", color: "bg-[#4D91CE]" },
    { brand: "Nissan", color: "bg-[#649CD5]" },
    { brand: "Mazda", color: "bg-[#8CAEDB]" },
    { brand: "Ford", color: "bg-[#A6C1DF]" },
    { brand: "Other", color: "bg-[#BFCFE6]" }
  ]

  const carColors = [
    { carColor: "White", color: "bg-[#346794]" },
    { carColor: "Black", color: "bg-[#437DAF]" },
    { carColor: "Red", color: "bg-[#4B89C2]" },
    { carColor: "Silver", color: "bg-[#4D91CE]" },
    { carColor: "Grey", color: "bg-[#649CD5]" },
    { carColor: "Blue", color: "bg-[#8CAEDB]" },
    { carColor: "Bronze", color: "bg-[#A6C1DF]" },
    { carColor: "Other", color: "bg-[#BFCFE6]" }
  ]

  useLayoutEffect(() => {
    setIsLoading(false)
  }, [])

  const LinearProgressWithLabel = ({ value }: { value: number }) => {
    const progressPercentage = (value / maxValueProgress) * 100
    const [trigger, setTrigger] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setTrigger((prev) => prev + 1)
      }, 4000)

      return () => clearInterval(interval)
    }, [])

    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <div className='w-full bg-nightRider'>
          <motion.div
            key={trigger}
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            style={{
              height: 3,
              borderRadius: 4,
              background: 'linear-gradient(to right, #185887, #2B9BED)',
            }}
          />
        </div>
      </Box>
    )
  }

  return (
    <div className={`main-content pe-3 ${isOpen ? "pl-[130px]" : "pl-[10px]"} transition-all duration-500`}>
      {isLoading && <Loading />}
      <div id='chart' className="grid grid-cols-[auto_550px] gap-4 h-full">
        {/* Left Side */}
        <div className="grid grid-rows-[30%_69%] gap-2">
          {/* Header */}
          <div className='relative'>
            <div 
              className="flex-none mr-[3px] mb-[5px] p-[2px] bg-dodgerBlue h-full rounded-bl-[14px] rounded-br-[14px]"
              style={{ 
                shapeOutside: "polygon(0% 0%, 251px 0%, 302px 30px, 100% 30px, 100% 100%, 0% 100%)",
                clipPath: "polygon(0% 0%, 251px 0%, 302px 30px, 100% 30px, 100% 100%, 0% 100%)",
              }}
            >
              <div 
                className="h-full bg-[var(--background-color)] rounded-bl-[15px] rounded-br-[15px] overflow-hidden"
                style={{
                  shapeOutside: "polygon(0% 0%, 249px 0%, 300px 30px, 100% 30px, 100% 100%, 0% 100%)",
                  clipPath: "polygon(0% 0%, 249px 0%, 300px 30px, 100% 30px, 100% 100%, 0% 100%)",
                }}
              >
                <div
                  id="connection-status"
                  className="grid grid-cols-1 w-full h-full pt-[5px]  bg-[var(--background-color)] rounded-bl-[15px] rounded-br-[15px]"
                >
                  {/* Header */}
                  <span className="flex justify-start text-[1.9vh] ml-[15px] font-bold">
                    สถานะการเชื่อมต่อ
                  </span>
                  <div className="flex justify-end pr-6 pt-2 text-[1.5vh] text-dodgerBlue">
                    Last Update: 27/06/2024 (15:00)
                  </div>

                  <div className="flex h-full overflow-auto pb-3">
                    {/* Complete Content */}
                    <div className="h-full w-full flex px-6 pt-2 rounded-bl-[15px] rounded-br-[15px]">
                      <div className="flex flex-col h-full w-full bg-lightSteelBlue rounded-[15px] p-3 shadow-md">
                        <div className="flex items-center">
                          <div className="rounded-full p-px bg-gradient-to-b from-dodgerBlue to-bahamaBlue">
                            <img src="/icons/success.png" alt="Complete" className="w-[38px] h-[38px]" />
                          </div>
                          <span className="ml-[10px] text-elephant font-bold text-[1.9vh]">
                            Complete
                          </span>
                        </div>
                        <div className="flex justify-end text-[6vh] font-bold text-white">
                          5000
                        </div>
                        <p className="text-black text-[1.5vh]">
                          สามารถส่งข้อมูลได้ภายใน 1 นาที
                        </p>
                      </div>
                    </div>

                    {/* Not Complete Content */}
                    <div className="h-full w-full flex px-6 pt-2 rounded-bl-[15px] rounded-br-[15px]">
                      <div className="flex flex-col h-full w-full bg-pictonBlue rounded-[15px] p-3 shadow-md">
                        <div className="flex items-center">
                          <div className="rounded-full p-px bg-gradient-to-b from-dodgerBlue to-bahamaBlue">
                            <img src="/icons/error.png" alt="Complete" className="w-[38px] h-[38px]" />
                          </div>
                          <span className="ml-[10px] text-elephant font-bold text-[1.9vh]">
                            Not Complete
                          </span>
                        </div>
                        <div className="flex justify-end text-[6vh] font-bold text-white">
                          50
                        </div>
                        <p className="text-black text-[1.5vh]">
                          ไม่สามารถส่งข้อมูลได้ภายใน 30 นาที
                        </p>
                      </div>
                    </div>

                    {/* Waiting Content */}
                    <div className="h-full w-full flex px-6 pt-2 rounded-bl-[15px] rounded-br-[15px]">
                      <div className="flex flex-col h-full w-full bg-lochmara rounded-[15px] p-3 shadow-md">
                        <div className="flex items-center">
                          <div className="rounded-full p-px bg-gradient-to-b from-dodgerBlue to-bahamaBlue">
                            <img src="/icons/waiting.png" alt="Complete" className="w-[38px] h-[38px]" />
                          </div>
                          <span className="ml-[10px] text-elephant font-bold text-[1.9vh]">
                            Waiting
                          </span>
                        </div>
                        <div className="flex justify-end text-[6vh] font-bold text-white">
                          500
                        </div>
                        <p className="text-black text-[1.5vh]">
                          รอการเชื่อมต่อ สามารถส่งข้อมูลได้ภายใน 30 นาที
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Control Button */}
            <div className="absolute top-1 right-1">
              <div className='flex space-x-2'>
                <button>
                  <img src="/icons/sync.png" alt="Refresh" className='w-[20px] h-[20px]' />
                </button>
                <button>
                  <img src="/icons/settings.png" alt="Setting" className='w-[20px] h-[20px]' />
                </button>
                <button>
                  <img src="/icons/download.png" alt="download" className='w-[20px] h-[20px]' />
                </button>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className='relative'>
            <div 
              className="flex-none mr-[3px] mb-[5px] p-[2px] bg-dodgerBlue h-full"
              style={{ 
                clipPath: "polygon(0% 0%, 251px 0%, 302px 30px, 100% 30px, 100% 100%, 0% 100%)",
                borderBottomLeftRadius: "14px",
                borderBottomRightRadius: "14px",
              }}
            >
              <div 
                className="h-full bg-[var(--background-color)]"
                style={{
                  clipPath: "polygon(0% 0%, 249px 0%, 300px 30px, 100% 30px, 100% 100%, 0% 100%)",
                  borderBottomLeftRadius: "15px",
                  borderBottomRightRadius: "15px",
                }}
              >
                <div
                  id="car-detect"
                  className="grid grid-cols-1 w-full pt-[5px] bg-[var(--background-color)] rounded-[15px]"
                >
                  {/* Header */}
                  <div>
                    <span className="flex justify-start text-[1.9vh] ml-[15px]">ข้อมูลรถที่ผ่านด่านตรวจ</span>
                    <div className="h-full overflow-auto">
                      <div className="flex justify-end pr-6 pt-2 text-[1.5vh] text-dodgerBlue">
                        {`ช่วงเวลา :  27/06/2024 (10:00) - 27/06/2024 (15:00) `}
                      </div>
                      {/* Bar Chart */}
                      <div className='flex items-center justify-center'>
                        <div className='w-full'>
                          <ResponsiveChartContainer
                            series={[
                              {
                                type: 'line',
                                data: valueCarDetectList,
                              },
                              {
                                type: 'line',
                                data: combined,
                              },
                              {
                                type: 'bar',
                                data: valueCarDetectList,
                                stack: 'total',
                              },
                              {
                                type: 'bar',
                                data: specialValueCarDetectList,
                                stack: 'total',
                              },
                            ]}
                            height={255}
                            yAxis={[{ id: 'value', scaleType: 'linear' }]}
                            xAxis={[
                              { 
                                id: 'time',
                                scaleType: 'band', 
                                categoryGapRatio: 0.5,
                                data: timeCarDetectList,
                              } as AxisConfig<'band', any, ChartsXAxisProps>
                            ]}
                            sx={{
                              [`.MuiLineElement-series-auto-generated-id-0`]: {
                                stroke: '#2B9BED',
                              },
                              [`.MuiLineElement-series-auto-generated-id-1`]: {
                                stroke: '#2B9BED',
                              },
                              [`.MuiBarElement-series-auto-generated-id-2`]: {
                                fill: '#508ABC',
                              },
                              [`.MuiBarElement-series-auto-generated-id-3`]: {
                                fill: '#98B8DF',
                              },
                              [`.${axisClasses.root}`]: {
                                [`.${axisClasses.tickLabel}`]: {
                                  fill: '#48494B',
                                },
                              },
                              "& .MuiChartsAxis-bottom .MuiChartsAxis-line":{
                                stroke:"#48494B",
                                strokeWidth:0.4
                              },
                              [`& .${chartsGridClasses.line}`]: { 
                                strokeWidth: 1,
                                stroke: 'rgba(72, 73, 75, 0.3)',
                              },
                            }}
                          >
                            <ChartsGrid horizontal/>
                            <BarPlot />
                            <LinePlot />
                            <ChartsXAxis axisId="time"/>
                            <ChartsYAxis axisId="value"/>
                          </ResponsiveChartContainer>
                        </div>
                        {/* Summary Content */}
                        <div className='flex flex-col space-y-5 w-[25vh]'>
                          <div className="h-[16vh] w-full flex pr-4 pt-2 rounded-bl-[15px] rounded-br-[15px]">
                            <div className="flex flex-col h-full w-full bg-pictonBlue3 rounded-[15px] p-3 shadow-md">
                              <div className="flex items-center">
                                <div className="rounded-full p-[4px] bg-white">
                                  <img src="/icons/car-front-blue.png" alt="Complete" className="w-[35px] h-[35px]" />
                                </div>
                                <span className="ml-[5px] text-elephant font-bold text-[1.9vh]">
                                  Summary
                                </span>
                              </div>
                              <div className="flex justify-end text-[5vh] font-bold text-white">
                                5500
                              </div>
                            </div>
                          </div>
                          <div className='flex space-x-5 pr-4 items-center justify-center text-[1.3vh]'>
                            <div className='flex'>
                              <div className='w-[20px] h-[20px] bg-danube2'></div>
                              <span className='ml-[10px] text-dodgerBlue'>Common</span>
                            </div>
                            <div className='flex'>
                              <div className='w-[20px] h-[20px] bg-lightSteelBlue2'></div>
                              <span className='ml-[10px] text-dodgerBlue'>Backlist</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Pie Chart */}
                      <div className='px-4'>
                        <div>
                          <span className='text-[1.5vh]'>จำนวนรถที่ตรวจจับได้</span>
                        </div>
                        <div className='grid grid-cols-3'>
                          {/* Type Car Pie Chart */}
                          <div className='flex items-center justify-center space-x-8'>
                            <div className='flex flex-col items-center justify-center'>
                              <PieChart
                                colors={palette}
                                series={[
                                  {
                                    data: pieData,
                                    innerRadius: 40,
                                    arcLabel: (params) => `${params.value}`,
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    faded: { additionalRadius: -5 },
                                  },
                                ]}
                                sx={{
                                  '& .MuiPieArc-root': {
                                    stroke: 'transparent',
                                  },
                                  '& .MuiPieArcLabel-root': {
                                    fill: 'white',
                                    fontSize: '14px',
                                  },
                                }}
                                {...pieFooterParams}
                              />
                              <div>
                                <span className='text-[1.5vh]'>ปริมาณรถแยกตามประเภทรถ</span>
                              </div>
                            </div>
                            <div className='flex flex-col space-y-5 items-start justify-center text-[1.3vh]'>
                              {
                                carTypes.map((type) => (
                                  <div className='flex'>
                                    <div className={`w-[20px] h-[20px] ${type.color}`}></div>
                                    <span className='ml-[10px] text-dodgerBlue'>{type.type}</span>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                          {/* Car Brand Pie Chart */}
                          <div className='flex items-center justify-center space-x-8'>
                            <div className='flex flex-col items-center justify-center'>
                              <PieChart
                                colors={palette}
                                series={[
                                  {
                                    data: pieData,
                                    innerRadius: 40,
                                    arcLabel: (params) => `${params.value}`,
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    faded: { additionalRadius: -5 },
                                  },
                                ]}
                                sx={{
                                  '& .MuiPieArc-root': {
                                    stroke: 'transparent',
                                  },
                                  '& .MuiPieArcLabel-root': {
                                    fill: 'white',
                                    fontSize: '14px',
                                  },
                                }}
                                {...pieFooterParams}
                              />
                              <div>
                                <span className='text-[1.5vh]'>ปริมาณรถแยกตามยี่ห้อรถยนต์</span>
                              </div>
                            </div>
                            <div className='flex flex-col space-y-[6px] items-start justify-center text-[1.3vh]'>
                              {
                                carBrands.map((type) => (
                                  <div className='flex'>
                                    <div className={`w-[20px] h-[20px] ${type.color}`}></div>
                                    <span className='ml-[10px] text-dodgerBlue'>{type.brand}</span>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                          {/* Car Color Pie Chart */}
                          <div className='flex items-center justify-center space-x-8'>
                            <div className='flex flex-col items-center justify-center'>
                              <PieChart
                                colors={palette}
                                series={[
                                  {
                                    data: pieData,
                                    innerRadius: 40,
                                    arcLabel: (params) => `${params.value}`,
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    faded: { additionalRadius: -5 },
                                  },
                                ]}
                                sx={{
                                  '& .MuiPieArc-root': {
                                    stroke: 'transparent',
                                  },
                                  '& .MuiPieArcLabel-root': {
                                    fill: 'white',
                                    fontSize: '14px',
                                  },
                                }}
                                {...pieFooterParams}
                              />
                              <div>
                                <span className='text-[1.5vh]'>ปริมาณรถแยกตามสีรถ</span>
                              </div>
                            </div>
                            <div className='flex flex-col space-y-[6px] items-start justify-center text-[1.3vh]'>
                              {
                                carColors.map((type) => (
                                  <div className='flex'>
                                    <div className={`w-[20px] h-[20px] ${type.color}`}></div>
                                    <span className='ml-[10px] text-dodgerBlue'>{type.carColor}</span>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Control Button */}
            <div className="absolute top-1 right-1">
              <div className='flex space-x-2'>
                <button>
                  <img src="/icons/sync.png" alt="Refresh" className='w-[20px] h-[20px]' />
                </button>
                <button>
                  <img src="/icons/settings.png" alt="Setting" className='w-[20px] h-[20px]' />
                </button>
                <button>
                  <img src="/icons/download.png" alt="download" className='w-[20px] h-[20px]' />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side */}
        <div className='relative'>
          <div 
            className="flex-none mr-[3px] mb-[5px] p-[2px] bg-dodgerBlue h-full"
            style={{ 
              clipPath: "polygon(0% 0%, 251px 0%, 302px 30px, 100% 30px, 100% 100%, 0% 100%)",
              borderBottomLeftRadius: "14px",
              borderBottomRightRadius: "14px",
            }}
          >
            <div 
              className="h-full bg-[var(--background-color)]"
              style={{
                clipPath: "polygon(0% 0%, 249px 0%, 300px 30px, 100% 30px, 100% 100%, 0% 100%)",
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
              }}
            >
              <div
                id="car-detect-multiple"
                className="grid grid-cols-1 w-full pt-[5px] bg-[var(--background-color)] rounded-[15px]"
              >
                {/* Header */}
                <div>
                  <span className="flex justify-start text-[1.9vh] ml-[15px]">รถที่ผ่านด่านซ้ำซ้อน</span>
                  <div className="h-[99%]">
                    <div className="pl-3 pt-3 text-[1.6vh]">
                      <div className="grid grid-cols-[120px_30px_auto] text-dodgerBlue">
                        <span>ช่วงเวลา</span>
                        <span>:</span>
                        <span>27/06/2024 (10:00) - 27/06/2024 (15:00)</span>
                        <span>ประเภทรถ</span>
                        <span>:</span>
                        <span>ทุกประเภท</span>
                      </div>
                      <div className='w-full h-[30vh] flex relative items-center justify-center'>
                        <PieChart
                          colors={palette}
                          series={[
                            {
                              data: pieData,
                              innerRadius: 55,
                              arcLabel: (params) => `${params.value}`,
                              highlightScope: { faded: 'global', highlighted: 'item' },
                              faded: { additionalRadius: -5 },
                            },
                          ]}
                          sx={{
                            '& .MuiPieArc-root': {
                              stroke: 'transparent',
                            },
                            '& .MuiPieArcLabel-root': {
                              fill: 'white',
                              fontSize: '14px',
                            },
                          }}
                          {...pieRightParams}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-48.5%, -50%)',
                            width: 109,
                            height: 109,
                            borderRadius: '50%',
                            background: 'radial-gradient(#2B9BED 0%, black 80%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '28px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                          }}
                        >
                          1450
                        </div>
                      </div>
                      {/* Color description */}
                      <div className='flex space-x-5 items-center justify-center text-[1.3vh]'>
                        {
                          carTypes.map((type) => (
                            <div className='flex'>
                              <div className={`w-[20px] h-[20px] ${type.color}`}></div>
                              <span className='ml-[10px] text-dodgerBlue text-[1.5vh]'>{type.type}</span>
                            </div>
                          ))
                        }
                      </div>
                      {/* Description Detail */}
                      <div className='flex flex-col px-4 pt-4 h-full'>
                        <div className='border-b-[1px] border-celti'>
                          <span className='text-[1.7vh]'>จำนวนรถที่ผ่านซ้ำซ้อนแบ่งตามประเภทรถ</span>
                        </div>
                        <div className='pt-3'>
                          <div className='flex justify-end items-center'>
                            <span className='text-[1.3vh]'>จำนวนที่ซ้ำซ้อน</span>
                          </div>
                          <div className='flex flex-col space-y-2'>
                            {
                              progress.map((row) => (
                                <div>
                                  <div className='flex justify-between text-[1.5vh]'>
                                    <span>{row.car}</span>
                                    <span>{row.duplicate}</span>
                                  </div>
                                  <Box sx={{ width: '100%' }}>
                                    <LinearProgressWithLabel value={row.duplicate} />
                                  </Box>
                                </div>
                              ))
                            }
                          </div>
                          <div className='flex items-center justify-start mt-2'>
                            <span>รถที่ผ่านซ้ำซ้อน 10 อันดับแรก</span>
                          </div>
                        </div>
                      </div>
                    </div>  
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Control Button */}
          <div className="absolute top-1 right-1">
            <div className='flex space-x-2'>
              <button>
                <img src="/icons/sync.png" alt="Refresh" className='w-[20px] h-[20px]' />
              </button>
              <button>
                <img src="/icons/settings.png" alt="Setting" className='w-[20px] h-[20px]' />
              </button>
              <button>
                <img src="/icons/download.png" alt="download" className='w-[20px] h-[20px]' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chart