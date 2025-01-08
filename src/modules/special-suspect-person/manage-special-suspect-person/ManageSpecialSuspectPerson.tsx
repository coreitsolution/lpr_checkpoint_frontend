import React, { useState, useRef, useEffect, useCallback } from "react"
import { PopupMessage, PopupMessageWithCancel } from "../../../utils/popupMessage"
import { format, parse } from "date-fns"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../../app/store"
import { FILE_URL } from '../../../config/apiConfig'
import dayjs from 'dayjs';
import 'dayjs/locale/th';


// Components
import { Checkbox } from "../../../components/ui/checkbox"
import { Textarea } from "../../../components/ui/textarea"
import TextBox from "../../../components/text-box/TextBox"
import Loading from "../../../components/loading/Loading"
import AutoComplete from "../../../components/auto-complete/AutoComplete"
import DatePickerBuddhist from "../../../components/date-picker-buddhist/DatePickerBuddhist"

// API
import {
  fetchDistrictsThunk,
  fetchSubDistrictsThunk,
} from "../../../features/dropdown/dropdownSlice"
import {
  putSpecialSuspectPeopleDataThunk,
  postSpecialSuspectPeopleDataThunk,
} from "../../../features/suspect-people/SuspectPeopleDataSlice"
import {
  postFilesDataThunk,
  deleteFilesDataThunk,
} from "../../../features/file-upload/fileUploadSlice"

// Types
import {
  FileData,
  SuspectPeopleRespondsDetail,
  FileRespondsData,
  NewFileRespondsData,
  NewSuspectPeople,
} from "../../../features/suspect-people/SuspectPeopleDataTypes"
import { DeleteRequestData } from "../../../features/file-upload/fileUploadTypes"

// Icon
import { Icon } from "../../../components/icons/Icon"
import { Download, Upload, Trash2 } from "lucide-react"

// Utils
import { formatThaiID, formatPhone } from "../../../utils/comonFunction"

dayjs.locale('th');

interface ManageExtraRegistrationProps {
  closeDialog: () => void
  selectedRow: SuspectPeopleRespondsDetail | null
  isEditMode: boolean
}

interface FormData {
  name_prefix: number | ''
  firstname: string
  lastname: string
  nation_number: string
  address: string
  province_id: number | ''
  district_id: number | ''
  sub_district_id: number | ''
  postal_code: string
  person_class_id: number | ''
  imagesData: {
    [key: number]: FileData
  }
  case_number: string
  arrest_warrant_date: Date | null
  arrest_warrant_expire_date: Date | null
  behavior: string
  case_owner_name: string
  case_owner_phone: string
  case_owner_agency: string
  active: number
  filesData: FileRespondsData[] | NewFileRespondsData[]
  visible: number
}

const ManageSpecialSuspectPerson: React.FC<ManageExtraRegistrationProps> = ({
  closeDialog,
  selectedRow,
  isEditMode,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const hiddenFileInput = useRef<HTMLInputElement | null>(null)
  const [originalData, setOriginalData] = useState<FormData | null>(
    null
  )
  const [personTypesOptions, setPersonTypesOptions] = useState<{ label: string, value: number }[]>([])
  const [provincesOptions, setProvincesOptions] = useState<{ label: string, value: number }[]>([])
  const [subDistrictsOptions, setSubDistrictsOptions] = useState<{ label: string; value: number }[]>([]);
  const [districtsOptions, setDistrictsOptions] = useState<{ label: string; value: number }[]>([]);
  const [commonPrefixOptions, setCommonPrefixOptions] = useState<{ label: string; value: number }[]>([]);
  const [isBlackListType, setIsBlackListType] = useState(true)

  const dispatch: AppDispatch = useDispatch()
  const { provinces, registrationTypes, districts, subDistricts, commonPrefixes } = useSelector(
    (state: RootState) => state.dropdown
  )

  useEffect(() => {
    if (registrationTypes && registrationTypes.data) {
      const options = registrationTypes.data.map((row) => ({
        label: row.title_en,
        value: row.id,
      }))
      setPersonTypesOptions(options)
    }
  }, [registrationTypes])

  useEffect(() => {
    if (provinces && provinces.data) {
      const options = provinces.data.map((row) => ({
        label: row.name_th,
        value: row.id,
      }))
      setProvincesOptions(options)
    }
  }, [provinces])

  useEffect(() => {
    if (districts && districts.data) {
      const options = districts.data.map((row) => ({
        label: row.name_th,
        value: row.id,
      }));
      setDistrictsOptions(options);
    }
  }, [districts]);

  useEffect(() => {
    if (subDistricts && subDistricts.data) {
      const options = subDistricts.data.map((row) => ({
        label: row.name_th,
        value: row.id,
      }));
      setSubDistrictsOptions(options);
    }
  }, [subDistricts]);

  useEffect(() => {
    if (commonPrefixes && commonPrefixes.data) {
      const options = commonPrefixes.data.map((row) => ({
        label: row.title_th,
        value: row.id,
      }));
      setCommonPrefixOptions(options);
    }
  }, [commonPrefixes]);

  const [formData, setFormData] = useState<FormData>({
    name_prefix: "",
    firstname: "",
    lastname: "",
    nation_number: "",
    address: "",
    province_id: '',
    district_id: '',
    sub_district_id: '',
    postal_code: "",
    person_class_id: 0,
    imagesData: {},
    case_number: "",
    arrest_warrant_date: null,
    arrest_warrant_expire_date: null,
    behavior: "",
    case_owner_name: "",
    case_owner_phone: "",
    case_owner_agency: "",
    active: 0,
    filesData: [],
    visible: 1,
  })

  const parseDateString = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    try {
      return parse(dateString, 'yyyy-MM-dd', new Date());
    } 
    catch (error) {
      return null;
    }
  };

  useEffect(() => {
    setIsLoading(true)
    if (isEditMode && selectedRow) {
      const data = {
        name_prefix: selectedRow.title_id,
        firstname: selectedRow.firstname,
        lastname: selectedRow.lastname,
        nation_number: formatThaiID(selectedRow.idcard_number),
        address: selectedRow.address,
        province_id: selectedRow.province_id,
        district_id: selectedRow.district_id,
        sub_district_id: selectedRow.subdistrict_id,
        postal_code: selectedRow.zipcode,
        imagesData: selectedRow.special_suspect_person_images,
        case_number: selectedRow.case_number,
        arrest_warrant_date: parseDateString(
          selectedRow.arrest_warrant_date
        ),
        arrest_warrant_expire_date: parseDateString(
          selectedRow.arrest_warrant_expire_date
        ),
        behavior: selectedRow.behavior,
        case_owner_name: selectedRow.case_owner_name,
        case_owner_phone: formatPhone(selectedRow.case_owner_phone),
        person_class_id: selectedRow.person_class_id,
        case_owner_agency: selectedRow.case_owner_agency,
        active: selectedRow.active,
        filesData: selectedRow.special_suspect_person_files,
        visible: 1,
      }
      checkIsBlackListType(selectedRow.person_class_id)
      setFormData(data)
      setOriginalData(data)
    } 
    else {
      setFormData({
        name_prefix: "",
        firstname: "",
        lastname: "",
        nation_number: "",
        address: "",
        province_id: '',
        district_id: '',
        sub_district_id: '',
        postal_code: "",
        person_class_id: 0,
        case_number: "",
        arrest_warrant_date: null,
        arrest_warrant_expire_date: null,
        behavior: "",
        case_owner_name: "",
        case_owner_agency: "",
        case_owner_phone: "",
        imagesData: {},
        filesData: [],
        active: 0,
        visible: 1,
      })
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  }, [selectedRow, isEditMode, dispatch])

  useEffect(() => {
    const fetchData = async () => {
      let query: Record<string, string> = {}
      if (formData.province_id) {
        query["filter"] = `province_id:${formData.province_id}`
        query["orderBy"] = `name_th`
        await dispatch(fetchDistrictsThunk(query));
      }
      if (formData.district_id) {
        query["filter"] = `district_id:${formData.district_id},province_id:${formData.province_id}`
        query["orderBy"] = `name_th`
        await dispatch(fetchSubDistrictsThunk(query));
      }
    };
    fetchData();
  }, [dispatch, formData.province_id, formData.district_id]);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    // Convert the file list to an array for processing
    const fileArray = Array.from(files)

    // Helper function to determine next available positions
    const getNextAvailablePositions = (
      currentImages: { [key: number]: FileData },
      numNeeded: number
    ) => {
      const positions: number[] = []
      for (let i = 0; i < 3 && positions.length < numNeeded; i++) {
        if (!currentImages[i]) {
          positions.push(i)
        }
      }
      return positions
    }

    const availablePositions = getNextAvailablePositions(
      formData.imagesData,
      fileArray.length
    )


    try {
      const formData = new FormData()
      fileArray.forEach(file => {
        formData.append("files", file)
      })

      const response = await dispatch(
        postFilesDataThunk(formData)
      ).unwrap()

      if (response?.data) {
        const uploadedImages = response.data.map((file: any, index: any) => ({
          position: availablePositions[index],
          image: {
            title: file.title,
            url: file.url,
          },
        }))

        const imagesDataUpdates = uploadedImages.reduce(
          (acc: any, { position, image }) => {
            if (position !== undefined) {
              acc[position] = image
            }
            return acc
          },
          {} as { [key: number]: FileData }
        )

        setFormData((prev) => ({
          ...prev,
          imagesData: {
            ...prev.imagesData,
            ...imagesDataUpdates,
          },
        }))
      }
    } 
    catch (error) {
      PopupMessage("เกิดข้อผิดพลาดในการอัพโหลดไฟล์", error instanceof Error ? error.message : String(error), "error")
    }
  }, [dispatch, formData.imagesData])

  const handleDeleteImage = useCallback(async (position: number, url: string) => {
    try {
      const deleteFile: DeleteRequestData = {
        url: url
      }
      await deleteFileUpload(deleteFile)
    }
    catch (error) {

    }
    setFormData((prev) => {
      const updatedImagesData = { ...prev.imagesData }
      delete updatedImagesData[position]

      return {
        ...prev,
        imagesData: updatedImagesData,
      }
    })
  }, [dispatch])

  const handleTextChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      active: checked ? 1 : 0,
    })
  }

  const convertImagesToArray = (imagesObj: {
    [key: number]: FileData | null
  }): (FileData | null)[] => {
    const maxIndex = Math.max(...Object.keys(imagesObj).map(Number), -1)

    // Create array of that length + 1
    return Array.from({ length: maxIndex + 1 }, (_, index) => {
      return imagesObj[index] || null
    })
  }

  const getImagesArrayWithoutNulls = (imagesObj: {
    [key: number]: FileData | null
  }): FileData[] => {
    return convertImagesToArray(imagesObj).filter(
      (img): img is FileData => img !== null
    )
  }

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData)
  }

  const hasOnlyActiveChanged = () => {
    if (!originalData) {
      return false;
    }

    const { active: currentActive, ...currentData } = formData;
    const { active: originalActive, ...originalDataWithoutActive } = originalData;

    const isOtherDataUnchanged = JSON.stringify(currentData) === JSON.stringify(originalDataWithoutActive);

    const isActiveChanged = formData.active !== originalData.active;

    return isActiveChanged && isOtherDataUnchanged;
  }

  const handleSaveClick = async () => {
    if (!validateForm()) return

    if (!hasChanges()) {
      PopupMessage(
        "ไม่พบการเปลี่ยนแปลง",
        "ข้อมูลไม่มีการเปลี่ยนแปลง",
        "warning"
      )
      return
    }

    try {
      const updatedFormData: NewSuspectPeople = {
        arrest_warrant_date: formData.arrest_warrant_date
          ? dayjs(formData.arrest_warrant_date).format('YYYY-MM-DD')
          : "",
        arrest_warrant_expire_date: formData.arrest_warrant_expire_date
          ? dayjs(formData.arrest_warrant_date).format('YYYY-MM-DD')
          : "",
        title_id: formData.name_prefix ? formData.name_prefix : 0,
        firstname: formData.firstname,
        idcard_number: formData.nation_number.replace("-", ""),
        address: formData.address,
        lastname: formData.lastname,
        province_id: formData.province_id ? formData.province_id : 0,
        district_id: formData.district_id ? formData.district_id : 0,
        subdistrict_id: formData.sub_district_id ? formData.sub_district_id : 0,
        zipcode: formData.postal_code,
        imagesData: formData.imagesData
          ? getImagesArrayWithoutNulls(convertImagesToArray(formData.imagesData))
          : [],
        case_number: formData.case_number,
        behavior: formData.behavior,
        active: formData.active,
        case_owner_phone: formData.case_owner_phone.replace("-", ""),
        case_owner_name: formData.case_owner_name,
        person_class_id: formData.person_class_id ? formData.person_class_id : 0,
        case_owner_agency: formData.case_owner_agency,
        filesData: formData.filesData,
        visible: 1,
      }

      let isSuccess = true

      const handleSuccess = () => {
        PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success")
        closeDialog()
      }

      const handleError = () => {
        isSuccess = false
        PopupMessage("บันทึกไม่สำเร็จ", "มีข้อผิดพลาดเกิดขึ้น", "error")
      }

      if (isEditMode && selectedRow) {
        let title = "ยันยันการแก้ไข"
        if (hasOnlyActiveChanged()) {
          title = "ยันยันการเปลี่ยนสถานะ"
        }
        const confirmed = await PopupMessageWithCancel(title, "คุณต้องการดำเนินการต่อใช่หรือไม่?", "ยืนยัน", "ยกเลิก", "warning")
        
        if (confirmed) {
          // Update existing data
          const updateDataWithId = { ...updatedFormData, id: selectedRow.id }
          console.log("Update updatedFormData", updateDataWithId)
          await dispatch(
            putSpecialSuspectPeopleDataThunk(updateDataWithId)
          ).unwrap()
        }
        else {
          return
        }

      } 
      else {
        // Add new data
        await dispatch(
          postSpecialSuspectPeopleDataThunk(updatedFormData)
        ).unwrap()
      }

      if (isSuccess) {
        handleSuccess()
      }
      else {
        handleError()
      }
    } catch (error) {
      PopupMessage("บันทึกไม่สำเร็จ", "มีข้อผิดพลาดเกิดขึ้น", "error")
    }
  }

  const handleImportFileClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click()
    }
  }

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const newFiles = Array.from(e.target.files).filter((file) =>
      /\.(pdf|docx|doc)$/i.test(file.name)
    )

    if (newFiles.length > 0) {
      try {
        const formData = new FormData()
        newFiles.forEach(file => {
          formData.append("files", file) // Append each file individually
        })
        // Dispatch the thunk to upload files and await the response
        const response = await dispatch(
          postFilesDataThunk(formData)
        ).unwrap()
  
        if (response?.data) {
          const uploadedFiles: NewFileRespondsData[] = response.data.map((file) => ({
            title: file.title,
            url: file.url,
            createdAt: new Date().toDateString()
          }))

          setFormData((prev) => ({
            ...prev,
            filesData: [...prev.filesData, ...uploadedFiles],
          }))
        }
      }
      catch (error) {
        PopupMessage("เกิดข้อผิดพลาดในการอัพโหลดไฟล์", error instanceof Error ? error.message : String(error), "error")
      }
    }

    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = ""
    }
  }, [])

  const handleDeleteFile = useCallback(async(index: number, url: string) => {
    try {
      const deleteFile: DeleteRequestData = {
        url: url
      }
      await deleteFileUpload(deleteFile)

      setFormData((prev) => ({
        ...prev,
        filesData: prev.filesData.filter((_, i) => i !== index), // Remove by index
      }))
    }
    catch (error) {
      console.error("Error deleting files:", error)
    }
  }, [])

  const validateForm = () => {
    const requiredFields = [
      "name_prefix",
      "firstname",
      "lastname",
      "nation_number",
      "address",
      "province_id",
      "district_id",
      "sub_district_id",
      "postal_code",
      "person_class_id",
      "arrest_warrant_date",
      "arrest_warrant_expire_date",
      "behavior",
      "case_owner_name",
      "case_owner_agency",
      "case_owner_phone",
    ]

    const fieldErrorMessages: Record<string, string> = {
      name_prefix: "คำนำหน้า",
      firstname: "ชื่อ",
      lastname: "นามสกุล",
      nation_number: "หมายเลขบัตรประชาชน",
      address: "ที่อยู่",
      province_id: "จังหวัด",
      district_id: "อำเภอ",
      sub_district_id: "ตำบล",
      postal_code: "รหัสไปรษณีย์",
      person_class_id: "ประเภทบุคคล",
      arrest_warrant_date: "วันที่ออกหมายจับ",
      arrest_warrant_expire_date: "วันที่สิ้นสุดออกหมายจับ",
      behavior: "พฤติการ",
      case_owner_name: "เจ้าของข้อมูล",
      case_owner_agency: "หน่วยงาน",
      case_owner_phone: "เบอร์ติดต่อ",
    };

    const skipField = [
      "case_number",
      "arrest_warrant_date",
      "arrest_warrant_expire_date",
      "behavior",
    ]

    let errorField: string[] = []
    for (const field of requiredFields) {
      const data = formData[field as keyof typeof formData]
      if (skipField.includes(field) && formData["person_class_id"]) {
        if (!isBlackListType) {
          continue
        }
        else if (!data) {
          errorField.push(fieldErrorMessages[field])
        }
      }
      else if (!data) {
        errorField.push(fieldErrorMessages[field])
      }
    }
    if (errorField.length > 0) {
      const errorMessage = `กรุณากรอก "${errorField.join(", ")}"`;
      PopupMessage("กรุณากรอกข้อมูล", errorMessage, "warning");
      return false
    }
    return true
  }

  const handleStartArrestDateChange = (date: Date | null) => {
    setFormData((prevState) => ({
      ...prevState,
      arrest_warrant_date: date,
    }))
  }

  const handleEndArrestDateChange = (date: Date | null) => {
    setFormData((prevState) => ({
      ...prevState,
      arrest_warrant_expire_date: date,
    }))
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

  const handleCancelButton = async () => {
    const filesToDelete: string[] = []
  
    if (selectedRow && selectedRow.special_suspect_person_images) {
      selectedRow.special_suspect_person_images.forEach((image) => {
        const imageUrl = image.url
        let isFound = false

        Object.values(formData.imagesData).forEach((existingImage) => {
          if (existingImage.url === imageUrl) {
            isFound = true
          }
        })
  
        if (!isFound) {
          filesToDelete.push(imageUrl)
        }
      })
    } 
    else if (formData.imagesData) {
      Object.values(formData.imagesData).forEach((image) => {
        filesToDelete.push(image.url)
      })
    }
  
    for (const url of filesToDelete) {
      const deleteRequest: DeleteRequestData = { url }
      await deleteFileUpload(deleteRequest)
    }

    closeDialog()
  }

  const getFileName = (title:string, url:string):string => {
    try {
      const urlSplit = url.split('/')
      const fileNameWithExtension = urlSplit[urlSplit.length - 1] 
      const extensionSplit = fileNameWithExtension.split('.')
      const extension = extensionSplit.length > 1 ? extensionSplit.pop() : 'txt'
      return `${title}.${extension}`
    } 
    catch (error) {
      console.error("Error extracting file name:", error)
      return `${title}.txt` // Default fallback
    }
  }

  const handleCommonPrefixChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    handleSelectChange("name_prefix", value ? value.value : '');
  };

  const handleProvicesChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    if (value) {
      handleSelectChange("province_id", value.value);
    }
    else {
      handleSelectChange("province_id", '');
      handleSelectChange("district_id", '');
      handleSelectChange("sub_district_id", '');
    }
  };

  const handleDistrictChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    if (value) {
      handleSelectChange("district_id", value.value);
    }
    else {
      handleSelectChange("district_id", '');
      handleSelectChange("sub_district_id", '');
    }
  };

  const handleSubDistrictChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    if (value) {
      handleSelectChange("sub_district_id", value.value);
      const zipcode = subDistricts?.data?.find((row) => row.id === value.value)?.zipcode
      handleTextChange("postal_code", zipcode ? zipcode : "");
    }
    else {
      handleSelectChange("sub_district_id", '');
      handleTextChange("postal_code", "");
    }
  };

  const handleNationNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const cleaned = input.replace(/\D/g, '');
    
    if (cleaned.length <= 13) {
      const formatted = formatThaiID(cleaned)
      handleTextChange("nation_number", formatted)
    }
    return cleaned
  }

  const handlePostalCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const cleaned = input.replace(/\D/g, '');
    
    if (cleaned.length <= 5) {
      handleTextChange("postal_code", cleaned)
    }
    return cleaned
  }

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const cleaned = input.replace(/\D/g, '');
    
    if (cleaned.length <= 10) {
      const formatted = formatPhone(cleaned)
      handleTextChange("case_owner_phone", formatted)
    }
    return cleaned
  }

  const checkIsBlackListType = (value: any) => {
    const type = registrationTypes?.data?.find((type) => type.id === value)?.title_en
    setIsBlackListType(!type || type.toLowerCase() === "blacklist" ? true : false)
  }

  const handlePersonTypeChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    if (value) {
      handleSelectChange("person_class_id", value.value)
      checkIsBlackListType(value.value)
    }
    else {
      handleSelectChange("person_class_id", "0")
      setIsBlackListType(true)
    }
  }
  
  return (
    <div
      id="manage-special-registration"
      className="bg-black text-white p-[20px] border-[1px] border-dodgerBlue"
    >
      {isLoading && <Loading />}
      <div className="grid grid-cols-4 gap-2 items-start justify-start">
        {/* Row 1 */}
        <div className="mr-[20px]">
          <AutoComplete 
            id="name-prefix-select"
            sx={{ marginTop: "5px"}}
            value={formData.name_prefix}
            onChange={handleCommonPrefixChange}
            options={commonPrefixOptions}
            label="คำนำหน้า"
            labelFontSize="15px"
          />
        </div>
        <div className="mr-[20px]">
          <TextBox
            sx={{ marginTop: "4px", fontSize: "15px" }}
            id="first-name"
            label="ชื่อ"
            placeHolder=""
            className="w-full"
            value={formData.firstname}
            onChange={(event) =>
              handleTextChange("firstname", event.target.value)
            }
          />
        </div>
        <div className="mr-[20px]">
          <TextBox
            sx={{ marginTop: "4px", fontSize: "15px" }}
            id="last-name"
            label="นามสกุล"
            placeHolder=""
            className="w-full"
            value={formData.lastname}
            onChange={(event) =>
              handleTextChange("lastname", event.target.value)
            }
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
                {Object.keys(formData.imagesData).length > 0 ? (
                  <div className="relative w-full h-full">
                    {/* First Image (Full Size) */}
                    {formData.imagesData[0] && (
                      <div className="absolute inset-0">
                        <img
                          src={`${FILE_URL}${formData.imagesData[0].url}`}
                          alt="Uploaded 1"
                          className="object-contain w-full h-full"
                        />
                        <button
                          type="button"
                          className="absolute z-[52] top-2 right-2 text-white bg-red-500 rounded-full w-[30px] h-[30px] flex items-center justify-center hover:cursor-pointer"
                          onClick={() => handleDeleteImage(0, formData.imagesData[0].url)}
                        >
                          &times;
                        </button>
                      </div>
                    )}

                    {/* Second and Third Images (Bottom Left) */}
                    <div className="absolute bottom-2 left-2 flex gap-2">
                      {[1, 2].map(
                        (position) =>
                          formData.imagesData[position] && (
                            <div
                              key={position}
                              className="relative w-[80px] h-[60px] border border-white bg-tuna"
                            >
                              <img
                                src={`${FILE_URL}${formData.imagesData[position].url}`}
                                alt={`Uploaded ${position + 1}`}
                                className="object-contain w-full h-full"
                              />
                              <button
                                type="button"
                                className="absolute z-[52] top-[-5px] right-[-5px] text-white bg-red-500 rounded-full w-[20px] h-[20px] flex items-center justify-center hover:cursor-pointer"
                                onClick={() => handleDeleteImage(position, formData.imagesData[position].url)}
                              >
                                &times;
                              </button>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                ) : (
                  /* No Images */
                  <div className="flex flex-col justify-center items-center">
                    <Icon icon={Download} size={80} color="#999999" />
                    <span className="text-[18px] text-nobel mt-[20px]">
                      อัพโหลดรูปภาพ
                    </span>
                  </div>
                )}
                {/* Hidden File Input */}
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
            <div
              id="file-import-part"
              className="flex justify-end mt-[25px] space-x-2"
            >
              <button
                type="button"
                className="flex justify-center items-center bg-dodgerBlue rounded w-[140px] h-[40px] hover:cursor-pointer"
                onClick={handleImportFileClick}
              >
                <Icon icon={Upload} size={20} color="white" />
                <span className="ml-[5px]">Upload Files</span>
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
                  {formData.filesData.length > 0 ? (
                    formData.filesData.map((file, index) => (
                      <tr
                        key={`${file.title}-${index}`}
                        className={`h-[40px] ${
                          index % 2 === 0 ? "bg-swamp" : "bg-celtic"
                        } ${
                          index === formData.filesData.length - 1
                            ? "border-b border-white"
                            : "border-b-[1px] border-dashed border-gray-300"
                        }`}
                      >
                        <td className="font-medium text-center">
                          {getFileName(file.title, file.url)}
                        </td>
                        <td className="font-medium text-center">
                          {format(new Date(file.createdAt), "dd/MM/yyyy (hh:mm)")}
                        </td>
                        <td className="w-[30px]">
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(index, file.url)}
                            className="hover:opacity-80 transition-opacity hover:cursor-pointer"
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
        <div className="mr-[20px]">
          <TextBox
            sx={{ marginTop: "4px", fontSize: "15px" }}
            id="nation-number"
            label="หมายเลขบัตรประชาชน"
            placeHolder=""
            className="w-full"
            value={formatThaiID(formData.nation_number)}
            onChange={handleNationNumberChange}
          />
        </div>
        <div className="mr-[20px] col-span-2">
          <TextBox
            sx={{ marginTop: "4px", fontSize: "15px" }}
            id="address"
            label="ที่อยู่"
            placeHolder=""
            className="w-full"
            value={formData.address}
            onChange={(event) =>
              handleTextChange("address", event.target.value)
            }
          />
        </div>
        {/* Row 3 */}
        <div className="col-start-1 mr-[20px]">
          <AutoComplete 
            id="provice-select"
            sx={{ marginTop: "5px"}}
            value={formData.province_id}
            onChange={handleProvicesChange}
            options={provincesOptions}
            label="จังหวัด"
            labelFontSize="15px"
          />
        </div>
        <div className="mr-[20px]">
          <AutoComplete 
            id="distict-select"
            sx={{ marginTop: "5px"}}
            value={formData.district_id}
            onChange={handleDistrictChange}
            options={districtsOptions}
            label="อำเภอ"
            labelFontSize="15px"
            disabled={formData.province_id === 0 || formData.province_id === "" ? true : false}
          />
        </div>
        <div className="mr-[20px]">
          <AutoComplete 
            id="sub-distict-select"
            sx={{ marginTop: "5px"}}
            value={formData.sub_district_id}
            onChange={handleSubDistrictChange}
            options={subDistrictsOptions}
            label="ตำบล"
            labelFontSize="15px"
            disabled={formData.district_id === 0 || formData.district_id === "" ? true : false}
          />
        </div>
        {/* Row 4 */}
        <div className="col-start-1 mr-[20px]">
          <TextBox
            sx={{ marginTop: "4px", fontSize: "15px" }}
            id="postal-code"
            label="รหัสไปรษณีย์"
            placeHolder=""
            className="w-full"
            value={formData.postal_code}
            onChange={handlePostalCodeChange}
          />
        </div>
        <div className="mr-[20px] col-span-2">
          <AutoComplete 
            id="select-person-type"
            sx={{ marginTop: "10px"}}
            value={formData.person_class_id}
            onChange={handlePersonTypeChange}
            options={personTypesOptions}
            label="ประเภทบุคคล"
            labelFontSize="15px"
          />
        </div>
        {/* Row 5 */}
        <div className="col-start-1 mr-[20px]">
          <TextBox
            sx={{ marginTop: "4px", fontSize: "15px" }}
            id="case-id"
            label="หมายเลขคดี"
            placeHolder=""
            className="w-full"
            value={formData.case_number}
            onChange={(event) =>
              handleTextChange("case_number", event.target.value)
            }
            disabled={!isBlackListType}
          />
        </div>
        <div className="mr-[20px]">
          <label>วันที่ออกหมายจับ</label>
          <DatePickerBuddhist
            value={formData.arrest_warrant_date}
            sx={{
              marginTop: "8px",
              borderRadius: "5px",
              backgroundColor: "white",
              "& .MuiTextField-root": {
                height: "fit-content",
              },
              "& .MuiOutlinedInput-input": {
                fontSize: 14
              }
            }}
            className="w-full"
            id="start-arrest-date"
            onChange={(value) => handleStartArrestDateChange(value)}
            disabled={!isBlackListType}
          >
          </DatePickerBuddhist>
        </div>
        <div className="mr-[20px]">
          <label>วันที่สิ้นสุดออกหมายจับ</label>
          <DatePickerBuddhist
            value={formData.arrest_warrant_expire_date}
            sx={{
              marginTop: "8px",
              borderRadius: "5px",
              backgroundColor: "white",
              "& .MuiTextField-root": {
                height: "fit-content",
              },
              "& .MuiOutlinedInput-input": {
                fontSize: 14
              }
            }}
            className="w-full"
            id="end-arrest-date"
            onChange={(value) => handleEndArrestDateChange(value)}
            disabled={!isBlackListType}
          >
          </DatePickerBuddhist>
        </div>
        {/* Row 6 */}
        <div className="col-start-1 col-span-3 mr-[20px]">
          <label>พฤติการ</label>
          <Textarea
            className="resize-none w-full h-[100px] text-start text-wrap text-black mt-[10px] bg-white rounded-[5px]"
            name="behavior"
            value={formData.behavior}
            onChange={(e) => handleInputChange(e)}
            disabled={!isBlackListType}
          />
        </div>
        {/* Row 7 */}
        <div className="col-start-1 mr-[20px]">
          <TextBox
            sx={{ marginTop: "5px", fontSize: "15px" }}
            id="case-owner-name"
            label="เจ้าของข้อมูล"
            placeHolder=""
            className="w-full"
            value={formData.case_owner_name}
            onChange={(event) =>
              handleTextChange("case_owner_name", event.target.value)
            }
          />
        </div>
        <div className="mr-[20px]">
          <TextBox
            sx={{ marginTop: "5px", fontSize: "15px" }}
            id="case-owner-agency"
            label="หน่วยงาน"
            placeHolder=""
            className="w-full"
            value={formData.case_owner_agency}
            onChange={(event) =>
              handleTextChange("case_owner_agency", event.target.value)
            }
          />
        </div>
        <div className="mr-[20px]">
          <TextBox
            sx={{ marginTop: "5px", fontSize: "15px" }}
            id="case-owner-phone"
            label="เบอร์ติดต่อ"
            placeHolder=""
            className="w-full"
            value={formData.case_owner_phone}
            onChange={handlePhoneChange}
          />
        </div>
        {/* Row 8 */}
        <div className="col-start-1 flex items-center justify-start mt-[10px]">
          <Checkbox
            id="active-checkbox"
            className="border-[1px] border-white mr-[10px] w-[26px] h-[26px]"
            value={formData.active}
            checked={formData.active === 1}
            onCheckedChange={handleCheckboxChange}
          />
          <label className="text-[15px]">Active</label>
        </div>
        {/* Row 9 */}
        <div className="col-start-3 row-start-8 flex items-center justify-end mr-[20px] mt-[50px]">
          <button
            type="button"
            className="bg-dodgerBlue w-[90px] h-[40px] rounded mr-[10px] focus:cursor-pointer"
            onClick={handleSaveClick}
          >
            <span>บันทึก</span>
          </button>
          <button
            type="button"
            className="bg-white border-[1px] border-dodgerBlue text-dodgerBlue w-[90px] h-[40px] rounded cursor-pointer"
            onClick={handleCancelButton}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageSpecialSuspectPerson
