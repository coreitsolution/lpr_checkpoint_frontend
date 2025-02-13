import { useState } from 'react'
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../app/store"
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'

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
} from '../../../features/suspect-people/SuspectPeopleDataTypes'
import { FileUploadDetail } from "../../../features/file-upload/fileUploadTypes"

// API
import { 
  postSpecialSuspectPeopleDataThunk
} from "../../../features/suspect-people/SuspectPeopleDataSlice"

// Utils
import { PopupMessage } from "../../../utils/popupMessage"

// Components
import FilesUpload from '../../../components/import-files/FilesUpdate'
import ImagesUpload from '../../../components/import-files/ImagesUpload'

dayjs.extend(buddhistEra)

interface UploadFileProps {
  closeDialog: () => void
}

const UploadFile: React.FC<UploadFileProps> = ({closeDialog}) => {
  const dispatch: AppDispatch = useDispatch()
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
        console.log("row", row)
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
  
        await dispatch(postSpecialSuspectPeopleDataThunk(updatedFormData)).unwrap()
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

  const handleConfirmClick = () => {
    const importableData = finalList.filter(item => !item.cannotImport)
    addNewSpecialSuspectPeople(importableData)
  }

  return (
    <div id='upload-file' className='h-[75vh]'>
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
  )
}

export default UploadFile