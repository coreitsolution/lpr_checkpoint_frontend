import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material"

// Components
import FileImportBreadCrumbs from '../../../components/breadcrumbs/FileImportBreadCrumbs'

// Modules
import TextUpload from "./TextUpload"
import Confirmation from './Confirmation'

// Types
import {
  ImportSuspectPeople,
  ImportSuspectPeopleDetail,
  NewSuspectPeople,
  SuspectPeopleRespondsDetail,
} from '../../../features/suspect-people/SuspectPeopleDataTypes'
import { FileUploadDetail, DeleteRequestData, FileDelete } from "../../../features/file-upload/fileUploadTypes"

// Utils
import { PopupMessage } from "../../../utils/popupMessage"
import { fetchClient, combineURL } from "../../../utils/fetchClient"

// Components
import FilesUpload from '../../../components/import-files/FilesUpdate'
import ImagesUpload from '../../../components/import-files/ImagesUpload'
import Loading from "../../../components/loading/Loading"

// Config
import { getUrls } from '../../../config/runtimeConfig';

dayjs.extend(buddhistEra)

interface UploadFileProps {
  open: boolean
  closeDialog: () => void
  isFileImportClose: boolean
}

const UploadFile: React.FC<UploadFileProps> = ({open, closeDialog, isFileImportClose}) => {
  const { API_URL } = getUrls();

  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [imagesList, setImagesList] = useState<FileUploadDetail[]>([])
  const [filesList, setFilesList] = useState<FileUploadDetail[]>([])
  const [textsList, setTextsList] = useState<ImportSuspectPeople[]>([])
  const [finalList, setFinalList] = useState<ImportSuspectPeopleDetail[]>([])
  const breadcrumbItems = [
    { label: "อัปโหลดรูป", isCompleted: step > 0, isActive: step === 0 },
    { label: "อัปโหลดไฟล์เอกสาร", isCompleted: step > 1, isActive: step === 1 },
    { label: "อัปโหลดข้อมูล Excel", isCompleted: step > 2, isActive: step === 2 },
    { label: "ยืนยัน", isCompleted: step > 3, isActive: step === 3 },
  ]

  useEffect(() => {
    if (isFileImportClose) {
      const deleteAllFiles = async () => {
        setIsLoading(true)
        for (const image of imagesList) {
          await handleDeleteFile(image.url);
        }
        for (const file of filesList) {
          await handleDeleteFile(file.url);
        }
        setIsLoading(false)
        closeDialog()
      };
      deleteAllFiles();
    }
  }, [isFileImportClose]);

  const nextStep = () => {
    if (step < breadcrumbItems.length - 1) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const setImagesDataList = (data: FileUploadDetail[]) => {
    setImagesList(data)
  }

  const setFilesDataList = (data: FileUploadDetail[]) => {
    setFilesList(data)
  }

  const setTextsDataList = (data: ImportSuspectPeople[]) => {
    setTextsList(data)
  }

  const setFinalDataList = (data: ImportSuspectPeopleDetail[]) => {
    const dataIds = new Set(data.map(item => item.id))
    setTextsList((prevData) => prevData.filter(item => dataIds.has(item.id)))
    setFinalList(data)
  }

  const addNewSpecialSuspectPeople = async (data: ImportSuspectPeopleDetail[]) => {
    try {
      let complete = false
      for (const row of data) {
        const updatedFormData: NewSuspectPeople = {
          arrest_warrant_date: dayjs(row.arrest_warrant_date).format("yyyy-MM-dd"),
          arrest_warrant_expire_date: dayjs(row.arrest_warrant_expire_date).format("yyyy-MM-dd"),
          title_id: row.name_prefix_id,
          firstname: row.firstname,
          lastname: row.lastname,
          idcard_number: row.nation_number,
          address: row.address,
          province_id: row.province_id,
          district_id: row.district_id,
          subdistrict_id: row.sub_district_id,
          zipcode: row.postal_code,
          imagesData: row.imagesUploadedData ? 
            [{
              title: row.imagesUploadedData.title,
              url: row.imagesUploadedData.url,
            }] : []
          ,
          case_number: row.case_number,
          behavior: row.behavior,
          active: row.active,
          case_owner_phone: row.case_owner_phone,
          case_owner_name: row.case_owner_name,
          person_class_id: row.person_class_id,
          case_owner_agency: row.case_owner_agency,
          filesData: row.fileUploadedData ? 
            [{
              title: row.fileUploadedData.title,
              url: row.fileUploadedData.url,
            }] : []
          ,
          visible: 1,
          notes: "",
        }
  
        await fetchClient<SuspectPeopleRespondsDetail>(combineURL(API_URL, "/watchlist/create"), {
          method: "POST",
          body: JSON.stringify(updatedFormData),
        });
        complete = true
      }
      if (complete) {
        closeDialog()
        PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success")
      }
    }
    catch (error) {
      PopupMessage("", "เกิดข้อผิดพลาดในการบันทึกข้อมูล", "error")
    }
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
      throw new Error(error instanceof Error ? error.message : String(error))
    }
  }

  const handleDeleteFile = async (url: string) => {
    try {
      await deleteFileUpload({
        url: url
      })
    }
    catch (error) {
      PopupMessage("เกิดข้อผิดพลาดในการลบไฟล์", error instanceof Error ? error.message : String(error), "error");
    }
  }

  const handleConfirmClick = async () => {
    const importableData = finalList.filter(item => !item.cannotImport)
    setIsLoading(true)
    await addNewSpecialSuspectPeople(importableData)

    // Delete unused images
    const usedImages = new Set(importableData.flatMap(item => item.imagesUploadedData?.url || []))
    const unusedImages = imagesList.filter(image => !usedImages.has(image.url))
    for (const image of unusedImages) {
      await handleDeleteFile(image.url)
    }

    // Delete unused files
    const usedFiles = new Set(importableData.flatMap(item => item.imagesUploadedData?.url || []))
    const unusedFiles = filesList.filter(image => !usedFiles.has(image.url))
    for (const file of unusedFiles) {
      await handleDeleteFile(file.url)
    }
    setIsLoading(false)
  }

  return (
    <Dialog id='upload-file' open={open} maxWidth="xl" fullWidth sx={{ zIndex: 1000 }}>
      <DialogTitle className='bg-black'>
        <div className="flex justify-between items-center">
          <div>
            <Typography variant="h5" color="white" className="font-bold">นำเข้าข้อมูล</Typography>
          </div>
          <button
            onClick={closeDialog} 
            className="text-white bg-transparent border-0 text-[28px] pr-6"
          >
            &times;
          </button>
        </div>
      </DialogTitle>
      <DialogContent className='bg-black text-white'>
        <div className='h-[75vh]'>
          {isLoading && <Loading />}
          <FileImportBreadCrumbs items={breadcrumbItems} />
          <div className="mt-4">
            {step === 0 && <ImagesUpload setImagesDataList={setImagesDataList} imagesDataList={imagesList}/>}
            {step === 1 && <FilesUpload setFilesDataList={setFilesDataList} filesDataList={filesList}/>}
            {step === 2 && <TextUpload setTextsDataList={setTextsDataList} textsDataList={textsList} />}
            {step === 3 && 
            <Confirmation 
              setFinalDataList={setFinalDataList} 
              textsDataList={textsList}
              imagesDataList={imagesList}
              filesDataList={filesList}
            />}
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            {step > 0 && (
              <button
                className="px-4 py-2 text-white bg-gray-500 rounded-[5px] hover:bg-gray-700"
                onClick={prevStep}
              >
                ย้อนกลับ
              </button>
            )}
            {step < breadcrumbItems.length - 1 && (
              <button
                className="px-4 py-2 text-white bg-dodgerBlue rounded-[5px] hover:bg-blue-500"
                onClick={nextStep}
              >
                ถัดไป
              </button>
            )}
            {step === breadcrumbItems.length - 1 && (
              <button
                className="px-4 py-2 text-white bg-dodgerBlue rounded-[5px] hover:bg-blue-500 disabled:bg-slate-400"
                onClick={handleConfirmClick}
                disabled={!finalList.some(item => !item.cannotImport)}
              >
                ยืนยัน
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UploadFile