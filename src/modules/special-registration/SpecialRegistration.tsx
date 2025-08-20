import React, { useState, useEffect, useRef } from "react"
import { PopupMessage, PopupMessageWithCancel } from "../../utils/popupMessage"
import ManageExtraRegistration from "./manage-extra-registration/ManageExtraRegistration"
import { useSelector } from "react-redux"
import { RootState } from "../../app/store"
import { getUrls } from '../../config/runtimeConfig';
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import {
  SelectChangeEvent,
} from "@mui/material"

// Icon
import { Icon } from '../../components/icons/Icon'
import { Pencil, Trash2, Plus, Upload } from 'lucide-react'

// Types
import {
  SpecialPlatesRespondsDetail,
  SpecialPlatesData,
} from '../../features/registration-data/RegistrationDataTypes'
import { FilterSpecialRegistration } from "../../features/api/types"
import { DeleteRequestData, FileDelete } from "../../features/file-upload/fileUploadTypes"

 // Context
import { useHamburger } from "../../context/HamburgerContext"

// Component
import Loading from "../../components/loading/Loading"
import SearchFilter from "./search-filter/SearchFilter"
import PaginationComponent from "../../components/pagination/Pagination"

// Constant
import { SpecialRowPerPages } from "../../constants/dropdown"

// Modules
import UploadFile from "./upload-file/UploadFile"

// Utils
import { formatNumber } from "../../utils/commonFunction"
import { fetchClient, combineURL } from "../../utils/fetchClient"

// i18n
import { useTranslation } from "react-i18next";

dayjs.extend(buddhistEra)

function SpecialRegistration() {
  // i18n
  const { t, i18n } = useTranslation();

  const [isAddRegistrationOpen, setIsAddRegistrationOpen] = useState(false)
  const [isFileImportOpen, setIsFileImportOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [specialRegistrationsList, setSpecialRegistrationsList] = useState<SpecialPlatesRespondsDetail[]>([])
  const [selectedRow, setSelectedRow] = useState<SpecialPlatesRespondsDetail | null>(null)
  const { isOpen } = useHamburger()
  const [isLoading, setIsLoading] = useState(false)
  const [isSearch, setIsSearch] = useState(false)
  const [page, setPage] = useState(1)
  const [pageInput, setPageInput] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalData, setTotalData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(SpecialRowPerPages[SpecialRowPerPages.length - 1])
  const [rowsPerPageOptions] = useState(SpecialRowPerPages)
  const [isFileImportClose, setIsFileImportClose] = useState(false)
  const tableDataRef = useRef<HTMLDivElement>(null)
  const { IMAGE_URL, API_URL } = getUrls();

  const { provinces, dataStatus, registrationTypes } = useSelector(
    (state: RootState) => state.dropdown
  )

  useEffect(() => {
    if (tableDataRef.current) {
      tableDataRef.current.scrollTop = 0;
    }
  }, [specialRegistrationsList])

  const handleEditClick = (item: SpecialPlatesRespondsDetail) => {
    setSelectedRow(item)
    setIsAddRegistrationOpen(true)
    setIsEditMode(true)
  }

  const handleAddClick = () => {
    setIsEditMode(false)
    setIsAddRegistrationOpen(true)
  }

  const deleteFileUpload = async (deleteFile: DeleteRequestData) => {
    try {
      await fetchClient<FileDelete>(combineURL(API_URL, "/upload/remove"), {
        method: "POST",
        headers: { 
          Accept: 'application/json',
        },
        body: JSON.stringify(deleteFile),
      })
    }
    catch (error) {
      PopupMessage(t('message.error.delete-data-failed'), t('message.error.can-not-delete-data'), "error")
    }
  }

  const handleDeleteClick = async (id: number) => {
    const confirmed = await PopupMessageWithCancel(t('message.warning.delete-confirmation'), t('message.warning.do-you-want-to-continue'), t('button.confirm'), t('button.cancel'), "warning", "#b91c1c")
            
    if (confirmed) {
      try {

        const deleteData = specialRegistrationsList.find((data) => data.id === id)
        if (deleteData?.special_plate_images && deleteData?.special_plate_images.length > 0) {
          deleteData?.special_plate_images.map(async (row) => {
            const deleteFile: DeleteRequestData = {
              url: row.url
            }

            await deleteFileUpload(deleteFile)
          })
        }

        if (deleteData?.special_plate_files && deleteData?.special_plate_files.length > 0) {
          deleteData?.special_plate_files.map(async (row) => {
            const deleteFile: DeleteRequestData = {
              url: row.url
            }

            await deleteFileUpload(deleteFile)
          })
        }

        await fetchClient<void>(
          combineURL(API_URL, `/special-plates/delete`),
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id })
          }
        )
        PopupMessage(t('message.success.delete-data-success'), t('message.success.data-saved-successfully'), 'success')
        await fetchSpecialPlateData(page.toString(), rowsPerPage.toString())
      } 
      catch (error) {
        PopupMessage(t('message.error.delete-data-failed'), t('message.error.data-cannot-delete'), "error")
      }
    }
  }

  const setFilterData = async (filterData: FilterSpecialRegistration) => {
    setIsLoading(true)
    setIsSearch(true)
    const {
      letterCategory,
      carRegistration,
      selectedProvince,
      selectedRegistrationType,
      agency,
      selectedStatus,
    } = filterData
  
    if (
      !letterCategory &&
      !carRegistration &&
      !selectedProvince &&
      !selectedRegistrationType &&
      !agency &&
      (selectedStatus === undefined || selectedStatus === 2)
    ) {
      await fetchSpecialPlateData('1', rowsPerPage.toString())
      return
    }
  
    let filter = []

    if (selectedProvince) {
      filter.push(`province_id:${selectedProvince}`)
    }
    if (selectedStatus !== undefined && selectedStatus !== 2) {
      filter.push(`active:${selectedStatus}`)
    }
    if (agency) {
      filter.push(`case_owner_agency:${agency}`)
    }
    if (selectedRegistrationType) {
      filter.push(`plate_class_id:${selectedRegistrationType}`)
    }
    if (letterCategory) {
      filter.push(`plate_group:${letterCategory}`)
    }
    if (carRegistration) {
      filter.push(`plate_number:${carRegistration}`)
    }
    await fetchSpecialPlateData('1', rowsPerPage.toString(), filter)
  }

  const fetchSpecialPlateData = async (page: string, limit: string, filter?:string[]) => {
    const allFilter = filter ? ["deleted:0", ...filter] : ["deleted:0"]
    const query: Record<string, string> = {
      "filter": allFilter.join(","),
      "page": page,
      "limit": limit,
    }
    setIsLoading(true)
    try {
      const response = await fetchClient<SpecialPlatesData>(combineURL(API_URL, "/special-plates/get"), {
        method: "GET",
        queryParams: query,
      });

      if (response.data) {
        setSpecialRegistrationsList(response.data)
        if (response.countAll) {
          setTotalPages(Math.ceil(response.countAll / rowsPerPage))
          setTotalData(response.countAll)
        }
      }
    }
    catch (error) {
      setSpecialRegistrationsList([]);
      setTotalPages(1);
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  useEffect(() => {
    setIsLoading(false)
  }, [specialRegistrationsList])

  useEffect(() => {
    fetchSpecialPlateData('1', rowsPerPage.toString())
  }, [])

  useEffect(() => {
    if (!isAddRegistrationOpen) {
      fetchSpecialPlateData('1', rowsPerPage.toString())
    }
  }, [isAddRegistrationOpen])

  useEffect(() => {
    if (!isFileImportOpen) {
      fetchSpecialPlateData('1', rowsPerPage.toString())
    }
  }, [isFileImportOpen])

  const handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault()
    setPage(value)
    await fetchSpecialPlateData(value.toString(), rowsPerPage.toString())
  }

  const handleRowsPerPageChange = async (event: SelectChangeEvent) => {
    setRowsPerPage(parseInt(event.target.value))
    await fetchSpecialPlateData(page.toString(), event.target.value)
  }

  const handlePageInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    const cleaned = input.replace(/\D/g, '')

    if (cleaned) {
      const numberInput = Number(cleaned);
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
    if (event.key === 'Enter') {
      event.preventDefault()
  
      setIsLoading(true)
      setPage(pageInput)
  
      await fetchSpecialPlateData(pageInput.toString(), rowsPerPage.toString())
    }
  }

  const handleFileImportOpen = () => {
    setIsFileImportOpen(true)
    setIsFileImportClose(false)
  }

  return (
    <div className={`main-content pe-3 ${isOpen ? "pl-[130px]" : "pl-[10px]"} transition-all duration-500`}>
      {isLoading && <Loading />}
      <div id="extra-registration" className="grid grid-cols-[1fr_270px]">
        <div className="min-w-0">
          <div id="head" className="flex h-[50px] justify-between">
            <div className="flex flex-col">
              <p className="text-[20px] text-white">{t('screen.special-plate')}</p>
              <p className="text-[14px] text-white">{`${t('text.amount')} ${formatNumber(totalData ?? 0)} ${t('text.item')}`}</p>
            </div>
            <div className="flex items-end space-x-2">
              <button 
                type="button" 
                className="flex justify-center items-center bg-white text-dodgerBlue w-[120px] h-[35px] rounded hover:bg-slate-200"
                onClick={handleFileImportOpen}
              >
                <Icon icon={Upload} size={20} color="dodgerBlue" />
                <span className="ml-[8px] text-[15px]">{t('button.import-data')}</span>
              </button>
              <button 
                type="button" 
                className="flex justify-center items-center bg-dodgerBlue text-white w-[150px] h-[35px] rounded hover:bg-sky-400"
                onClick={handleAddClick}
              >
                <Icon icon={Plus} size={20} color="#FFFFFF" />
                <span className="ml-[8px] text-[15px]">{t('button.add-special-plate')}</span>
              </button>
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
                      <tr className="h-[50px] bg-swamp border-none">
                        <th className="text-center text-white">{t('table.column.plate')}</th>
                        <th className="text-center text-white">{t('table.column.image')}</th>
                        <th className="text-center text-white">{t('table.column.plate-type')}</th>
                        <th className="text-center text-white">{t('table.column.added-date')}</th>
                        <th className="text-center text-white">{t('table.column.edited-date')}</th>
                        <th className="text-center text-white">{t('table.column.owner-data')}</th>
                        <th className="text-center text-white">{t('table.column.owner-agency')}</th>
                        <th className="text-center text-white">{t('table.column.status')}</th>
                        <th className="w-[120px] text-center text-white"></th>
                      </tr>
                    </thead>
                    <tbody className="text-white">
                      {
                        specialRegistrationsList && specialRegistrationsList.length > 0 ? 
                        specialRegistrationsList.map((item) => (
                          <tr key={item.id} className="h-[80px] border-b-[1px] border-dashed border-darkGray">
                            <td className="pl-[10px] w-[280px] text-start bg-celtic">
                              {  
                                item.plate_group + " " + item.plate_number + " " + provinces?.data?.find((row) => row.id === item.province_id)?.name_th
                              }
                            </td>
                            <td className="text-center bg-tuna w-[200px]">
                              {
                                Array.isArray(item.special_plate_images) && item.special_plate_images.length > 0 ? 
                                (
                                  <div>
                                    {
                                      item.special_plate_images.map((image, index) => (
                                        <img key={index} src={`${IMAGE_URL}${image.url}`} alt={`image-${index}`} className="inline-flex items-center justify-center align-middle h-[70px] w-[60px]" />
                                      ))
                                    }
                                  </div>
                                ) : 
                                (
                                  <p>--</p>
                                )
                              }
                            </td>
                            <td className="text-start bg-celtic">
                              {
                                <p className="pl-[10px]">{registrationTypes?.data?.find((row) => row.id === item.plate_class_id)?.title_en}</p>
                              }
                            </td>
                            <td className="text-center bg-tuna">{ dayjs(item.createdAt).format(i18n.language === "th" ? 'DD/MM/BBBB' : 'DD/MM/YYY') }</td>
                            <td className="text-center bg-celtic">{ dayjs(item.updatedAt).format(i18n.language === "th" ? 'DD/MM/BBBB' : 'DD/MM/YYY') }</td>
                            <td className="text-center bg-tuna">
                              {
                                item.case_owner_name === "" ? t('text.owner-unknown') : item.case_owner_name
                              }
                            </td>
                            <td className="text-center bg-celtic">
                              {
                                item.case_owner_agency
                              }
                            </td>
                            <td className="bg-tuna align-middle text-center">
                              <label 
                                className={`w-[80px] h-[30px] inline-flex items-center justify-center align-middle rounded
                                  ${
                                    dataStatus.find((row) => row.id === item.active)?.id === 1
                                      ? "bg-fruitSalad" 
                                      : "bg-nobel"
                                  }`}
                              >
                                {
                                  dataStatus.find((row) => row.id === item.active)?.status
                                }
                              </label>
                            </td>
                            <td className="text-center bg-celtic">
                              <button className="mr-[10px]" onClick={() => handleEditClick(item)}>
                                <Icon icon={Pencil} size={20} color="#FFFFFF" />
                              </button>
                              <button onClick={() => handleDeleteClick(item.id)}>
                                <Icon icon={Trash2} size={20} color="#FFFFFF" />
                              </button>
                            </td>
                          </tr>
                        )) :
                        !isLoading && isSearch && (
                          <tr className="h-[50px] w-full border-b-[1px] border-dashed border-darkGray">
                            <td colSpan={9} className="text-center bg-tuna">{t('text.no-data')}</td>
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className={`${specialRegistrationsList.length > 0 ? "flex" : "hidden"} items-center justify-between bg-[var(--background-color)] py-3 px-1 sticky bottom-0`}>
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
        <div id="search-filter" className="w-[270px] fixed right-0 top-0 z-20 pt-[80px] h-full">
          <SearchFilter 
            setFilterData={setFilterData}
          />
        </div>
        <ManageExtraRegistration 
          open={isAddRegistrationOpen}
          closeDialog={() => setIsAddRegistrationOpen(false)} 
          selectedRow={selectedRow}
          isEditMode={isEditMode}
        />
        {/* Import File */}
        <UploadFile 
          open={isFileImportOpen} 
          closeDialog={() => setIsFileImportOpen(false)} 
          isFileImportClose={isFileImportClose}
        />
      </div>
    </div>
  )
}

export default SpecialRegistration