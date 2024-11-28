import React, { useState, useRef, useEffect } from "react"
import PopupMessage from "../../utils/popupMessage"
import { Calendar as CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { Input } from "../ui/input"
import { Checkbox } from "../ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { cn } from "../../lib/utils"
import { ReactComponent as DownloadIcon } from "../../assets/svg/download-icon.svg"
import { ReactComponent as ImportIcon } from "../../assets/svg/import-icon.svg"
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete-icon.svg"
import { useAppDispatch, useAppSelector } from '../../redux/hooks'

import {
  FilesData,
  ExtraRegistrationData
} from '../../types'

import {
  fetchAgencies,
  fetchProvinces,
  fetchRegistrationTypes,
} from '../../redux/slices/searchFilterSlice'

import axios  from 'axios'

interface ManageExtraRegistrationProps {
  closeDialog: () => void
  selectedRow: ExtraRegistrationData | null
  isEditMode: boolean
}

const ManageExtraRegistration: React.FC<ManageExtraRegistrationProps> = ({ closeDialog, selectedRow, isEditMode }) => {
  const hiddenFileInput = useRef<HTMLInputElement | null>(null)
  const filePathInput = useRef<HTMLInputElement | null>(null)
  const [originalData, setOriginalData] = useState<ExtraRegistrationData | null>(null)
  const [filesImportList, setFilesImportList] = useState<FilesData[]>([])
  const [filesImportListOri, setFilesImportListOri] = useState<FilesData[]>([])
  const [filesDeleteList, setFilesDeleteList] = useState<FilesData[]>([])
  const apiUrl = process.env.REACT_APP_API_URL

  const dispatch = useAppDispatch()
  const { agencies, provinces, registrationTypes } = useAppSelector(
    (state) => state.searchFilter
  )

  useEffect(() => {
    dispatch(fetchAgencies())
    dispatch(fetchProvinces())
    dispatch(fetchRegistrationTypes())
  }, [dispatch])

  const [formData, setFormData] = useState({
    letterCategory: "",
    carRegistration: "",
    provinceId: 0,
    images: [] as string[],
    caseId: "",
    startArrestDate: undefined as Date | undefined,
    endArrestDate: undefined as Date | undefined,
    behavior1: "",
    behavior2: "",
    dataOwner: "",
    phone: "",
    registrationTypeId: 0,
    agencyId: 0,
    statusId: 2,
  })

  useEffect(() => {
    if (isEditMode && selectedRow) {
      setFormData({
        letterCategory: selectedRow.letter_category,
        carRegistration: selectedRow.car_registration,
        provinceId: selectedRow.province_id,
        images: selectedRow.images,
        caseId: selectedRow.case_id,
        startArrestDate: selectedRow.start_arrest_date,
        endArrestDate: selectedRow.end_arrest_date,
        behavior1: selectedRow.behavior1,
        behavior2: selectedRow.behavior2,
        dataOwner: selectedRow.data_owner,
        phone: selectedRow.phone,
        registrationTypeId: selectedRow.registration_type_id,
        agencyId: selectedRow.agency_id,
        statusId: selectedRow.status_id,
      })
      setOriginalData(selectedRow)

      const fetchFilesData = async () => {
        try {
          const response = await fetch(`${apiUrl}/files?extraRegistrationId=${selectedRow.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
          const result = await response.json()
          const newFilesImportList = result.map((fileData: FilesData) => ({
            ...fileData
          }))
        
          setFilesImportList(newFilesImportList)
          setFilesImportListOri(newFilesImportList)
        } 
        catch (err) {
          PopupMessage("ดึงข้อมูลไม่สำเร็จ", "ไม่สามารถดึงข้อมูลไฟล์ได้", "error")
        }
      }

      fetchFilesData()
    } else {
      setFormData({
        letterCategory: "",
        carRegistration: "",
        provinceId: 0,
        images: [],
        caseId: "",
        startArrestDate: undefined,
        endArrestDate: undefined,
        behavior1: "",
        behavior2: "",
        dataOwner: "",
        phone: "",
        registrationTypeId: 0,
        agencyId: 0,
        statusId: 2,
      })
    }
  }, [selectedRow, isEditMode, apiUrl])

  const compareAndSetDifference = () => {
    const missingFiles = filesImportListOri.filter((file) => {
      return !filesImportList.some(
        (currentFile) => currentFile.id === file.id
      )
    })
  
    if (missingFiles.length > 0) {
      setFilesDeleteList(missingFiles)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, 3 - formData.images.length) // Only allow up to 3 images
      const imageUrls = newImages.map((file) => URL.createObjectURL(file))
    
      setFormData((prevState) => ({
        ...prevState,
        images: [...prevState.images, ...imageUrls],
      }))
    }
  }

  const handleDeleteImage = (index: number) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: prevFormData.images.filter((_, i) => i !== index),
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      statusId: checked ? 1 : 2,
    })
  }

  const updatedFormData = {
    ...formData,
    startArrestDate: formData.startArrestDate ? format(formData.startArrestDate, "yyyy-MM-dd") : null,
    endArrestDate: formData.endArrestDate ? format(formData.endArrestDate, "yyyy-MM-dd") : null,
  }

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData)
  }

  const saveFileList = async (extra_registration_id: number, newFileAdd: FilesData[]): Promise<boolean> => {
    if (newFileAdd.length > 0) {
      const newFileList = newFileAdd.map((file) => ({
        ...file,
        extra_registration_id: extra_registration_id,
        file_import_date: format(file.file_import_date, "yyyy-MM-dd"),
      }))

      const insertFileResponse = await fetch(`${apiUrl}/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFileList),
      })

      if (insertFileResponse.ok) {
        return true
      }
      else {
        return false
      }
    }
    else {
      return true
    }
  }

  const handleSaveClick = async () => {
    if (!validateForm()) return

    if (!hasChanges()) {
      PopupMessage("ไม่พบการเปลี่ยนแปลง", "ข้อมูลไม่มีการเปลี่ยนแปลง", "warning")
      return
    }

    try {
      let response
      if (isEditMode && selectedRow) {
        response = await fetch(`${apiUrl}/registrationInformation/${selectedRow.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        })
        
        compareAndSetDifference()
        const newFileAdd = filesImportList.filter((row) => row.id === null)
        if (newFileAdd.length > 0) {
          const res = await saveFileList(selectedRow.id, newFileAdd)
          if (res) {
            PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success")
            closeDialog()
          } 
          else {
            PopupMessage("บันทึกไม่สำเร็จ", "มีข้อผิดพลาดเกิดขึ้น", "error")
          }
        }
        else {
          PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success")
          closeDialog()
        }
      } 
      else {
        // If not in edit mode, make a POST request
        response = await fetch(`${apiUrl}/registrationInformation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        })
  
        const result = await response.json()
        const insertedId = result.id
        compareAndSetDifference()
        const newFileAdd = filesImportList.filter((row) => row.id === null)
        if (newFileAdd.length > 0) {
          const res = await saveFileList(insertedId, newFileAdd)
          if (res) {
            PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success")
            closeDialog()
          } 
          else {
            PopupMessage("บันทึกไม่สำเร็จ", "มีข้อผิดพลาดเกิดขึ้น", "error")
          }
        }
        else {
          PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success")
          closeDialog()
        }
      }
      if (filesDeleteList.length > 0) {
        for (const row of filesDeleteList) {
          try {
            const res = await axios.delete(`${apiUrl}/files/${row.id}`)
            if (res) {
              PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success")
              closeDialog()
            }
            else {
              PopupMessage("บันทึกไม่สำเร็จ", "มีข้อผิดพลาดเกิดขึ้น", "error")
            }
          } 
          catch (error) {
            console.error(`Failed to delete file with id: ${row.id}`, error)
          }
        }
      }
    } 
    catch (error) {
      console.error("Error:", error)
      PopupMessage("บันทึกไม่สำเร็จ", "มีข้อผิดพลาดเกิดขึ้น", "error")
    }
  }

  const handleImportFileClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((file) =>
        file.name.match(/\.(pdf|docx|doc)$/i)
      )

      if (newFiles.length > 0) {
        const newFileList = newFiles.map((file) => ({
          file_name: file.name,
          file_import_date: new Date(),
          file_path: URL.createObjectURL(file),
          id: null,
          extra_registration_id: null,
        }))
        setFilesImportList(newFileList)
      }
    }
  }

  const handleFilePathChange = () => {
    if (filePathInput.current?.value) {
      const file = filePathInput.current.value 
      const fileName = file.split(/(\\|\/)/).pop()
      const newFileList = [{
        file_name: fileName,
        file_import_date: new Date(),
        file_path: file,
      }]
      setFilesImportList((preFilesImportList) => ({
        ...preFilesImportList, newFileList
      }))
      filePathInput.current.value = ""
    }
  }

  const handleDeleteFile = async (index: number) => {
    if (selectedRow) {
      setFilesDeleteList((prevFilesDeleteList) => {
        const updatedList = [...prevFilesDeleteList, filesImportList[index]]
        return updatedList
      })
    }
    setFilesImportList((preFilesImportList) => 
      preFilesImportList.filter((_, i) => i !== index)
    )
  }

  const validateForm = () => {
    const requiredFields = ["letterCategory", "carRegistration", "provinceId", "registrationTypeId", "agencyId"]
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        PopupMessage("กรุณากรอกข้อมูล", `กรุณากรอก ${field}`, "warning")
        return false
      }
    }
    return true
  }

  const handleStartArrestDateChange = (date: Date | undefined) => {
    setFormData(prevState => ({
      ...prevState,
      startArrestDate: date,
    }))
  }
  
  const handleEndArrestDateChange = (date: Date | undefined) => {
    setFormData(prevState => ({
      ...prevState,
      endArrestDate: date,
    }))
  }

  return (
    <div id="manage-extra-registration" className="p-[30px] border-[1px] border-dodgerBlue">
      <div className="grid grid-cols-4 gap-2 items-start justify-start">
        {/* Row 1 */}
        <div className="mr-[50px] mb-[30px]">
          <label>หมวดอักษร*</label>
          <Input 
            id="letterCategory"
            type="text" 
            name="letterCategory"
            value={formData.letterCategory}
            className="w-full h-[35px] text-black mt-[15px]" 
            onChange={handleInputChange} 
          />
        </div>
        <div className="mr-[50px]">
          <label>ป้ายทะเบียน*</label>
          <Input 
            id="carRegistration"
            type="text"
            name="carRegistration"
            value={formData.carRegistration}
            className="w-full h-[35px] text-black mt-[15px]" 
            onChange={handleInputChange} 
          />
        </div>
        <div className="mr-[20px]">
          <label>จังหวัด*</label>
          <Select 
            name="select-provices" 
            value={formData.provinceId === 0 ? "" : formData.provinceId.toString()}
            onValueChange={(value) => handleSelectChange("provinceId", value)}
          >
            <SelectTrigger className="w-full h-[35px] text-black mt-[15px]">
              <SelectValue placeholder="เลือกจังหวัด" />
            </SelectTrigger>
            <SelectContent>
              {
                provinces && provinces.length > 0 ? 
                provinces.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>{ item.province_name_thai }</SelectItem>
                ))
                : null
              }
            </SelectContent>
          </Select>
        </div>
        {/* Import File */}
        <div id="file-import-container" className="col-start-4 row-span-9 h-full border-l-[2px] border-nobel pl-[25px]">
          <div className="h-full">
            {/* Import images file part */}
            <div id="image-import-part" className="flex flex-col items-center">
              <label
                htmlFor="image-upload"
                className="relative flex items-center justify-center w-full h-[250px] mt-[5px] bg-[#48494B] cursor-pointer overflow-hidden hover:bg-gray-800"
              >
                {Array.isArray(formData.images) && formData.images.length > 0 ? (
                  <div className="flex flex-wrap">
                    {formData.images.map((image, index) => (
                      <div key={index} className={ formData.images.length === 1 ? "relative" : "relative items-start w-[150px] h-[120px]" }>
                        <img src={image} alt={`Uploaded ${index + 1}`} className="object-contain w-full h-full" />
                        <button
                          type="button"
                          className="absolute z-[52] top-0 right-0 text-white bg-red-500 rounded-full w-[20px] h-[20px] flex items-center justify-center"
                          onClick={() => handleDeleteImage(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center">
                    <DownloadIcon className="w-[100px] h-[100px]" style={{ color: 'nobel' }} />
                    <span className="text-[18px] text-nobel mt-[20px]">อัพโหลดรูปภาพ</span>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            {/* Import file docx or pdf part */}
            <div id="file-import-part" className="flex mt-[25px]">
              <Input
                placeholder="แนบไฟล์" 
                type="text" className="h-[40px] text-black mr-[5px] placeholder:text-slate-400" 
                onChange={handleInputChange}
                ref={filePathInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleFilePathChange()
                  }
                }}
              />
              <button 
                type="button" 
                className="flex justify-center items-center bg-dodgerBlue rounded w-[140px] h-[40px]"
                onClick={handleImportFileClick}
              >
                <ImportIcon style={{ color: "white" }} className="w-[20px] h-[20px]" />
                <span className="ml-[5px]">Upload</span>
              </button>
            </div>
            <input
              ref={hiddenFileInput}
              name="files"
              type="file"
              accept=".docx, .pdf"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <div id="file-list-part" className="mt-[15px]">
              <table className="w-full">
                <tbody>
                  {filesImportList && filesImportList.length > 0 ? 
                    filesImportList.map((file, index) => (
                      <tr 
                        key={index}
                        className={`h-[40px] ${
                          index % 2 === 0 ? "bg-swamp" : "bg-celtic"
                        } ${index === filesImportList.length - 1 ? "border-b border-white" : "border-b-[1px] border-dashed border-gray-300"}`}
                      >
                        <td className="font-medium text-center">{file.file_name}</td>
                        <td className="font-medium text-center">{format(file.file_import_date, "dd/MM/yyyy")}</td>
                        <td className="w-[30px]">
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(index)}
                          >
                            <DeleteIcon className="w-[20px] h-[20px]" />
                          </button>
                        </td>
                      </tr>
                    )) :
                    <tr className="font-medium h-[40px] bg-swamp border-b border-white">
                      <td className="text-start pl-[10px]">ไม่มีข้อมูล</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Row 2 */}
        <div className="mr-[50px] mb-[30px]">
          <label>กลุ่มทะเบียน*</label>
          <Select 
            name="select-registration-types" 
            value={formData.registrationTypeId === 0 ? "" : formData.registrationTypeId.toString()}
            onValueChange={(value) => handleSelectChange("registrationTypeId", value)}
          >
            <SelectTrigger className="w-full h-[35px] text-black mt-[15px]">
              <SelectValue placeholder="กรุณาเลือก" />
            </SelectTrigger>
            <SelectContent>
              {
                registrationTypes && registrationTypes.length > 0 ? 
                registrationTypes.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>{item.registration_type}</SelectItem>
                ))
                : null
              }
            </SelectContent>
          </Select>
        </div>
        {/* Row 3 */}
        <div className="col-start-1 mr-[50px] mb-[30px]">
          <label>หมายเลขคดี</label>
          <Input 
            type="text" 
            className="w-full h-[35px] text-black mt-[15px]" 
            name="caseId"
            value={formData.caseId}
            onChange={handleInputChange}
          />
        </div>
        <div className="mr-[50px] mb-[30px]">
          <label>วันที่ออกหมายจับ</label>
          <Popover>
            <PopoverTrigger className="mt-[15px] h-[35px] text-black" asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-between text-left font-normal",
                  !formData.startArrestDate && "text-black"
                )}
              >
                {formData.startArrestDate ? format(formData.startArrestDate, "dd/MM/yyyy") : <span>เลือกวันที่ออกหมายจับ</span>}
                <CalendarIcon className="justify-end" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
              <Select
                onValueChange={(value) =>
                  handleStartArrestDateChange(addDays(new Date(), parseInt(value)))
                }
              >
              </Select>
              <div className="rounded-md border">
                <Calendar mode="single" selected={formData.startArrestDate} onSelect={handleStartArrestDateChange}/>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="mr-[20px] mb-[30px]">
          <label>วันที่สิ้นสุดออกหมายจับ</label>
          <Popover>
            <PopoverTrigger className="mt-[15px] h-[35px] text-black" asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-between text-left font-normal",
                  !formData.endArrestDate && "text-black"
                )}
              >
                {formData.endArrestDate ? format(formData.endArrestDate, "dd/MM/yyyy") : <span>เลือกวันที่สิ้นสุดออกหมายจับ</span>}
                <CalendarIcon className="justify-end" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
              <Select
                onValueChange={(value) =>
                  handleEndArrestDateChange(addDays(new Date(), parseInt(value)))
                }
              >
              </Select>
              <div className="rounded-md border">
                <Calendar mode="single" selected={formData.endArrestDate} onSelect={handleEndArrestDateChange}/>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {/* Row 4 */}
        <div className="col-start-1 col-span-3 mr-[20px] mb-[30px]">
          <label>พฤติกรรม</label>
          <Textarea 
            className="w-full h-[100px] text-start text-wrap text-black mt-[15px]" 
            name="behavior1"
            value={formData.behavior1}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        {/* Row 5 */}
        <div className="col-start-1 mr-[50px] mb-[30px]">
          <label>เจ้าของข้อมูล</label>
          <Input 
            type="text" 
            className="w-full h-[35px] text-black mt-[15px]" 
            name="dataOwner"
            value={formData.dataOwner}
            onChange={handleInputChange}
          />
        </div>
        <div className="mr-[50px] mb-[30px]">
          <label>หน่วยงาน*</label>
          <Select 
            name="select-agency" 
            value={formData.agencyId === 0 ? "" : formData.agencyId.toString()}
            onValueChange={(value) => handleSelectChange("agencyId", value)}
          >
            <SelectTrigger className="w-full h-[35px] text-black mt-[15px]">
              <SelectValue placeholder="เลือกหน่วยงานเจ้าของข้อมูล" />
            </SelectTrigger>
            <SelectContent>
              {
                agencies && agencies.length > 0 ? 
                agencies.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>{item.agency}</SelectItem>
                ))
                : null
              }
            </SelectContent>
          </Select>
        </div>
        <div className="mr-[20px] mb-[30px]">
          <label>เบอร์ติดต่อ</label>
          <Input 
            type="text" 
            className="w-full h-[35px] text-black mt-[15px]" 
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        {/* Row 6 */}
        <div className="col-start-1 flex items-center justify-start">
          <Checkbox 
            id="status-checkbox" 
            className="border-[1px] border-white mr-[10px] w-[26px] h-[26px]"
            value={formData.statusId}
            checked={formData.statusId === 1}
            onCheckedChange={handleCheckboxChange}
          />
          <label className="text-[15px]">Active</label>
        </div>
        {/* Row 7 */}
        <div className="col-start-3 row-start-8 flex items-center justify-end mr-[20px]">
          <button 
            type="button" 
            className="bg-dodgerBlue w-[90px] h-[40px] rounded mr-[10px]" 
            onClick={handleSaveClick}
          >
            <span>บันทึก</span>
          </button>
          <button 
            type="button" 
            className="bg-white border-[1px] border-dodgerBlue text-dodgerBlue w-[90px] h-[40px] rounded" 
            onClick={closeDialog}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageExtraRegistration