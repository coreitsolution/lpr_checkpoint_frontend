import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import { RootState } from "../../app/store"
import { CSVLink } from "react-csv"
import {
  Dialog,
  SelectChangeEvent
} from "@mui/material"
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'

// Context
import { useHamburger } from "../../context/HamburgerContext"

// Component
import Loading from "../../components/loading/Loading"
import PaginationComponent from "../../components/pagination/Pagination"
import ImagesCarousel from "../../components/images-carousel/ImagesCarousel"

// Modules
import SearchFilter from "./search-filter/SearchFilter"

// Types
import { 
  FilterSpecialPlates, 
  FilterSpecialPlatesBody, 
  PdfDownload 
} from "../../features/api/types"
import { LastRecognitionData } from "../../features/live-view-real-time/liveViewRealTimeTypes"
import { SpecialPlateSearchResult } from '../../features/search-data/SearchDataTypes';

// Utils
import { reformatString, formatNumber } from "../../utils/commonFunction"
import { PopupMessage } from "../../utils/popupMessage"
import { fetchClient, combineURL } from "../../utils/fetchClient"

// Config
import { getUrls } from '../../config/runtimeConfig';

// Constant
import { SPECIAL_PLATE_FILE_NAME } from "../../constants/filename"
import { SearchSpecialRowPerPages } from "../../constants/dropdown"

// i18n
import { useTranslation } from "react-i18next";

dayjs.extend(buddhistEra)

const SpecialRegistrationDetected = () => {
  // i18n
  const { t, i18n } = useTranslation();

  const { isOpen } = useHamburger()
  const [isLoading, setIsLoading] = useState(false)
  const [isImageCardShow, setIsImageCardShow] = useState(false)
  const [isSearch, setIsSearch] = useState(false)
  const [page, setPage] = useState(1)
  const [pageInput, setPageInput] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(SearchSpecialRowPerPages[0])
  const [specialPlateSearchDataList, setSpecialPlateSearchDataList] = useState<LastRecognitionData[]>([])
  const [rowsPerPageOptions] = useState(SearchSpecialRowPerPages)
  const [filterSpecialPlatesData, setFilterSpecialPlatesData] = useState<FilterSpecialPlates | null>(null)
  const tdRefs = useRef<(HTMLTableCellElement | null)[]>([])
  const [carouselData, setCarouselData] = useState<{plate: string, vehicleImage: string, plateImage: string} | null>(null)
  const tableDataRef = useRef<HTMLDivElement>(null)
  const { FILE_URL, IMAGE_URL, API_URL } = getUrls();
  const [allData, setAllData] = useState<number>(0);

  const { specialPlateSearchData, searchDataStatus, searchDataError } = useSelector(
    (state: RootState) => state.searchData
  )

  useEffect(() => {
    if (searchDataStatus === "failed" && searchDataError) {
      PopupMessage(t("message.error.something-wrong-occur"), searchDataError, "error")
    }
  }, [searchDataStatus, searchDataError, i18n.language])

  useEffect(() => {
    if (specialPlateSearchData) {
      setIsLoading(false)
    }
  }, [specialPlateSearchData])

  useEffect(() => {
    if (tableDataRef.current) {
      tableDataRef.current.scrollTop = 0;
    }
  }, [specialPlateSearchDataList])

  const setFilterData = async (filterData: FilterSpecialPlates) => {
    setIsLoading(true)
    setIsSearch(true)
    await fetchSpecialPlateData(filterData)
  }

  const postSpecialPlateSearchData = async (data: FilterSpecialPlates, page: number, limit: number,) => {
    const update: FilterSpecialPlatesBody = {
      ...data,
      page: page,
      limit: limit,
      orderBy: "id",
      reverseOrder: true,
      includesVehicleInfo: 1,
    }

    try {
      return await fetchClient<SpecialPlateSearchResult>(
        combineURL(API_URL, "/lpr-data/search"),
        {
          method: "POST",
          body: JSON.stringify(update),
        }
      );
    }
    catch (error) {
      return null
    }
  }

  const fetchSpecialPlateData = async (filterData: FilterSpecialPlates) => {
    try {
      setFilterSpecialPlatesData(filterData)

      const response = await postSpecialPlateSearchData(filterData, 1, rowsPerPage)
      
      if (response && response.data) {
        setSpecialPlateSearchDataList(response.data)
        setPage(1)
        setPageInput(1)
        setIsLoading(false)
        if (response.filteredCount) {
          setAllData(response.filteredCount)
          setTotalPages(Math.ceil(response.filteredCount / rowsPerPage))
        }
      }
    } 
    catch (error) {
      setIsLoading(false)
    }
  }

  const headers = [
    { label: SPECIAL_PLATE_FILE_NAME, key: "title" },
    { label: "", key: "province" },
    { label: "", key: "check_point" },
    { label: "", key: "vehicle_type" },
    { label: "", key: "model" },
    { label: "", key: "brand" },
    { label: "", key: "color" },
    { label: "", key: "registration_type" },
    { label: "", key: "date" },
    { label: "", key: "time" },
  ]
  
  const csvData = specialPlateSearchDataList?.length ? [
    { 
      title: t('csv.column.title'),
      province: t('csv.column.province'),
      check_point: t('csv.column.check-point'),
      vehicle_type: t('csv.column.vehicle-type'),
      model: t('csv.column.model'),
      brand: t('csv.column.brand'),
      color: t('csv.column.color'),
      registration_type: t('csv.column.registration-type'),
      date: t('csv.column.date'),
      time: t('csv.column.time'),
    },
    ...specialPlateSearchDataList.map((data) => ({
      title: data.plate,
      province: data.region_info ? data.region_info.name_th : "",
      check_point: data.camera_info ? data.camera_info.cam_id : "",
      vehicle_type: data.vehicle_body_type_info ?  i18n.language === "th" ? data.vehicle_body_type_info.body_type_th : data.vehicle_body_type_info.body_type_en : reformatString(data.vehicle_body_type),
      model: data.vehicle_model_info ? data.vehicle_model_info.model_en : reformatString(data.vehicle_body_type),
      brand: data.vehicle_make_info ? data.vehicle_make_info.make_en : reformatString(data.vehicle_make),
      color: data.vehicle_color_info ? i18n.language === "th" ? data.vehicle_color_info.color_th : data.vehicle_color_info.color_en : reformatString(data.vehicle_color),
      registration_type: data.special_plate && data.special_plate.plate_class_info.title_en || "Normal",
      date: dayjs(data.epoch_start).format(i18n.language === "th" ? 'DD/MM/BBBB' : 'DD/MM/YYYY'),
      time: dayjs(data.epoch_start).format('HH:mm:ss'),
    }))
  ] : []

  const handleGeneratePdf = async () => {
    if (specialPlateSearchDataList.length > 0) {
      setIsLoading(true)
      try {
        const response = await fetchClient<PdfDownload>(combineURL(API_URL, "/lpr-data/search/get-pdf"), {
          method: "GET",
        });
        if (response) {
          window.open(`${FILE_URL}${response.filePath}`, "_blank");
        }
      }
      catch (error) {
        PopupMessage(t("message.error.download-failed"), "", "error")
      }
      finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
      }
    }
  }

  const handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
    if (!filterSpecialPlatesData) return
    event.preventDefault()
    setIsLoading(true)
    setPage(value)
    setPageInput(value)

    const response = await postSpecialPlateSearchData(filterSpecialPlatesData, value, rowsPerPage)
    
    if (response && response.data) {
      setSpecialPlateSearchDataList(response.data)
      setIsLoading(false)
    }
  }

  const handlePageInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    const cleaned = input.replace(/\D/g, '')

    if (cleaned) {
      const numberInput = Number(cleaned)
      if (numberInput > 0 && numberInput <= totalPages) {
        setPageInput(numberInput)
      }
    }
    else if (cleaned === "") {
      setPageInput(1)
    }
    return cleaned
  }

  const handlePageInputKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && filterSpecialPlatesData) {
      event.preventDefault()
  
      setIsLoading(true)
      setPage(pageInput)

      try {
        const response = await postSpecialPlateSearchData(filterSpecialPlatesData, pageInput, rowsPerPage)
        if (response && response.data) {
          setSpecialPlateSearchDataList(response.data)
        }
      } 
      catch (error) {
        PopupMessage(t('message.error.something-wrong-occur'), "", "error")
      } 
      finally {
        setIsLoading(false)
      }
    }
  }

  const handleRowsPerPageChange = async (event: SelectChangeEvent) => {
    if (!filterSpecialPlatesData) return
    setIsLoading(true)
    setRowsPerPage(parseInt(event.target.value))

    const response = await postSpecialPlateSearchData(filterSpecialPlatesData, page, Number(event.target.value))
    
    if (response && response.data) {
      setSpecialPlateSearchDataList(response.data)
      setIsLoading(false)
      if (response.countAll) {
        setTotalPages(Math.ceil(response.countAll / Number(event.target.value)))
      }
    }
  }

  const checkRegistrationTypeColor = (value: string | undefined): string => {
    if (!value) {
      return ""
    }

    const type = value.toLocaleLowerCase() 
    if (type === "blacklist") {
      return "bg-darkRed"
    }
    else if (type === "vip") {
      return "bg-fruitSalad"
    }
    else if (type === "member") {
      return "bg-dodgerBlue"
    }

    return ""
  }

  const handleImageClick = (event: React.MouseEvent, plate: string, vehicleImage: string, plateImage: string) => {
    event.stopPropagation()
    setIsImageCardShow(true)
    setCarouselData({
      plate: plate,
      vehicleImage: `${IMAGE_URL}${vehicleImage}`,
      plateImage: `${IMAGE_URL}${plateImage}`
    })
  }

  return (
    <div
      className={`main-content pe-3 ${
        isOpen ? "pl-[130px]" : "pl-[10px]"
      } transition-all duration-500`}
    >
      {isLoading && <Loading />}
      <div
        id="special-registration-detected"
        className="grid grid-cols-[1fr_320px]"
      >
        <div className="min-w-0">
          <div id="head" className="flex h-[50px] justify-between">
            <div className="flex flex-col">
              <p className="text-[20px] text-white">
                {t('screen.special-plate-detected')}
              </p>
              <p className="text-[14px] text-white">{`${t('text.amount')} ${formatNumber(allData)} ${t('text.item')}`}</p>
            </div>
            <div className="flex items-end space-x-2">
              <motion.button
                type="button"
                className={`flex justify-center items-center rounded ${!csvData.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                whileHover={csvData.length ? {
                  scale: 1.1,
                  rotate: 5,
                } : undefined}
              >
                {csvData.length ? (
                  <CSVLink
                    data={csvData}
                    headers={headers}
                    filename={`${SPECIAL_PLATE_FILE_NAME}.csv`}
                    className="flex items-center"
                  >
                    <img
                      src="/icons/csv-icon.png"
                      alt="CSV"
                      className="w-[32px] h-[30px]"
                    />
                  </CSVLink>
                ) : (
                  <img
                    src="/icons/csv-icon.png"
                    alt="CSV"
                    className="w-[32px] h-[30px]"
                  />
                )}
              </motion.button>
              <motion.button
                type="button"
                className={`flex justify-center items-center rounded ${!csvData.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                whileHover={csvData.length ? {
                  scale: 1.1,
                  rotate: 5,
                } : undefined}
                onClick={handleGeneratePdf}
              >
                <img
                  src="/icons/pdf-icon.png"
                  alt="PDF"
                  className="w-[30px] h-[30px]"
                />
              </motion.button>
            </div>
          </div>
          <div id="body" className="mt-[5px] flex flex-col">
            <div className="flex-1 overflow-x-auto">
              <div 
                id="table-data" 
                className="mt-[10px] overflow-y-auto h-[78vh]" 
                ref={tableDataRef}
              >
                <div className="">
                  <table className="w-full text-[15px]">
                    <thead className="sticky top-0 z-10 bg-swamp backdrop-blur-md bg-opacity-80">
                      <tr className="h-[50px] w-full bg-swamp border-none">
                        <th className="text-center text-white">{t('table.column.plate')}</th>
                        <th className="text-center text-white w-[12%]">{t('table.column.image')}</th>
                        <th className="text-center text-white w-[15%]">{t('table.column.checkpoint')}</th>
                        <th className="text-center text-white w-[15%]">{t('table.column.car-type')}</th>
                        <th className="text-center text-white w-[10%]">{t('table.column.model')}</th>
                        <th className="text-center text-white w-[10%]">{t('table.column.brand')}</th>
                        <th className="text-center text-white w-[10%]">{t('table.column.color')}</th>
                        <th className="text-center text-white w-[13%]">
                          {t('table.column.date-time-detected')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-white">
                      {
                        specialPlateSearchDataList.length > 0 ?
                        specialPlateSearchDataList.map((data, index) => {
                          const bgColor = data.is_special_plate ? checkRegistrationTypeColor(data.special_plate?.plate_class_info?.title_en) : ""

                          return (
                            <tr key={index + 1} className={`h-[50px] w-full border-b-[1px] border-dashed border-darkGray
                              ${data.is_special_plate ? bgColor : ""}
                            `}>
                              <td className={`text-start text-white ${data.is_special_plate ? bgColor : "bg-tuna"} pl-5`}>{`${data.plate} ${data.region_info.name_th}`}</td>
                              <td 
                                className={`text-center text-white ${data.is_special_plate ? bgColor : "bg-celtic"}`}
                                ref={el => tdRefs.current[index] = el}
                                onClick={(e) => handleImageClick(e, `${data.plate} ${data.region_info ? data.region_info.name_th : ""}`, data.vehicle_image, data.plate_image)}
                              >
                                <img
                                  src={`${IMAGE_URL}${data.vehicle_image}`}
                                  alt="Vehicle"
                                  className="inline-flex items-center justify-center align-middle h-[70px] w-[60px]"
                                />
                                <img
                                  src={`${IMAGE_URL}${data.plate_image}`}
                                  alt="Plate"
                                  className="inline-flex items-center justify-center align-middle h-[70px] w-[60px]"
                                />
                              </td>
                              <td className={`pl-5 text-start text-white ${data.is_special_plate ? bgColor : "bg-tuna"}`}>{data.camera_info ? data.camera_info.cam_id : ""}</td>
                              <td className={`pl-5 text-start text-white ${data.is_special_plate ? bgColor : "bg-celtic"}`}>{data.vehicle_body_type_info ? i18n.language === "th" ? data.vehicle_body_type_info.body_type_th : data.vehicle_body_type_info.body_type_en : reformatString(data.vehicle_body_type)}</td>
                              <td className={`text-center text-white ${data.is_special_plate ? bgColor : "bg-tuna"}`}>{data.vehicle_model_info ? data.vehicle_model_info.model_en : reformatString(data.vehicle_body_type)}</td>
                              <td className={`text-center text-white ${data.is_special_plate ? bgColor : "bg-celtic"}`}>{data.vehicle_make_info ? data.vehicle_make_info.make_en : reformatString(data.vehicle_make)}</td>
                              <td className={`text-center text-white ${data.is_special_plate ? bgColor : "bg-tuna"}`}>{data.vehicle_color_info ? i18n.language === "th" ? data.vehicle_color_info.color_th : data.vehicle_color_info.color_en : reformatString(data.vehicle_color)}</td>
                              <td className={`text-center text-white ${data.is_special_plate ? bgColor : "bg-celtic"}`}>{data.epoch_start ? dayjs(data.epoch_start).format(i18n.language === "th" ? 'DD/MM/BBBB (HH:mm:ss)' : 'DD/MM/YYYY (HH:mm:ss)') : ""}</td>
                            </tr>
                          )
                        }) :
                        !isLoading && isSearch && (
                          <tr className="h-[50px] w-full border-b-[1px] border-dashed border-darkGray">
                            <td colSpan={8} className="text-center bg-tuna">{t('text.no-data')}</td>
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className={`${specialPlateSearchDataList.length > 0 ? "flex" : "hidden"} items-center justify-between bg-[var(--background-color)] py-3 px-1 sticky bottom-0`}>
              <PaginationComponent 
                page={page} 
                onChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={rowsPerPageOptions}
                handleRowsPerPageChange={handleRowsPerPageChange}
                totalPages={totalPages}
                pageInput={pageInput.toString()}
                handlePageInputKeyDown={handlePageInputKeyDown}
                handlePageInputChange={handlePageInputChange}
              />
            </div>
          </div>
        </div>
        <div
          id="search-filter"
          className="w-[320px] fixed right-0 top-0 pt-[80px] h-full"
        >
          <SearchFilter setFilterData={setFilterData} />
        </div>
        <Dialog open={isImageCardShow} onClose={() => setIsImageCardShow(false)} className="absolute z-30">
          <div 
            className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-25 backdrop-blur-sm "
            onClick={() => setIsImageCardShow(false)} 
          >
            <div 
              className="bg-black rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <ImagesCarousel 
                plate={carouselData ? carouselData.plate : ""}
                vehicleImage={carouselData ? carouselData.vehicleImage : ""}
                plateImage={carouselData ? carouselData.plateImage : ""}
              />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  )
}

export default SpecialRegistrationDetected
