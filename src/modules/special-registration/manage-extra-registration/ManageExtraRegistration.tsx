import React, { useState, useRef, useEffect, useCallback } from "react"
import { PopupMessage, PopupMessageWithCancel } from "../../../utils/popupMessage"
import { format, parse } from "date-fns"
import { useSelector } from "react-redux"
import { RootState } from "../../../app/store"
import { getUrls } from '../../../config/runtimeConfig';
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material"
import { useForm } from "react-hook-form";
import { fetchClient, combineURL } from "../../../utils/fetchClient"

// Components
import { Checkbox } from "../../../components/ui/checkbox"
import { Textarea } from "../../../components/ui/textarea"
import TextBox from "../../../components/text-box/TextBox"
import Loading from "../../../components/loading/Loading"
import AutoComplete from "../../../components/auto-complete/AutoComplete"
import DatePickerBuddhist from "../../../components/date-picker-buddhist/DatePickerBuddhist"

// Types
import {
  FileData,
  SpecialPlatesRespondsDetail,
  FileRespondsData,
  NewFileRespondsData,
  NewSpecialPlates,
} from "../../../features/registration-data/RegistrationDataTypes"
import { 
  DeleteRequestData, 
  FileUpload, 
  FileDelete 
} from "../../../features/file-upload/fileUploadTypes"

// Icon
import { Icon } from "../../../components/icons/Icon"
import { Download, Upload, Trash2 } from "lucide-react"

// Utils
import { formatPhone, getId } from "../../../utils/commonFunction"
// i18n
import { useTranslation } from "react-i18next";

interface ManageExtraRegistrationProps {
  open: boolean
  closeDialog: () => void
  selectedRow: SpecialPlatesRespondsDetail | null
  isEditMode: boolean
}

interface FormData {
  plate_group: string
  plate_number: string
  province_id: number
  imagesData: {
    [key: number]: FileData
  }
  case_number: string
  arrest_warrant_date: Date | null
  arrest_warrant_expire_date: Date | null
  behavior: string
  case_owner_name: string
  case_owner_phone: string
  plate_class_id: number
  case_owner_agency: string
  active: number
  filesData: FileRespondsData[] | NewFileRespondsData[]
  visible: number
}

const ManageExtraRegistration: React.FC<ManageExtraRegistrationProps> = ({
  open,
  closeDialog,
  selectedRow,
  isEditMode,
}) => {
  // i18n
  const { t, i18n } = useTranslation();

  const [isLoading, setIsLoading] = useState(false)
  const hiddenFileInput = useRef<HTMLInputElement | null>(null)
  const [originalData, setOriginalData] = useState<FormData | null>(
    null
  )
  const [registrationTypesOptions, setRegistrationTypesOptions] = useState<{ label: string, value: number }[]>([])
  const [provincesOptions, setProvincesOptions] = useState<{ label: string, value: number }[]>([])
  const [isBlackListType, setIsBlackListType] = useState(true)

  const { IMAGE_URL, API_URL } = getUrls();
  const { provinces, registrationTypes } = useSelector(
    (state: RootState) => state.dropdown
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();

  useEffect(() => {
    if (registrationTypes && registrationTypes.data) {
      const options = registrationTypes.data.map((row) => ({
        label: row.title_en,
        value: row.id,
      }))
      setRegistrationTypesOptions(options)
    }
  }, [registrationTypes])

  useEffect(() => {
    if (provinces && provinces.data) {
      const options = provinces.data.map((row) => ({
        label: i18n.language === "th" ? row.name_th : row.name_en,
        value: row.id,
      }))
      setProvincesOptions(options)
    }
  }, [provinces, i18n.language])

  const [formData, setFormData] = useState<FormData>({
    plate_group: "",
    plate_number: "",
    province_id: 0,
    imagesData: {},
    case_number: "",
    arrest_warrant_date: null,
    arrest_warrant_expire_date: null,
    behavior: "",
    case_owner_name: "",
    case_owner_phone: "",
    plate_class_id: 0,
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
        plate_group: selectedRow.plate_group,
        plate_number: selectedRow.plate_number,
        province_id: selectedRow.province_id,
        imagesData: selectedRow.special_plate_images,
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
        plate_class_id: selectedRow.plate_class_id,
        case_owner_agency: selectedRow.case_owner_agency,
        active: selectedRow.active,
        filesData: selectedRow.special_plate_files,
        visible: 1,
      }
      checkIsBlackListType(selectedRow.plate_class_id)
      setFormData(data)
      setOriginalData(data)

      setValue("plate_group", selectedRow.plate_group);
      setValue("plate_number", selectedRow.plate_number);
      setValue("province_id", selectedRow.province_id);
      setValue("case_number", selectedRow.case_number);
      setValue("arrest_warrant_date", parseDateString(selectedRow.arrest_warrant_date));
      setValue("arrest_warrant_expire_date", parseDateString(selectedRow.arrest_warrant_expire_date));
      setValue("behavior", selectedRow.behavior);
      setValue("case_owner_name", selectedRow.case_owner_name);
      setValue("case_owner_phone", formatPhone(selectedRow.case_owner_phone));
      setValue("plate_class_id", selectedRow.plate_class_id);
      setValue("case_owner_agency", selectedRow.case_owner_agency);
      setValue("active", selectedRow.active);
    } 
    else {
      setFormData({
        plate_group: "",
        plate_number: "",
        province_id: 0,
        plate_class_id: 0,
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
      setValue("plate_group", "");
      setValue("plate_number", "");
      setValue("province_id", "");
      setValue("case_number", "");
      setValue("arrest_warrant_date", "");
      setValue("arrest_warrant_expire_date", "");
      setValue("behavior", "");
      setValue("case_owner_name", "");
      setValue("case_owner_phone", "");
      setValue("plate_class_id", "");
      setValue("case_owner_agency", "");
      setValue("active", 0);
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  }, [selectedRow, isEditMode])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

      const response = await fetchClient<FileUpload>(combineURL(API_URL, "/upload"), {
        method: "POST",
        isFormData: true,
        headers: { 
          Accept: 'application/json',
        },
        body: formData,
      })

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
      PopupMessage(t('message.error.error-while-uploading-data'), error instanceof Error ? error.message : String(error) , "error");
    }
  }

  const handleDeleteImage = async (position: number, url: string) => {
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
  }

  const handleTextChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setValue(key, value);
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
    setValue(name, value);
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
    setValue(name, value);
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      active: checked ? 1 : 0,
    })
    setValue("active", checked ? 1 : 0);
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

  const handleSaveClick = async (data: any) => {
    if (!hasChanges()) {
      PopupMessage(
        t('message.warning.no-change-found'),
        t('message.warning.data-not-change'),
        "warning"
      )
      return
    }

    try {
      const updatedFormData: NewSpecialPlates = {
        arrest_warrant_date: data.arrest_warrant_date
          ? format(data.arrest_warrant_date, "yyyy-MM-dd")
          : null,
        arrest_warrant_expire_date: data.arrest_warrant_expire_date
          ? format(data.arrest_warrant_expire_date, "yyyy-MM-dd")
          : null,
        plate_group: data.plate_group,
        plate_number: data.plate_number,
        province_id: getId(data.province_id),
        imagesData: formData.imagesData
          ? getImagesArrayWithoutNulls(convertImagesToArray(formData.imagesData))
          : [],
        case_number: data.case_number,
        behavior: data.behavior,
        active: data.active,
        case_owner_phone: data.case_owner_phone.replaceAll("-", ""),
        case_owner_name: data.case_owner_name,
        plate_class_id: getId(data.plate_class_id),
        case_owner_agency: data.case_owner_agency,
        filesData: formData.filesData,
        visible: 1,
      }

      if (isEditMode && selectedRow) {
        let title = t('message.warning.edit-confirmation')
        if (hasOnlyActiveChanged()) {
          title = t('message.warning.update-status-confirmation')
        }
        const confirmed = await PopupMessageWithCancel(title, t('message.warning.do-you-want-to-continue'), t('button.confirm'), t('button.cancel'), "warning")
        
        if (confirmed) {
          setIsLoading(true)
          // Update existing data
          const updateDataWithId = { 
            ...updatedFormData, 
            id: selectedRow.id,
            arrest_warrant_date: updatedFormData.arrest_warrant_date ? updatedFormData.arrest_warrant_date : "",
            arrest_warrant_expire_date: updatedFormData.arrest_warrant_expire_date ? updatedFormData.arrest_warrant_expire_date : "",
          }
          await fetchClient<SpecialPlatesRespondsDetail>(
            combineURL(API_URL, `/special-plates/update`),
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updateDataWithId),
            }
          )
        }
        else {
          return
        }
      } 
      else {
        setIsLoading(true)
        // Add new data
        await fetchClient<SpecialPlatesRespondsDetail>(combineURL(API_URL, "/special-plates/create"), {
          method: "POST",
          body: JSON.stringify(updatedFormData),
        });
      }
      PopupMessage(t('message.success.data-saved-successfully'), t('message.success.data-saved-successfully-detail'), "success")
      closeDialog()
    } 
    catch (error) {
      PopupMessage(t('message.error.error-while-saving-data'), (error as { message: string }).message || t('message.error.something-wrong-occur'), "error")
    }
    finally {
      setTimeout(() => {
        setIsLoading(false)
      })
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

        const response = await fetchClient<FileUpload>(combineURL(API_URL, "/upload"), {
          method: "POST",
          isFormData: true,
          headers: { 
            Accept: 'application/json',
          },
          body: formData,
        })
  
        if (response.data) {
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
        PopupMessage(t('message.error.error-while-uploading-data'), error instanceof Error ? error.message : String(error), "error")
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
      PopupMessage(t('message.error.error-while-deleting-data'), error instanceof Error ? error.message : String(error), "error");
    }
  }, [])

  const handleStartArrestDateChange = (date: Date | null) => {
    setFormData((prevState) => ({
      ...prevState,
      arrest_warrant_date: date,
    }))
    setValue("arrest_warrant_date", date);
  }

  const handleEndArrestDateChange = (date: Date | null) => {
    setFormData((prevState) => ({
      ...prevState,
      arrest_warrant_expire_date: date,
    }))
    setValue("arrest_warrant_expire_date", date);
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
      
    }
  }

  const handleCancelButton = async () => {
    const filesToDelete: string[] = []
  
    if (selectedRow && selectedRow.special_plate_images) {
      selectedRow.special_plate_images.forEach((image) => {
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

    clearData();
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
      console.error(t('message.error.extract-file-error', { error: error }))
      return `${title}.txt`
    }
  }

  const handleProvicesChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    handleSelectChange("province_id", value ? value.value : 0);
  };

  const checkIsBlackListType = (value: any) => {
    const type = registrationTypes?.data?.find((type) => type.id === value)?.title_en
    const isBlackList = !type || type.toLowerCase() === "blacklist" ? true : false
    setIsBlackListType(isBlackList);
    if (!isBlackList) {
      clearErrors("case_number")
      clearErrors("arrest_warrant_date")
      clearErrors("arrest_warrant_expire_date")
      clearErrors("behavior")
    }
  }

  const handleRegistrationTypeChange = (
    event: React.SyntheticEvent,
    value: { value: any; label: string } | null
  ) => {
    event.preventDefault()
    if (value) {
      handleSelectChange("plate_class_id", value.value)
      checkIsBlackListType(value.value)
      handleTextChange("case_number", "")
      handleStartArrestDateChange(null)
      handleEndArrestDateChange(null)
      setFormData((prevState) => ({
        ...prevState,
        ["behavior"]: "",
      }))
    }
    else {
      handleSelectChange("plate_class_id", "0")
      setIsBlackListType(true)
    }
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const cleaned = input.replace(/\D/g, '');
    
    if (cleaned.length <= 10) {
      const formatted = formatPhone(cleaned)
      handleTextChange("case_owner_phone", formatted)
    }
    return cleaned
  }

  const clearData = () => {
    setFormData({
      plate_group: "",
      plate_number: "",
      province_id: 0,
      imagesData: {},
      case_number: "",
      arrest_warrant_date: null,
      arrest_warrant_expire_date: null,
      behavior: "",
      case_owner_name: "",
      case_owner_phone: "",
      plate_class_id: 0,
      case_owner_agency: "",
      active: 0,
      filesData: [],
      visible: 1,
    })
    setValue("plate_group", "");
    setValue("plate_number", "");
    setValue("province_id", "");
    setValue("case_number", "");
    setValue("arrest_warrant_date", "");
    setValue("arrest_warrant_expire_date", "");
    setValue("behavior", "");
    setValue("case_owner_name", "");
    setValue("case_owner_phone", "");
    setValue("plate_class_id", "");
    setValue("case_owner_agency", "");
    setValue("active", 0);
    clearErrors();
  }
  
  return (
    <Dialog id="manage-extra-registration" open={open} maxWidth="xl" fullWidth sx={{ zIndex: 1000 }}>
      <DialogTitle className="text-[28px] text-white bg-black">{t('screen.manage-special-plate')}</DialogTitle>
      <DialogContent className="bg-black text-white">
        <form
          className="bg-black text-white p-[30px] border-[1px] border-dodgerBlue"
          onSubmit={handleSubmit(handleSaveClick)}
        >
          {isLoading && <Loading />}
          <div className="grid grid-cols-4 gap-x-2 gap-y-1 items-start justify-start">
            {/* Row 1 */}
            <div className="mr-[50px] mb-[30px]">
              <TextBox
                sx={{ marginTop: "10px", fontSize: "15px" }}
                id="letter-category"
                label={t('component.plate-character')}
                required={true}
                value={formData.plate_group}
                onChange={(event) =>
                  handleTextChange("plate_group", event.target.value)
                }
                register={register("plate_group", { 
                  required: true,
                })}
                error={!!errors.plate_group}
              />
            </div>
            <div className="mr-[50px]">
              <TextBox
                sx={{ marginTop: "10px", fontSize: "15px" }}
                id="car-registration"
                label={t('component.plate')}
                required={true}
                value={formData.plate_number}
                onChange={(event) =>
                  handleTextChange("plate_number", event.target.value)
                }
                register={register("plate_number", { 
                  required: true,
                })}
                error={!!errors.plate_number}
              />
            </div>
            <div className="mr-[20px]">
              <AutoComplete 
                id="provice-select"
                sx={{ marginTop: "10px"}}
                value={formData.province_id}
                onChange={handleProvicesChange}
                options={provincesOptions}
                label={t('component.province')}
                required={true}
                labelFontSize="15px"
                register={register("province_id", { 
                  required: true,
                })}
                error={!!errors.province_id}
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
                    { formData.imagesData && Object.keys(formData.imagesData).length > 0 ? (
                      <div className="relative w-full h-full">
                        {/* First Image (Full Size) */}
                        {formData.imagesData[0] && (
                          <div className="absolute inset-0">
                            <img
                              src={`${IMAGE_URL}${formData.imagesData[0].url}`}
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
                                    src={`${IMAGE_URL}${formData.imagesData[position].url}`}
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
                          {t('component.upload-image')}
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
                    <span className="ml-[5px]">{t('component.upload-file')}</span>
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
                      {formData.filesData && formData.filesData.length > 0 ? (
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
                          <td className="text-start pl-[10px]">{t('text.no-data')}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Row 2 */}
            <div className="mr-[50px] mb-[30px]">
              <AutoComplete 
                id="select-registration-type"
                sx={{ marginTop: "10px"}}
                value={formData.plate_class_id}
                onChange={handleRegistrationTypeChange}
                options={registrationTypesOptions}
                label={t('component.plate-type')}
                required={true}
                labelFontSize="15px"
                register={register("plate_class_id", { 
                  required: true,
                })}
                error={!!errors.plate_class_id}
              />
            </div>
            {/* Row 3 */}
            <div className="col-start-1 mr-[50px] mb-[30px]">
              <TextBox
                sx={{ marginTop: "10px", fontSize: "15px" }}
                id="case-id"
                label={t('component.case-number')}
                value={formData.case_number}
                onChange={(event) =>
                  handleTextChange("case_number", event.target.value)
                }
                disabled={!isBlackListType}
                register={register("case_number", { 
                  required: isBlackListType ? true : false,
                })}
                error={!!errors.case_number}
              />
            </div>
            <div className="mr-[50px] mb-[30px] pt-[3px]">
              <label>{t('component.date-arrest-warrant')}</label>
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
                register={register("arrest_warrant_date", { 
                  required: isBlackListType ? true : false,
                })}
                error={!!errors.arrest_warrant_date}
              >
              </DatePickerBuddhist>
            </div>
            <div className="mr-[20px] mb-[30px] pt-[3px]">
              <label>{t('component.date-expiration-arrest-warrant')}</label>
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
                register={register("arrest_warrant_expire_date", { 
                  required: isBlackListType ? true : false,
                })}
                error={!!errors.arrest_warrant_expire_date}
              >
              </DatePickerBuddhist>
            </div>
            {/* Row 4 */}
            <div className="col-start-1 col-span-3 mr-[20px] mb-[30px]">
              <label>{t('component.behavior')}</label>
              <Textarea
                className="resize-none w-full h-[100px] text-start text-wrap text-black mt-[15px] bg-white rounded-[5px]"
                name="behavior"
                value={formData.behavior}
                onChange={(e) => handleInputChange(e)}
                disabled={!isBlackListType}
                register={register("behavior", { 
                  required: isBlackListType ? true : false,
                })}
                error={!!errors.behavior}
              />
            </div>
            {/* Row 5 */}
            <div className="col-start-1 mr-[50px] mb-[30px]">
              <TextBox
                sx={{ marginTop: "10px", fontSize: "15px" }}
                id="case-owner-name"
                label={t('component.owner-data')}
                value={formData.case_owner_name}
                onChange={(event) =>
                  handleTextChange("case_owner_name", event.target.value)
                }
                register={register("case_owner_name", { 
                  required: true,
                })}
                error={!!errors.case_owner_name}
              />
            </div>
            <div className="mr-[50px] mb-[30px]">
              <TextBox
                sx={{ marginTop: "10px", fontSize: "15px" }}
                id="case-owner-agency"
                label={t('component.owner-agency')}
                value={formData.case_owner_agency}
                onChange={(event) =>
                  handleTextChange("case_owner_agency", event.target.value)
                }
                register={register("case_owner_agency", { 
                  required: true,
                })}
                error={!!errors.case_owner_agency}
              />
            </div>
            <div className="mr-[20px] mb-[30px]">
              <TextBox
                sx={{ marginTop: "10px", fontSize: "15px" }}
                id="case-owner-phone"
                label={t('component.contact-number')}
                value={formData.case_owner_phone}
                onChange={handlePhoneChange}
                register={register("case_owner_phone", { 
                  required: true,
                })}
                error={!!errors.case_owner_phone}
              />
            </div>
            {/* Row 6 */}
            <div className="col-start-1 flex items-center justify-start">
              <Checkbox
                id="active-checkbox"
                className="border-[1px] border-white mr-[10px] w-[26px] h-[26px]"
                value={formData.active}
                checked={formData.active === 1}
                onCheckedChange={handleCheckboxChange}
              />
              <label className="text-[15px]">{t('component.status-active')}</label>
            </div>
            {/* Row 7 */}
            <div className="col-start-3 row-start-8 flex items-center justify-end mr-[20px]">
              <button
                type="submit"
                className="bg-dodgerBlue w-[90px] h-[40px] rounded mr-[10px] focus:cursor-pointer"
              >
                {t('button.confirm')}
              </button>
              <button
                type="button"
                className="bg-white border-[1px] border-dodgerBlue text-dodgerBlue w-[90px] h-[40px] rounded cursor-pointer"
                onClick={handleCancelButton}
              >
                {t('button.cancel')}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ManageExtraRegistration
