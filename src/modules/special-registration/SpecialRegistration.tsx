import React, { useState, useEffect, useCallback, useRef } from "react"
import { PopupMessage, PopupMessageWithCancel } from "../../utils/popupMessage"
import ManageExtraRegistration from "./manage-extra-registration/ManageExtraRegistration"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../app/store"
import { FILE_URL } from '../../config/apiConfig'
import * as XLSX from "xlsx"
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import {
  SelectChangeEvent,
  Dialog,
  DialogTitle
} from "@mui/material"

// Icon
import { Icon } from '../../components/icons/Icon'
import { Pencil, Trash2, Plus, Upload } from 'lucide-react'

// Types
import {
  SpecialPlatesRespondsDetail,
  ImportSpecialPlatesDetail,
  FileData,
  NewSpecialPlates,
} from '../../features/registration-data/RegistrationDataTypes'
import { FilterSpecialRegistration } from "../../features/api/types"
import { DeleteRequestData } from "../../features/file-upload/fileUploadTypes"

// API
import {
  postFilesDataThunk,
  deleteFilesDataThunk,
} from "../../features/file-upload/fileUploadSlice"
import { 
  fetchSpecialPlateDataThunk,
  deleteSpecialPlateDataThunk,
  postSpecialRegistrationDataThunk
} from "../../features/registration-data/RegistrationDataSlice"

 // Context
import { useHamburger } from "../../context/HamburgerContext"

// Component
import Loading from "../../components/loading/Loading"
import SearchFilter from "./search-filter/SearchFilter"
import PaginationComponent from "../../components/pagination/Pagination"

// Constant
import { SpecialRowPerPages } from "../../constants/dropdown"

dayjs.extend(buddhistEra)

function SpecialRegistration() {
  const dispatch: AppDispatch = useDispatch()
  const { specialPlatesData } = useSelector(
    (state: RootState) => state.registrationData
  )

  const [isAddRegistationOpen, setIsAddRegistationOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [specialRegistrationsList, setSpecialRegistrationsList] = useState<SpecialPlatesRespondsDetail[]>([])
  const [selectedRow, setSelectedRow] = useState<SpecialPlatesRespondsDetail | null>(null)
  const { isOpen } = useHamburger()
  const [isLoading, setIsLoading] = useState(false)
  const [isSearch, setIsSearch] = useState(false)
  const [fileImportError, setFileImportError] = useState<string>("")
  const hiddenFileInput = useRef<HTMLInputElement | null>(null)
  const [page, setPage] = useState(1)
  const [pageInput, setPageInput] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(SpecialRowPerPages[SpecialRowPerPages.length - 1])
  const [rowsPerPageOptions] = useState(SpecialRowPerPages)

  const { provinces, dataStatus, registrationTypes } = useSelector(
    (state: RootState) => state.dropdown
  )

  const handleEditClick = (item: SpecialPlatesRespondsDetail) => {
    setSelectedRow(item)
    setIsAddRegistationOpen(true)
    setIsEditMode(true)
  }

  const handleAddClick = () => {
    setIsEditMode(false)
    setIsAddRegistationOpen(true)
  }

  const deleteFileUpload = async (deleteFile: DeleteRequestData) => {
    try {
      await dispatch(
        deleteFilesDataThunk(deleteFile)
      ).unwrap()
    }
    catch (error) {
      
    }
  }

  const handleDeleteClick = async (id: number) => {
    const confirmed = await PopupMessageWithCancel("ยันยันการลบ", "คุณต้องการดำเนินการต่อใช่หรือไม่?", "ยืนยัน", "ยกเลิก", "warning", "#b91c1c")
            
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

        await dispatch(deleteSpecialPlateDataThunk(id))
        PopupMessage("ลบข้อมูลสำเร็จ", "บันทึกข้อมูลสำเร็จ", 'success')
        await fetchSpecialPlateData(page.toString(), rowsPerPage.toString())
      } 
      catch (error) {
        PopupMessage("ลบข้อมูลไม่สำเร็จ", "ข้อมูลไม่สามารถลบได้", "error")
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

  const fetchSpecialPlateData = useCallback(async (page: string, limit: string, filter?:string[]) => {
    const allFilter = filter ? ["deleted:0", ...filter] : ["deleted:0"]
    const query: Record<string, string> = {
      "filter": allFilter.join(","),
      "page": page,
      "limit": limit,
    }
    setIsLoading(true)
    await dispatch(fetchSpecialPlateDataThunk(query))
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [dispatch])

  useEffect(() => {
    setIsLoading(false)
  }, [specialRegistrationsList])

  useEffect(() => {
    fetchSpecialPlateData('1', rowsPerPage.toString())

    if (!isAddRegistationOpen) {
      fetchSpecialPlateData('1', rowsPerPage.toString())
    }
  }, [dispatch, isAddRegistationOpen])

  useEffect(() => {
    if (specialPlatesData && specialPlatesData.data) {
      setSpecialRegistrationsList(specialPlatesData.data)
      if (specialPlatesData.countAll) {
        setTotalPages(Math.ceil(specialPlatesData.countAll / rowsPerPage))
      }
    }
    else {
      setSpecialRegistrationsList([])
    }
    setIsLoading(false)
  }, [specialPlatesData])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: ImportSpecialPlatesDetail[] = XLSX.utils.sheet_to_json(sheet);

      const validatedData = jsonData.map((row) => {
        if (
          !row.plate_group ||
          !row.plate_number ||
          !row.province_id ||
          !row.plate_class_id ||
          !row.arrest_warrant_date ||
          !row.arrest_warrant_expire_date ||
          !row.case_owner_name ||
          !row.case_owner_agency ||
          !row.case_owner_phone
        ) {
          setFileImportError(
            "plate_group, plate_number, province_id, plate_class_id, arrest_warrant_date, arrest_warrant_expire_date, case_owner_name, case_owner_agency และ case_owner_phone เป็นช่องที่จำเป็นและไม่สามารถเว้นว่างไว้ได้"
          );
          return null;
        }
  
        return {
          plate_group: row.plate_group,
          plate_number: row.plate_number,
          province_id: provinces?.data?.find((province) => province.name_th === row.province_id.toString())?.id,
          plate_class_id: registrationTypes?.data?.find((type) => type.title_en.toLocaleLowerCase() === row.plate_class_id.toString().toLocaleLowerCase())?.id,
          case_number: row.case_number || "-",
          arrest_warrant_date: row.arrest_warrant_date,
          arrest_warrant_expire_date: row.arrest_warrant_expire_date,
          behavior: row.behavior || "-",
          case_owner_name: row.case_owner_name,
          case_owner_agency: row.case_owner_agency,
          case_owner_phone: row.case_owner_phone,
          imagesData: row.imagesData || "",
          filesData: row.filesData || "",
          active: dataStatus.find((status) => status.status.toLocaleLowerCase() === row.active.toString().toLocaleLowerCase())?.id,
          visible: 1
        };
      }).filter(Boolean);
  
      if (validatedData && validatedData.length > 0) {
        await addNewSpecialRegistration(validatedData as ImportSpecialPlatesDetail[]);
      }
      else {
        PopupMessage("โหลดข้อมูลไม่สำเร็จ", fileImportError, "error");
      }
    };
    reader.readAsArrayBuffer(file);

    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = ""
    }
  };
  
  const uploadFile = useCallback(async (file: File): Promise<FileData[] | null> => {
    try {
      const formData = new FormData();
      formData.append("files", file);
  
      const response = await dispatch(postFilesDataThunk(formData)).unwrap();
  
      if (response?.data) {
        return response.data.map((file: any) => ({
          title: file.title,
          url: file.url,
        }));
      }
      return null;
    } 
    catch (error) {
      return null;
    }
  }, [dispatch]);
  
  const parseExcelDate = (dateValue: any): string => {
    if (typeof dateValue === "number") {
      const date = new Date((dateValue - 25569) * 86400 * 1000);
      return date.toISOString().split("T")[0]; // Return as 'YYYY-MM-DD'
    }
    if (typeof dateValue === "string") {
      const [day, month, year] = dateValue.split("/");
      return `${year}-${month}-${day}`;
    }
    throw new Error("Invalid date format");
  }

  const uploadFileFailed = (text: string) => {
    PopupMessage("", text, "error");
  }

  const getFileInfo = async (filePath: string): Promise<File> => {
    const filename = filePath.split(/[/\\\\]/).pop() || filePath; // Extract the file name
    const ext = filename.includes('.') ? `.${filename.split('.').pop()}` : ''; // Extract the extension

    // Map common extensions to MIME types
    const mimeTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    try {
      // Determine MIME type based on extension
      const mimeType = mimeTypes[ext.toLowerCase()] || 'application/octet-stream';

      // Create a new File object
      const file = new File([filePath], filename, { type: mimeType });

      return file;
    } 
    catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  }
  
  const addNewSpecialRegistration = async (validatedData: ImportSpecialPlatesDetail[]) => {
    
    for (const row of validatedData) {
      try {
        let images
        let files
        if (row.imagesData) {
          const fileInfo = await getFileInfo(row.imagesData);
          const result = await uploadFile(fileInfo);
          if (!result) {
            uploadFileFailed("ไม่สามารถอัปโหลดรูปได้");
            return;
          }
          images = result;
        }

        if (row.filesData) {
          const file = new File([row.filesData], row.filesData);
          const result = await uploadFile(file);
          if (!result) {
            uploadFileFailed("ไม่สามารถอัปโหลดไฟล์ได้");
            return;
          }
          files = result;
        }
  
        const updatedFormData: NewSpecialPlates = {
          arrest_warrant_date: parseExcelDate(row.arrest_warrant_date),
          arrest_warrant_expire_date: parseExcelDate(row.arrest_warrant_expire_date),
          plate_group: row.plate_group,
          plate_number: row.plate_number,
          province_id: row.province_id,
          imagesData: images ? images : [],
          case_number: row.case_number,
          behavior: row.behavior,
          active: row.active,
          case_owner_phone: row.case_owner_phone,
          case_owner_name: row.case_owner_name,
          plate_class_id: row.plate_class_id,
          case_owner_agency: row.case_owner_agency,
          filesData: files ? files : [],
          visible: 1,
        };
  
        await dispatch(postSpecialRegistrationDataThunk(updatedFormData)).unwrap();
        PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success");
        await fetchSpecialPlateData(page.toString(), rowsPerPage.toString())
      } 
      catch (error) {
        PopupMessage("", "เกิดข้อผิดพลาดในการบันทึกข้อมูล", "error");
      }
    }
  };

  const handleClickImport = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click()
    }
  };

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

  return (
    <div className={`main-content pe-3 ${isOpen ? "pl-[130px]" : "pl-[10px]"} transition-all duration-500`}>
      {isLoading && <Loading />}
      <div id="extra-registration" className="grid grid-cols-[1fr_270px]">
        <div className="min-w-0">
          <div id="head" className="flex h-[50px] justify-between">
            <div className="flex flex-col">
              <p className="text-[20px] text-white">รายการทะเบียนพิเศษ</p>
              <p className="text-[14px] text-white">{`จำนวน ${specialRegistrationsList.length} รายการ`}</p>
            </div>
            <div className="flex items-end space-x-2">
              <button 
                type="button" 
                className="flex justify-center items-center bg-white text-dodgerBlue w-[120px] h-[35px] rounded hover:bg-slate-200"
                onClick={handleClickImport}
              >
                <Icon icon={Upload} size={20} color="dodgerBlue" />
                <span className="ml-[8px] text-[15px]">นำเข้าข้อมูล</span>
              </button>
              <button 
                type="button" 
                className="flex justify-center items-center bg-dodgerBlue text-white w-[150px] h-[35px] rounded hover:bg-sky-400"
                onClick={handleAddClick}
              >
                <Icon icon={Plus} size={20} color="#FFFFFF" />
                <span className="ml-[8px] text-[15px]">เพิ่มทะเบียนพิเศษ</span>
              </button>
              <input
                ref={hiddenFileInput}
                name="files"
                type="file"
                id="file-input"
                className="hidden"
                onChange={handleFileUpload}
                accept=".xlsx,.xls"
              />
            </div>
          </div>
          <div id="body" className="mt-[5px] flex flex-col">
            <div className="flex-1 overflow-x-auto">
              <div id="table-data" className="mt-[10px] overflow-y-auto h-[78vh]">
                <div className="">
                  <table className="w-full text-[15px]">
                    <thead className="sticky top-0 z-10 bg-swamp backdrop-blur-md bg-opacity-80">
                      <tr className="h-[50px] bg-swamp border-none">
                        <th className="text-center text-white">ทะเบียน</th>
                        <th className="text-center text-white">รูป</th>
                        <th className="text-center text-white">กลุ่มทะเบียน</th>
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
                            <td className="text-start bg-celtic">
                              {
                                <p className="pl-[10px]">{registrationTypes?.data?.find((row) => row.id === item.plate_class_id)?.title_en}</p>
                              }
                            </td>
                            <td className="text-center bg-tuna">{ dayjs(item.createdAt).format('DD/MM/BBBB') }</td>
                            <td className="text-center bg-celtic">{ dayjs(item.updatedAt).format('DD/MM/BBBB') }</td>
                            <td className="text-center bg-tuna">
                              {
                                item.case_owner_name === "" ? "ไม่ระบุตัวตน" : item.case_owner_name
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
                            <td colSpan={9} className="text-center bg-tuna">ไม่มีข้อมูล</td>
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
        <Dialog open={isAddRegistationOpen} onClose={() => {}} className="absolute z-30">
          <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm ">
            <div className="space-y-4 border bg-[var(--background-color)] max-w-[80%] bg-black text-white w-[80vw]">
              <DialogTitle className="text-[28px]">จัดการทะเบียนพิเศษ</DialogTitle>
              <div className="px-5 pb-5">
                <ManageExtraRegistration 
                  closeDialog={() => setIsAddRegistationOpen(false)} 
                  selectedRow={selectedRow}
                  isEditMode={isEditMode}
                />
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  )
}

export default SpecialRegistration