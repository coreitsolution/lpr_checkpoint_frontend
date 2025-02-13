import React, { useState, useEffect, useCallback, useRef } from "react"
import { PopupMessage, PopupMessageWithCancel } from "../../utils/popupMessage"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../app/store"
import { FILE_URL } from '../../config/apiConfig'
import { SelectChangeEvent } from '@mui/material/Select'
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'

// Icon
import { Icon } from '../../components/icons/Icon'
import { Pencil, Trash2, Plus, Upload } from 'lucide-react'

// Types
import {
  SuspectPeopleRespondsDetail,
} from '../../features/suspect-people/SuspectPeopleDataTypes'
import { FilterSpecialPeople } from "../../features/api/types"
import { DeleteRequestData } from "../../features/file-upload/fileUploadTypes"

// API
import {
  deleteFilesDataThunk,
} from "../../features/file-upload/fileUploadSlice"
import { 
  fetchSpecialSuspectPeopleDataThunk,
  deleteSpecialSuspectPeopleDataThunk,
} from "../../features/suspect-people/SuspectPeopleDataSlice"

 // Context
import { useHamburger } from "../../context/HamburgerContext"

// Component
import Loading from "../../components/loading/Loading"
import SearchFilter from "./search-filter/SearchFilter"
import PaginationComponent from "../../components/pagination/Pagination"

// Modules
import ManageSpecialSuspectPerson from "./manage-special-suspect-person/ManageSpecialSuspectPerson"
import UploadFile from "./upload-file/UploadFile"

// Constant
import { SpecialRowPerPages } from "../../constants/dropdown"

dayjs.extend(buddhistEra)

function SpecialSuspectPerson() {
  const dispatch: AppDispatch = useDispatch()
  const { specialSuspectPeopleData } = useSelector(
    (state: RootState) => state.suspectPeopleData
  )

  const [isAddSuspectPersonOpen, setIsAddSuspectPersonOpen] = useState(false)
  const [isFileImportOpen, setIsFileImportOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSearch, setIsSearch] = useState(false)
  const [specialSuspectPeopleList, setSpecialSuspectPeopleList] = useState<SuspectPeopleRespondsDetail[]>([])
  const [selectedRow, setSelectedRow] = useState<SuspectPeopleRespondsDetail | null>(null)
  const { isOpen } = useHamburger()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageInput, setPageInput] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(SpecialRowPerPages[SpecialRowPerPages.length - 1])
  const [rowsPerPageOptions] = useState(SpecialRowPerPages)
  const tableDataRef = useRef<HTMLDivElement>(null)

  const { dataStatus, personTypes, personTitles } = useSelector(
    (state: RootState) => state.dropdown
  )

  useEffect(() => {
    if (tableDataRef.current) {
      tableDataRef.current.scrollTop = 0;
    }
  }, [specialSuspectPeopleList])

  const handleEditClick = (item: SuspectPeopleRespondsDetail) => {
    setSelectedRow(item)
    setIsAddSuspectPersonOpen(true)
    setIsEditMode(true)
  }

  const handleAddClick = () => {
    setIsEditMode(false)
    setIsAddSuspectPersonOpen(true)
  }

  const deleteFileUpload = async (deleteFile: DeleteRequestData) => {
    try {
      await dispatch(
        deleteFilesDataThunk(deleteFile)
      ).unwrap()
    }
    catch (error) {
      PopupMessage("ลบข้อมูลไม่สำเร็จ", "ไม่สามารถลบไฟล์ได้", "error")
    }
  }

  const handleDeleteClick = async (id: number) => {
    const confirmed = await PopupMessageWithCancel("ยันยันการลบ", "คุณต้องการดำเนินการต่อใช่หรือไม่?", "ยืนยัน", "ยกเลิก", "warning", "#b91c1c")
            
    if (confirmed) {
      try {

        const deleteData = specialSuspectPeopleList.find((data) => data.id === id)
        if (deleteData?.watchlist_images && deleteData?.watchlist_images.length > 0) {
          deleteData?.watchlist_images.map(async (row) => {
            const deleteFile: DeleteRequestData = {
              url: row.url
            }

            await deleteFileUpload(deleteFile)
          })
        }

        if (deleteData?.watchlist_files && deleteData?.watchlist_files.length > 0) {
          deleteData?.watchlist_files.map(async (row) => {
            const deleteFile: DeleteRequestData = {
              url: row.url
            }

            await deleteFileUpload(deleteFile)
          })
        }

        await dispatch(deleteSpecialSuspectPeopleDataThunk(id))
        PopupMessage("ลบข้อมูลสำเร็จ", "บันทึกข้อมูลสำเร็จ", 'success')
        await fetchSpecialSuspectPeopleData(page.toString(), rowsPerPage.toString())
      } 
      catch (error) {
        PopupMessage("ลบข้อมูลไม่สำเร็จ", "ข้อมูลไม่สามารถลบได้", "error")
      }
    }
  }

  const setFilterData = async (filterData: FilterSpecialPeople) => {
    setIsLoading(true)
    setIsSearch(true)
    const {
      selectedNamePrefix,
      firstname,
      lastname,
      selectedPersonType,
      agency,
      selectedStatus,
    } = filterData
  
    if (
      !selectedNamePrefix &&
      !firstname &&
      !lastname &&
      !selectedPersonType &&
      !agency &&
      (selectedStatus === undefined || selectedStatus === 2)
    ) {
      await fetchSpecialSuspectPeopleData('1', rowsPerPage.toString())
      return
    }

    let filter = []

    if (selectedNamePrefix) {
      filter.push(`title_id:${selectedNamePrefix}`)
    }
    if (selectedStatus !== undefined && selectedStatus !== 2) {
      filter.push(`active:${selectedStatus}`)
    }
    if (firstname) {
      filter.push(`firstname:${firstname}`)
    }
    if (selectedPersonType) {
      filter.push(`person_class_id:${selectedPersonType}`)
    }
    if (lastname) {
      filter.push(`lastname:${lastname}`)
    }
    if (agency) {
      filter.push(`case_owner_agency:${agency}`)
    }
    await fetchSpecialSuspectPeopleData('1', rowsPerPage.toString(), filter)
  }

  const fetchSpecialSuspectPeopleData = useCallback(async (page: string, limit: string, filter?:string[]) => {
    const allFilter = filter ? ["deleted:0", ...filter] : ["deleted:0"]
    const query: Record<string, string> = {
      "filter": allFilter.join(","),
      "page": page,
      "limit": limit,
    }
    setIsLoading(true)
    await dispatch(fetchSpecialSuspectPeopleDataThunk(query))
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [dispatch])

  useEffect(() => {
    setIsLoading(false)
  }, [specialSuspectPeopleList])

  useEffect(() => {
    fetchSpecialSuspectPeopleData('1', rowsPerPage.toString())
  }, [])

  useEffect(() => {
    if (!isAddSuspectPersonOpen) {
      fetchSpecialSuspectPeopleData('1', rowsPerPage.toString())
    }
  }, [isAddSuspectPersonOpen])

  useEffect(() => {
    if (!isFileImportOpen) {
      fetchSpecialSuspectPeopleData('1', rowsPerPage.toString())
    }
  }, [isFileImportOpen])

  useEffect(() => {
    if (specialSuspectPeopleData && specialSuspectPeopleData.data) {
      setSpecialSuspectPeopleList(specialSuspectPeopleData.data)
      setTotalPages(Math.ceil(specialSuspectPeopleData.data.length / rowsPerPage))
    }
    else {
      setSpecialSuspectPeopleList([])
    }
  }, [specialSuspectPeopleData])

  const handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault()
    setPage(value)
    await fetchSpecialSuspectPeopleData(value.toString(), rowsPerPage.toString())
  }

  const handleRowsPerPageChange = async (event: SelectChangeEvent) => {
    setRowsPerPage(parseInt(event.target.value))
    await fetchSpecialSuspectPeopleData(page.toString(), event.target.value)
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
    if (event.key === 'Enter') {
      event.preventDefault()
  
      setIsLoading(true)
      setPage(pageInput)
  
      await fetchSpecialSuspectPeopleData(pageInput.toString(), rowsPerPage.toString())
    }
  }

  return (
    <div className={`main-content pe-3 ${isOpen ? "pl-[130px]" : "pl-[10px]"} transition-all duration-500`}>
      {isLoading && <Loading />}
      <div id="extra-registration" className="grid grid-cols-[1fr_260px] gap-2">
        <div className="min-w-0">
          <div id="head" className="flex h-[50px] justify-between">
            <div className="flex flex-col">
              <p className="text-[20px] text-white">รายการบุคคลต้องสงสัย</p>
              <p className="text-[14px] text-white">{`จำนวน ${specialSuspectPeopleList.length} รายการ`}</p>
            </div>
            <div className="flex items-end space-x-2">
              <button 
                type="button" 
                className="flex justify-center items-center bg-white text-dodgerBlue w-[120px] h-[35px] rounded hover:bg-slate-200"
                onClick={() => setIsFileImportOpen(true)}
              >
                <Icon icon={Upload} size={20} color="dodgerBlue" />
                <span className="ml-[8px] text-[15px]">นำเข้าข้อมูล</span>
              </button>
              <button 
                type="button" 
                className="flex justify-center items-center bg-dodgerBlue text-white w-[170px] h-[35px] rounded hover:bg-sky-400"
                onClick={handleAddClick}
              >
                <Icon icon={Plus} size={20} color="#FFFFFF" />
                <span className="ml-[8px] text-[15px]">เพิ่มบุคคลต้องสงสัย</span>
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
                        <th className="text-center text-white">คำนำหน้า</th>
                        <th className="text-center text-white">ชื่อ-นามสกุล</th>
                        <th className="text-center text-white">รูป</th>
                        <th className="text-center text-white">กลุ่มบุคคล</th>
                        <th className="text-center text-white">วันที่เพิ่ม</th>
                        <th className="text-center text-white">วันที่แก้ไข</th>
                        <th className="text-center text-white">เจ้าของข้อมูล</th>
                        <th className="text-center text-white">หน่วยงาน</th>
                        <th className="text-center text-white">สถานะ</th>
                        <th className="w-[120px] text-center text-white"></th>
                      </tr>
                    </thead>
                    <tbody className="text-white">
                      {
                        specialSuspectPeopleList && specialSuspectPeopleList.length > 0 ? 
                        specialSuspectPeopleList.map((item) => (
                          <tr key={item.id} className="h-[80px] border-b-[1px] border-dashed border-darkGray">
                            <td className="pl-[10px] w-[100px] text-center bg-celtic">
                              {  
                                personTitles?.data?.find((row) => row.id === item.title_id)?.title_th
                              }
                            </td>
                            <td className="pl-[10px] w-[280px] text-start bg-tuna">
                              {  
                                item.firstname + " " + item.lastname
                              }
                            </td>
                            <td className="text-center bg-celtic w-[200px]">
                              {
                                Array.isArray(item.watchlist_images) && item.watchlist_images.length > 0 ? 
                                (
                                  <div>
                                    {
                                      item.watchlist_images.map((image, index) => (
                                        <img key={index} src={`${FILE_URL}${image.url}`} alt={`image-${index}`} className="inline-flex items-center justify-center align-middle h-[70px] w-[60px]" />
                                      ))
                                    }
                                  </div>
                                ) : 
                                (
                                  <p>--</p>
                                )
                              }
                            </td>
                            <td className="text-start bg-tuna">
                              {
                                <p className="pl-[10px]">{personTypes?.data?.find((row) => row.id === item.person_class_id)?.title_en}</p>
                              }
                            </td>
                            <td className="text-center bg-celtic">{ dayjs(item.createdAt).format('DD/MM/BBBB') }</td>
                            <td className="text-center bg-tuna">{ dayjs(item.updatedAt).format('DD/MM/BBBB') }</td>
                            <td className="text-center w-[200px] bg-celtic">
                              {
                                item.case_owner_agency === "" ? "ไม่ระบุตัวตน" : item.case_owner_agency
                              }
                            </td>
                            <td className="text-center bg-tuna">
                              {
                                item.case_owner_agency
                              }
                            </td>
                            <td className="bg-celtic align-middle text-center">
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
                            <td className="text-center bg-tuna">
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
                            <td colSpan={10} className="text-center bg-tuna">ไม่มีข้อมูล</td>
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className={`${specialSuspectPeopleList.length > 0 ? "flex" : "hidden"} items-center justify-between bg-[var(--background-color)] py-3 px-1 sticky bottom-0`}>
            <PaginationComponent 
              page={page} 
              onChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={rowsPerPageOptions}
              handleRowsPerPageChange={handleRowsPerPageChange}
              totalPages={totalPages}
              textFieldFontSize="15px"
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
        <Dialog open={isAddSuspectPersonOpen} onClose={() => {}} className="absolute z-30">
          <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm ">
            <div className="space-y-4 border bg-[var(--background-color)] max-w-[80%] text-white w-[80vw]">
              <div className="flex justify-between">
                <DialogTitle className="text-[28px]">จัดการบุคคลต้องสงสัย</DialogTitle>
              </div>
              <div className="px-5 pb-5">
                <ManageSpecialSuspectPerson 
                  closeDialog={() => setIsAddSuspectPersonOpen(false)} 
                  selectedRow={selectedRow}
                  isEditMode={isEditMode}
                />
              </div>
            </div>
          </div>
        </Dialog>
        {/* Import File */}
        <Dialog open={isFileImportOpen} onClose={() => {}} className="absolute z-30">
          <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm ">
            <div className="space-y-4 border bg-[var(--background-color)] max-w-[80%] bg-black text-white w-[80vw] h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                <DialogTitle className="text-[28px]">นำเข้าข้อมูล</DialogTitle>
                <button
                  onClick={() => setIsFileImportOpen(false)} 
                  className="text-white bg-transparent border-0 text-[28px] pr-6"
                >
                  &times;
                </button>
              </div>
              <div className="px-5 pb-5">
                <UploadFile closeDialog={() => setIsFileImportOpen(false)} />
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  )
}

export default SpecialSuspectPerson