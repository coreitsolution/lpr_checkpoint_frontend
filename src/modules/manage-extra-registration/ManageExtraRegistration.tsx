import React, { useState, useRef, useEffect } from "react"
import {
  SelectChangeEvent,
} from "@mui/material"
import PopupMessage from "../../utils/popupMessage"
import { format, parse } from "date-fns"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../app/store"
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { th } from 'date-fns/locale'

// Components
import { Input } from "../../components/ui/input"
import { Checkbox } from "../../components/ui/checkbox"
import { Textarea } from "../../components/ui/textarea"
import SelectBox from '../../components/select-box/SelectBox'
import TextBox from '../../components/text-box/TextBox'

// API
import { 
  fetchAgenciesThunk,
  fetchProvincesThunk,
  fetchRegistrationTypesThunk
} from "../../features/dropdown/dropdownSlice"
import { 
  fetchFilesDataThunk,
  putSpecialRegistrationDataThunk,
  postFilesDataThunk,
  postSpecialRegistrationDataThunk,
  deleteFilesDataThunk,
 } from "../../features/registration-data/RegistrationDataSlice"

// Types
import {
  FilesData,
  NewFilesData
} from '../../features/api/types'
import { NewSpecialRegistrationData, SpecialRegistrationData } from "../../features/registration-data/RegistrationDataTypes"

// Icon
import { Icon } from '../../components/icons/Icon'
import { Download, Import, Trash2 } from 'lucide-react'

const locales = { 'th': th }

type LocaleKey = keyof typeof locales

interface ManageExtraRegistrationProps {
  closeDialog: () => void
  selectedRow: SpecialRegistrationData | null
  isEditMode: boolean
}

const ManageExtraRegistration: React.FC<ManageExtraRegistrationProps> = ({ closeDialog, selectedRow, isEditMode }) => {
  const hiddenFileInput = useRef<HTMLInputElement | null>(null)
  const filePathInput = useRef<HTMLInputElement | null>(null)
  const [originalData, setOriginalData] = useState<SpecialRegistrationData | null>(null)
  const [filesImportList, setFilesImportList] = useState<FilesData[]>([])
  const [filesImportListOri, setFilesImportListOri] = useState<FilesData[]>([])
  const [filesDeleteList, setFilesDeleteList] = useState<FilesData[]>([])
  const [locale] = React.useState<LocaleKey>('th')

  const dispatch: AppDispatch = useDispatch()
  const { agencies, provinces, registrationTypes } = useSelector(
    (state: RootState) => state.dropdown
  )

  useEffect(() => {
    dispatch(fetchAgenciesThunk())
    dispatch(fetchProvincesThunk())
    dispatch(fetchRegistrationTypesThunk())
  }, [dispatch])

  const provinceOptions = provinces.map((row) => ({
    value: row.id,
    label: row.name_th,
  }))

  const registrationTypesOptions = registrationTypes.map((row) => ({
    value: row.id,
    label: row.registration_type,
  }))

  const agenciesOptions = agencies.map((row) => ({
    value: row.id,
    label: row.agency,
  }))

  const [formData, setFormData] = useState({
    letterCategory: "",
    carRegistration: "",
    provinceId: 0,
    images: [] as string[],
    caseId: "",
    startArrestDate: null as Date | null,
    endArrestDate: null as Date | null,
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
        startArrestDate: parse(selectedRow.start_arrest_date, "dd/MM/yyyy", new Date()),
        endArrestDate: parse(selectedRow.end_arrest_date, "dd/MM/yyyy", new Date()),
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
          const response = await dispatch(fetchFilesDataThunk(selectedRow.id)).unwrap()
          const newFilesImportList = response.map((fileData: FilesData) => ({
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
        startArrestDate: null,
        endArrestDate: null,
        behavior1: "",
        behavior2: "",
        dataOwner: "",
        phone: "",
        registrationTypeId: 0,
        agencyId: 0,
        statusId: 2,
      })
    }
  }, [selectedRow, isEditMode, dispatch])

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

  const handleTextChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
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

  const updatedFormData: NewSpecialRegistrationData = {
    start_arrest_date: formData.startArrestDate ? format(formData.startArrestDate, "dd/MM/yyyy") : "",
    end_arrest_date: formData.endArrestDate ? format(formData.endArrestDate, "dd/MM/yyyy") : "",
    letter_category: formData.letterCategory,    
    car_registration: formData.carRegistration,        
    province_id: formData.provinceId,  
    images: formData.images,
    case_id: formData.caseId,                   
    behavior1: formData.behavior1,             
    behavior2: formData.behavior2,             
    status_id: formData.statusId,
    phone: formData.phone,
    data_owner: formData.dataOwner,
    registration_type_id: formData.registrationTypeId,
    agency_id:  formData.agencyId,
    created_at: (new Date()).toString(), 
    updated_at: (new Date()).toString(),  
  }

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData)
  }

  const saveFileList = async (extra_registration_id: number, newFileAdd: NewFilesData[]): Promise<boolean> => {
    if (newFileAdd.length > 0) {
      const newFileList: NewFilesData[] = newFileAdd.map((file) => ({
        ...file,
        extra_registration_id: extra_registration_id,
        file_import_date: file.file_import_date,
      }))

      const insertFileResponse = await dispatch(postFilesDataThunk(newFileList))

      if (insertFileResponse) {
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
        const updateDataWithId = {...updatedFormData, id: selectedRow.id}
        response = await dispatch(putSpecialRegistrationDataThunk(updateDataWithId)).unwrap()
        
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
        response = await dispatch(postSpecialRegistrationDataThunk(updatedFormData)).unwrap()

        const insertedId = response.id
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
            if (row.id) {
              const res = await dispatch(deleteFilesDataThunk(row.id))
              if (res) {
                PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success")
                closeDialog()
              }
              else {
                PopupMessage("บันทึกไม่สำเร็จ", "มีข้อผิดพลาดเกิดขึ้น", "error")
              }
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
          file_import_date: (new Date()).toDateString(),
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
        file_import_date: (new Date()).toDateString(),
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

  const handleStartArrestDateChange = (date: Date | null) => {
    setFormData(prevState => ({
      ...prevState,
      startArrestDate: date,
    }))
  }
  
  const handleEndArrestDateChange = (date: Date | null) => {
    setFormData(prevState => ({
      ...prevState,
      endArrestDate: date,
    }))
  }

  return (
    <div id="manage-extra-registration" className="bg-black text-white p-[30px] border-[1px] border-dodgerBlue">
      <div className="grid grid-cols-4 gap-2 items-start justify-start">
        {/* Row 1 */}
        <div className="mr-[50px] mb-[30px]">
          <TextBox
            sx={{ marginTop: "10px", fontSize: "15px" }}
            id="letter-category"
            label="หมวดอักษร*"
            placeHolder=""
            className="w-full"
            value={formData.letterCategory}
            onChange={(event) => handleTextChange('letterCategory', event.target.value)}
          />
        </div>
        <div className="mr-[50px]">
          <TextBox
            sx={{ marginTop: "10px", fontSize: "15px" }}
            id="car-registration"
            label="ป้ายทะเบียน*"
            placeHolder=""
            className="w-full"
            value={formData.carRegistration}
            onChange={(event) => handleTextChange('carRegistration', event.target.value)}
          />
        </div>
        <div className="mr-[20px]">
          <SelectBox
            sx={{ marginTop: "10px", height: "40px", fontSize: "15px" }}
            id="select-provices"
            className="w-full"
            value={formData.provinceId === 0 ? "" : formData.provinceId.toString()}
            onChange={(event: SelectChangeEvent<any>) => handleSelectChange('provinceId', event.target.value)}
            options={provinceOptions}
            label="จังหวัด*"
          />
        </div>
        {/* Import File */}
        <div
          id="file-import-container"
          className="col-start-4 row-span-9 h-full border-l-[2px] border-nobel pl-[25px]"
        >
          <div className="h-full">
            {/* Image Upload Section */}
            <div id="image-import-part" className="flex flex-col items-center">
              <label
                htmlFor="image-upload"
                className="relative flex items-center justify-center w-full h-[250px] mt-[5px] bg-[#48494B] cursor-pointer overflow-hidden hover:bg-gray-800"
              >
                {Array.isArray(formData.images) && formData.images.length > 0 ? (
                  <div className="flex flex-wrap">
                    {formData.images.map((image, index) => (
                      <div
                        key={index}
                        className={`relative w-[150px] h-[150px] ${
                          formData.images.length === 1
                            ? ""
                            : "items-start"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Uploaded ${index + 1}`}
                          className="object-contain w-full h-full"
                        />
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
                    <Icon icon={Download} size={80} color="#999999" />
                    <span className="text-[18px] text-nobel mt-[20px]">
                      อัพโหลดรูปภาพ
                    </span>
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

            {/* File Upload Section */}
            <div id="file-import-part" className="flex mt-[25px]">
              <Input
                placeholder="แนบไฟล์"
                type="text"
                className="h-[40px] text-black bg-white mr-[5px] placeholder:text-slate-400"
                onChange={handleInputChange}
                ref={filePathInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFilePathChange();
                  }
                }}
              />
              <button
                type="button"
                className="flex justify-center items-center bg-dodgerBlue rounded w-[140px] h-[40px]"
                onClick={handleImportFileClick}
              >
                <Icon icon={Import} size={20} color="white" />
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

            {/* File List Section */}
            <div id="file-list-part" className="mt-[15px]">
              <table className="w-full">
                <tbody>
                  {filesImportList?.length > 0 ? (
                    filesImportList.map((file, index) => (
                      <tr
                        key={index}
                        className={`h-[40px] ${
                          index % 2 === 0 ? "bg-swamp" : "bg-celtic"
                        } ${
                          index === filesImportList.length - 1
                            ? "border-b border-white"
                            : "border-b-[1px] border-dashed border-gray-300"
                        }`}
                      >
                        <td className="font-medium text-center">{file.file_name}</td>
                        <td className="font-medium text-center">
                          {format(new Date(file.file_import_date), "dd/MM/yyyy")}
                        </td>
                        <td className="w-[30px]">
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(index)}
                          >
                            <Icon icon={Trash2} size={20} color="white" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="font-medium h-[40px] bg-swamp border-b border-white">
                      <td className="text-start pl-[10px]">ไม่มีข้อมูล</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Row 2 */}
        <div className="mr-[50px] mb-[30px]">
          <SelectBox
            sx={{ marginTop: "10px", height: "40px", fontSize: "15px" }}
            id="select-registration-type"
            className="w-full"
            value={formData.registrationTypeId === 0 ? "" : formData.registrationTypeId.toString()}
            onChange={(event: SelectChangeEvent<any>) => handleSelectChange('registrationTypeId', event.target.value)}
            options={registrationTypesOptions}
            label="กลุ่มทะเบียน*"
          />
        </div>
        {/* Row 3 */}
        <div className="col-start-1 mr-[50px] mb-[30px]">
          <TextBox
            sx={{ marginTop: "10px", fontSize: "15px" }}
            id="case-id"
            label="หมายเลขคดี*"
            placeHolder=""
            className="w-full"
            value={formData.caseId}
            onChange={(event) => handleTextChange('caseId', event.target.value)}
          />
        </div>
        <div className="mr-[50px] mb-[30px] pt-[3px]">
          <label>วันที่ออกหมายจับ</label>
          <LocalizationProvider 
            dateAdapter={AdapterDateFns}
            adapterLocale={locales[locale]}
            >
            <DatePicker 
              sx={{ marginTop: "10px", borderRadius: "5px", backgroundColor: "white" }}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
              value={formData.startArrestDate ? formData.startArrestDate : null}
              onChange={(value) => handleStartArrestDateChange(value)}
            />
          </LocalizationProvider>
        </div>
        <div className="mr-[20px] mb-[30px] pt-[3px]">
          <label>วันที่สิ้นสุดออกหมายจับ</label>
          <LocalizationProvider 
            dateAdapter={AdapterDateFns}
            adapterLocale={locales[locale]}
            >
            <DatePicker 
              sx={{ marginTop: "10px", borderRadius: "5px", backgroundColor: "white" }}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
              value={formData.endArrestDate}
              onChange={(value) => handleEndArrestDateChange(value)}
            />
          </LocalizationProvider>
        </div>
        {/* Row 4 */}
        <div className="col-start-1 col-span-3 mr-[20px] mb-[30px]">
          <label>พฤติกรรม</label>
          <Textarea 
            className="w-full h-[100px] text-start text-wrap text-black mt-[15px] bg-white" 
            name="behavior1"
            value={formData.behavior1}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        {/* Row 5 */}
        <div className="col-start-1 mr-[50px] mb-[30px]">
          <TextBox
            sx={{ marginTop: "10px", fontSize: "15px" }}
            id="data-owner"
            label="เจ้าของข้อมูล*"
            placeHolder=""
            className="w-full"
            value={formData.dataOwner}
            onChange={(event) => handleTextChange('dataOwner', event.target.value)}
          />
        </div>
        <div className="mr-[50px] mb-[30px]">
          <SelectBox
            sx={{ marginTop: "10px", height: "40px", fontSize: "15px" }}
            id="select-agency"
            className="w-full"
            value={formData.agencyId === 0 ? "" : formData.agencyId.toString()}
            onChange={(event: SelectChangeEvent<any>) => handleSelectChange('agencyId', event.target.value)}
            options={agenciesOptions}
            label="หน่วยงาน*"
          />
        </div>
        <div className="mr-[20px] mb-[30px]">
          <TextBox 
            sx={{ marginTop: "10px", fontSize: "15px" }}
            id="phone"
            label="เบอร์ติดต่อ*"
            placeHolder=""
            className="w-full"
            value={formData.phone}
            onChange={(event) => handleTextChange('phone', event.target.value)}
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