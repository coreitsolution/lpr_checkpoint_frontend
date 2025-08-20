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
  ImportSpecialPlates,
  ImportSpecialPlatesDetail,
  NewSpecialPlates,
  SpecialPlatesRespondsDetail,
} from "../../../features/registration-data/RegistrationDataTypes"
import { FileUploadDetail, DeleteRequestData, FileDelete } from "../../../features/file-upload/fileUploadTypes"

// Utils
import { PopupMessage } from "../../../utils/popupMessage"
import { fetchClient, combineURL } from "../../../utils/fetchClient"

// Components
import FilesUpload from '../../../components/import-files/FilesUpdate'
import ImagesUpload from '../../../components/import-files/ImagesUpload'
import Loading from "../../../components/loading/Loading"

// i18n
import { useTranslation } from "react-i18next";

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

  // i18n
  const { t } = useTranslation();

  const [step, setStep] = useState(0)
  const [imagesList, setImagesList] = useState<FileUploadDetail[]>([])
  const [filesList, setFilesList] = useState<FileUploadDetail[]>([])
  const [textsList, setTextsList] = useState<ImportSpecialPlates[]>([])
  const [finalList, setFinalList] = useState<ImportSpecialPlatesDetail[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const breadcrumbItems = [
    { label: t('text.image-upload'), isCompleted: step > 0, isActive: step === 0 },
    { label: t('text.doc-file-upload'), isCompleted: step > 1, isActive: step === 1 },
    { label: t('text.excel-file-upload'), isCompleted: step > 2, isActive: step === 2 },
    { label: t('text.confirmation'), isCompleted: step > 3, isActive: step === 3 },
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

  const setTextsDataList = (data: ImportSpecialPlates[]) => {
    setTextsList(data)
  }

  const setFinalDataList = (data: ImportSpecialPlatesDetail[]) => {
    const dataIds = new Set(data.map(item => item.id))
    setTextsList((prevData) => prevData.filter(item => dataIds.has(item.id)))
    setFinalList(data)
  }

  const addNewSpecialRegistration = async (data: ImportSpecialPlatesDetail[]) => {
    try {
      let complete = false
      for (const row of data) {
        const updatedFormData: NewSpecialPlates = {
          arrest_warrant_date: dayjs(row.arrest_warrant_date).format("yyyy-MM-dd"),
          arrest_warrant_expire_date: dayjs(row.arrest_warrant_expire_date).format("yyyy-MM-dd"),
          plate_group: row.plate_group,
          plate_number: row.plate_number,
          province_id: row.province_id,
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
          plate_class_id: row.plate_class_id,
          case_owner_agency: row.case_owner_agency,
          filesData: row.fileUploadedData ? 
            [{
              title: row.fileUploadedData.title,
              url: row.fileUploadedData.url,
            }] : []
          ,
          visible: 1,
        }
  
        await fetchClient<SpecialPlatesRespondsDetail>(combineURL(API_URL, "/special-plates/create"), {
          method: "POST",
          body: JSON.stringify(updatedFormData),
        });
        complete = true
      }
      if (complete) {
        handleClose()
        PopupMessage(t('message.success.data-saved-successfully'), t('message.success.data-saved-successfully-detail'), "success")
      }
    }
    catch (error) {
      PopupMessage("", t('message.error.error-while-saving-data'), "error")
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
      PopupMessage(t('message.error.error-while-deleting-data'), error instanceof Error ? error.message : String(error), "error");
    }
  }

  const handleConfirmClick = async () => {
    const importableData = finalList.filter(item => !item.cannotImport)
    setIsLoading(true)
    await addNewSpecialRegistration(importableData)

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

  const handleClose = () => {
    setStep(0)
    setImagesList([])
    setFilesList([])
    setTextsList([])
    setFinalList([])
    closeDialog()
  }

  return (
    <Dialog id='upload-file' open={open} maxWidth="xl" fullWidth sx={{ zIndex: 1000 }}>
      <DialogTitle className='bg-black'>
        <div className="flex justify-between items-center">
          <div>
            <Typography variant="h5" color="white" className="font-bold">{t('button.import-data')}</Typography>
          </div>
          <button
            onClick={handleClose} 
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
                {t('button.previous')}
              </button>
            )}
            {step < breadcrumbItems.length - 1 && (
              <button
                className="px-4 py-2 text-white bg-dodgerBlue rounded-[5px] hover:bg-blue-500"
                onClick={nextStep}
              >
                {t('button.next')}
              </button>
            )}
            {step === breadcrumbItems.length - 1 && (
              <button
                className="px-4 py-2 text-white bg-dodgerBlue rounded-[5px] hover:bg-blue-500 disabled:bg-slate-400"
                onClick={handleConfirmClick}
                disabled={!finalList.some(item => !item.cannotImport)}
              >
                {t('button.confirm')}
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UploadFile