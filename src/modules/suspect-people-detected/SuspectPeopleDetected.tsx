import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../app/store"
import { CSVLink } from "react-csv"
import { SelectChangeEvent } from '@mui/material/Select'

// Context
import { useHamburger } from "../../context/HamburgerContext"

// Component
import Loading from "../../components/loading/Loading"
import PaginationComponent from "../../components/pagination/Pagination"

// Modules
import SearchFilter from "./search-filter/SearchFilter"

// API
import { fetchSpecialSuspectPeopleSearchDataThunk, dowloadPdfSpecialPlateThunk } from "../../features/search-data/SearchDataSlice"

// Types
import { FilterSpecialSuspectPeople, DetactSpecialPlate } from "../../features/api/types"
import { SpecialPlateSearchData } from "../../features/search-data/SearchDataTypes"

// Utils
import { PopupMessage } from "../../utils/popupMessage"
import { capitalizeFirstLetter } from "../../utils/comonFunction"

// Config
import { FILE_URL } from '../../config/apiConfig'
import { format } from "date-fns"

// Constant
import { SEPECIAL_SUSPECT_PEOPLE_FILE_NAME } from "../../constants/filename"

const SuspectPeopleDetected = () => {
  const { isOpen } = useHamburger()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100)
  const [specialSuspectPeopleSearchDataList, setSpecialSuspectPeopleSearchDataList] = useState<SpecialPlateSearchData[]>([])
  const [rowsPerPageOptions] = useState([20, 50, 100])
  const dispatch: AppDispatch = useDispatch()
  const { specialSuspectPeopleSearchData } = useSelector(
    (state: RootState) => state.searchData
  )

  const { regions } = useSelector(
    (state: RootState) => state.dropdown
  )

  useEffect(() => {
    if (specialSuspectPeopleSearchData) {
      setIsLoading(false)
    }
  }, [specialSuspectPeopleSearchData])

  const setFilterData = async (filterData: FilterSpecialSuspectPeople) => {
    setIsLoading(true)
    const {
      namePrefix,
      firstname,
      lastname,
      faceConfidence,
      selectedStartDate,
      selectedEndDate,
      checkpoint,
      selectedRegistrationType,
    } = filterData

    if (
      !namePrefix &&
      !firstname &&
      !lastname &&
      !faceConfidence &&
      !selectedStartDate &&
      !selectedEndDate &&
      !checkpoint &&
      !selectedRegistrationType
    ) {
      PopupMessage("", "กรุณาใส่เงื่อนไขการค้นหาอย่างน้อย 1 อย่าง", "warning")
      setIsLoading(false)
      return
    }

    await fetchSpecialPlateData(filterData)
  }

  const fetchSpecialPlateData = async (filterData: FilterSpecialSuspectPeople) => {
    try {
      let filter: string[] = []
      if (filterData.namePrefix) {
        filter.push(`title:${filterData.namePrefix}`)
      }
      if (filterData.firstname) {
        filter.push(`firstname:${filterData.firstname}`)
      }
      if (filterData.lastname) {
        filter.push(`lastname:${filterData.lastname}`)
      }
      if (filterData.selectedRegistrationType && filterData.selectedRegistrationType !== "all") {
        filter.push(`registration_type:${filterData.selectedRegistrationType}`)
      }
      if (filterData.faceConfidence) {
        filter.push(`faceConfidence:${filterData.faceConfidence}`)
      }
      if (filterData.checkpoint) {
        filter.push(`checkpoint:${filterData.checkpoint}`)
      }
      if (filterData.selectedStartDate) {
        filter.push(`epoch_start:${filterData.selectedStartDate.toISOString()}`)
      }
      if (filterData.selectedEndDate) {
        filter.push(`epoch_end:${filterData.selectedEndDate.toISOString()}`)
      }
      const query: Record<string, string> = {
        "filter": filter.join(","),
        "page": "1",
        "limit": rowsPerPage.toString(),
      }
      const response = await dispatch(fetchSpecialSuspectPeopleSearchDataThunk(query)).unwrap()
      
      if (response && response.data) {
        setSpecialSuspectPeopleSearchDataList(response.data)
        setIsLoading(false)
        if (response.countAll) {
          setTotalPages(Math.ceil(response.countAll / rowsPerPage))
        }
      }
    } 
    catch (error) {
      setIsLoading(false)
    }
  }

  const headers = [
    { label: SEPECIAL_SUSPECT_PEOPLE_FILE_NAME, key: "title" },
    { label: "", key: "firstname" },
    { label: "", key: "lastname" },
    { label: "", key: "checkpoint" },
    { label: "", key: "behavior" },
    { label: "", key: "confidence" },
    { label: "", key: "registration_type" },
    { label: "", key: "date" },
    { label: "", key: "time" },
  ]
  
  const csvData = [
    { 
      title: "คำนำหน้า",
      firstname: "ชื่อ",
      lastname: "นามสกุล",
      checkpoint: "จุดตรวจ",
      behavior: "พฤติการ",
      confidence: "ความแม่นยำ (%)",
      registration_type: "กลุ่มทะเบียน",
      date: "วันที่บันทึก",
      time: "เวลาที่บันทึก",
    },
    ...specialSuspectPeopleSearchDataList.map((data) => ({
      title: data.plate,
      firstname: data.region_info.name_th,
      lastname: data.vehicle_body_type,
      checkpoint: capitalizeFirstLetter(data.vehicle_make_model),
      behavior: capitalizeFirstLetter(data.vehicle_make),
      confidence: `${data.plate_confidence}`,
      registration_type: "Blacklist",
      date: format(new Date(data.epoch_start), "dd/MM/yyyy"),
      time: format(new Date(data.epoch_start), "HH:mm:ss"),
    }))
  ]

  const handleGeneratePdf = async () => {
    setIsLoading(true)
    const pdfContent: DetactSpecialPlate = {
      logo_text: "Plate Recognition",
      title_header: "รายการทะเบียนรถที่ตรวจอ่านได้",
      title_check_point: "ด่าน : ปิงโค้ง",
      table_columns: {
        plate_header: "ทะเบียน",
        image_header: "รูป",
        checkPoint_header: "จุดตรวจ",
        vehicleType_header: "ประเภทรถ",
        vehicleDetail_header: "รายละเอียดรถยนต์",
        accuracy_header: "ความแม่นยำ (%)",
        registrationGroup_header: "กลุ่มทะเบียน",
        dateTime_header: "วัน-เวลา ที่บันทึก",
        lane_header: "เลน",
      },
      table_rows: specialSuspectPeopleSearchDataList.map((data) => ({
        plate_data: data.plate,
        image_data: {
          plate_image: data.plate_image,
          vehicle_image: data.vehicle_image,
        },
        checkPoint_data: data.site_name,
        vehicleType_data: data.vehicle_body_type,
        vehicleDetail_data: [data.vehicle_make_model, data.vehicle_make, data.vehicle_color],
        accuracy_data: data.plate_confidence,
        registrationGroup_data: data.registration_type,
        dateTime_data: format(new Date(data.epoch_start), "dd/MM/yyyy (HH:mm:ss)"),
        lane_data: data.lane,
      })),
    }

    try {
      const result = await dispatch(dowloadPdfSpecialPlateThunk(pdfContent)).unwrap()
      
      if (result && result.data) {
        if (result.data.pdfUrl) {
          const fullUrl = `${FILE_URL}${result.data.pdfUrl}`
          window.open(fullUrl, '_blank')
          return
        }
      }
    } 
    catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      PopupMessage("การดาวน์โหลดล้มเหลว", errorMessage, 'error')
    }
    finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault()
    setIsLoading(true)
    setPage(value)
    const query: Record<string, string> = {
      "page": value.toString(),
      "limit": rowsPerPage.toString(),
    }
    const response = await dispatch(fetchSpecialSuspectPeopleSearchDataThunk(query)).unwrap()
    
    if (response && response.data) {
      setSpecialSuspectPeopleSearchDataList(response.data)
      setIsLoading(false)
    }
  }

  const handleRowsPerPageChange = async (event: SelectChangeEvent) => {
    setIsLoading(true)
    setRowsPerPage(parseInt(event.target.value))
    const query: Record<string, string> = {
      "page": page.toString(),
      "limit": event.target.value,
    }
    const response = await dispatch(fetchSpecialSuspectPeopleSearchDataThunk(query)).unwrap()
    
    if (response && response.data) {
      setSpecialSuspectPeopleSearchDataList(response.data)
      setIsLoading(false)
      if (response.countAll) {
        setTotalPages(Math.ceil(response.countAll / Number(event.target.value)))
      }
    }
  }

  return (
    <div className={`main-content pe-3 ${isOpen ? "pl-[130px]" : "pl-[10px]"} transition-all duration-500`}>
      {isLoading && <Loading />}
      <div id="suspect-people-detected" className="grid grid-cols-[auto_320px]">
        <div>
          <div id="head" className="flex h-[50px] justify-between">
            <div className="flex flex-col">
              <p className="text-[20px] text-white">รายการบุคคลต้องสงสัยที่ตรวจอ่านได้</p>
              <p className="text-[14px] text-white">{`จำนวน ${specialSuspectPeopleSearchDataList.length} รายการ`}</p>
            </div>
            <div className="flex items-end space-x-2">
              <motion.button 
                type="button" 
                className="flex justify-center items-center rounded"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                }}
              >
                <CSVLink
                  data={csvData}
                  headers={headers}
                  filename={`${SEPECIAL_SUSPECT_PEOPLE_FILE_NAME}.csv`}
                  className="flex items-center"
                >
                  <img
                    src="/icons/csv-icon.png"
                    alt="CSV"
                    className="w-[32px] h-[30px]"
                  />
                </CSVLink>
              </motion.button>
              <motion.button
                type="button" 
                className="flex justify-center items-center rounded"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                }}
              >
                <img src="/icons/pdf-icon.png" alt="PDF" className='w-[30px] h-[30px]' />
              </motion.button>
            </div>
          </div>
          <div id="body" className="mt-[5px] flex flex-col">
            <div className="flex-1 overflow-x-auto">
              <div id="table-data" className="mt-[10px] overflow-y-auto h-[78vh]">
                <div className="">
                  <table className="w-full text-[15px]">
                    <thead className="sticky top-0 z-10 bg-swamp backdrop-blur-md bg-opacity-80">
                      <tr className="h-[50px] w-full bg-swamp border-none">
                      <th className="text-center text-white w-[8%]">คำนำหน้า</th>
                      <th className="text-center text-white w-[12%]">ชื่อ-นามสกุล</th>
                      <th className="text-center text-white w-[7%]">รูป</th>
                      <th className="text-center text-white w-[12%]">จุดตรวจ</th>
                      <th className="text-center text-white w-[10%]">กลุ่มบุคคล</th>
                      <th className="text-center text-white w-[15%]">พฤติการ</th>
                      <th className="text-center text-white w-[10%]">วัน-เวลาที่บันทึก</th>
                      </tr>
                    </thead>
                    <tbody className="text-white">
                      {specialSuspectPeopleSearchDataList.map((data, index) => (
                        <tr key={index + 1} className="h-[50px] w-full border-b-[1px] border-dashed border-darkGray">
                          <td className="text-start text-white bg-celtic pl-5">{`${data.plate} ${data.region_info.name_th}`}</td>
                          <td className="text-center text-white bg-tuna">
                            <img
                              src={`${FILE_URL}${data.vehicle_image}`}
                              alt="Vehicle"
                              className="inline-flex items-center justify-center align-middle h-[70px] w-[60px]"
                            />
                            <img
                              src={`${FILE_URL}${data.plate_image}`}
                              alt="Plate"
                              className="inline-flex items-center justify-center align-middle h-[70px] w-[60px]"
                            />
                          </td>
                          <td className="pl-5 text-start text-white bg-celtic">{data.site_name}</td>
                          <td className="pl-5 text-start text-white bg-tuna">{data.vehicle_body_type}</td>
                          <td className="text-center text-white bg-celtic">{data.vehicle_make_model}</td>
                          <td className="text-center text-white bg-tuna">{data.vehicle_make}</td>
                          <td className="text-center text-white bg-celtic">{format(new Date(data.epoch_start), "dd/MM/yyyy (HH:mm:ss)")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className={`${specialSuspectPeopleSearchDataList.length > 0 ? "flex" : "hidden"} items-center justify-between bg-[var(--background-color)] py-3 px-1 sticky bottom-0`}>
              <PaginationComponent 
                page={page} 
                onChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={rowsPerPageOptions}
                handleRowsPerPageChange={handleRowsPerPageChange}
                totalPages={totalPages}
                setPage={setPage}
              />
            </div>
          </div>
        </div>
        <div id="search-filter" className="w-[320px] fixed right-0 top-0 pt-[80px] h-full">
          <SearchFilter  
            setFilterData={setFilterData}
          />
        </div>
      </div>
    </div>
  )
}

export default SuspectPeopleDetected