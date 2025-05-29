import React, {useMemo, useState, useEffect} from 'react'
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from "@mui/material/IconButton"
import { useSelector } from "react-redux"
import { RootState } from "../../../app/store"

// Icon
import { Icon } from '../../../components/icons/Icon'
import { Trash2 } from 'lucide-react'

// Types
import {
  ImportSpecialPlates,
  ImportSpecialPlatesDetail,
} from "../../../features/registration-data/RegistrationDataTypes"
import { FileUploadDetail } from "../../../features/file-upload/fileUploadTypes"

// Config
import { getUrls } from '../../../config/runtimeConfig';

// Component
import Loading from "../../../components/loading/Loading"

// Utils
import { getFileNameWithoutExtension } from "../../../utils/comonFunction"

dayjs.extend(buddhistEra)

interface ConfirmationProps {
  setFinalDataList: (data: ImportSpecialPlatesDetail[]) => void
  filesDataList: FileUploadDetail[]
  imagesDataList: FileUploadDetail[]
  textsDataList: ImportSpecialPlates[]
}

const Confirmation: React.FC<ConfirmationProps> = ({setFinalDataList, filesDataList, imagesDataList, textsDataList}) => {
  const { FILE_URL } = getUrls();
  const { provinces, dataStatus, registrationTypes } = useSelector(
    (state: RootState) => state.dropdown
  )
  const [isLoading, setIsLoading] = useState(false)

  const convertedData = useMemo(() => {
    if (!textsDataList.length) return []
    
    return textsDataList.map((data) => {

      const matchedImage = imagesDataList.find((image) => 
        getFileNameWithoutExtension(image.originalName) === getFileNameWithoutExtension(data.imagesData)
      )
      
      const matchedFile = filesDataList.find((file) => 
        getFileNameWithoutExtension(file.originalName) === getFileNameWithoutExtension(data.filesData)
      )

      const provinceName = data.province === "กทม" || data.province === "กทม." ? "กรุงเทพมหานคร" : data.province
      const province = provinces?.data?.find((province) => province.name_th === provinceName)
      const registrationType = registrationTypes?.data?.find((type) => type.title_en.toLowerCase() === data.plate_class.toLowerCase())
      const status = dataStatus.find((status) => status.status.toLowerCase() === data.active.toLowerCase())
      
      return {
        id: data.id,
        plate_group: data.plate_group,
        plate_number: data.plate_number,
        province: province?.name_th || "ไม่พบข้อมูล",
        province_id: province?.id || 0,
        plate_class: registrationType?.title_en || "ไม่พบข้อมูล",
        plate_class_id: registrationType?.id || 0,
        case_number: data.case_number,
        arrest_warrant_date: data.arrest_warrant_date,
        arrest_warrant_expire_date: data.arrest_warrant_expire_date,
        behavior: data.behavior,
        case_owner_name: data.case_owner_name,
        case_owner_agency: data.case_owner_agency,
        case_owner_phone: data.case_owner_phone,
        imagesData: data.imagesData,
        filesData: data.filesData,
        visible: 1,
        activeString: status?.status || "ไม่พบข้อมูล",
        active: status?.id || 0,
        imagesUploadedData: matchedImage,
        fileUploadedData: matchedFile,
        cannotImport: !province || !registrationType || !status
      }
    })
  }, [textsDataList, provinces, registrationTypes, dataStatus, imagesDataList, filesDataList])
  

  const [confirmationData, setConfirmationData] = useState<ImportSpecialPlatesDetail[]>([])
  
  useEffect(() => {
    if (JSON.stringify(confirmationData) !== JSON.stringify(convertedData)) {
      setConfirmationData(convertedData)
      setFinalDataList(convertedData)
    }
  }, [convertedData, setFinalDataList])

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [])

  const handleDeleteData = (indexToDelete: number) => {
    const updatedData = confirmationData.filter((_, index) => index !== indexToDelete)
    setConfirmationData(updatedData)
    setFinalDataList(updatedData)
  }

  return (
    <div id='text-upload'>
      {isLoading && <Loading />}
      <div className='flex flex-col h-full'>
        <div className="flex-grow overflow-x-auto">
          <TableContainer component={Paper} className="mt-4 h-[60vh] w-[2500px]"
            sx={{
              backgroundColor: "#000000"
            }}
          >
            <Table stickyHeader>
              <TableHead 
                sx={{
                  "& .MuiTableCell-head": {
                    color: "white",
                    backgroundColor: "#242727"
                  },
                }}
              >
                <TableRow>
                  <TableCell>ลำดับ</TableCell>
                  <TableCell>หมวดอักษร</TableCell>
                  <TableCell>เลขทะเบียน</TableCell>
                  <TableCell>จังหวัด</TableCell>
                  <TableCell>กลุ่มทะเบียน</TableCell>
                  <TableCell>หมายเลขคดี</TableCell>
                  <TableCell>วันที่ออกหมายจับ</TableCell>
                  <TableCell>วันที่สิ้นสุดออกหมายจับ</TableCell>
                  <TableCell>พฤติการ</TableCell>
                  <TableCell>เจ้าของข้อมูล</TableCell>
                  <TableCell>หน่วยงาน</TableCell>
                  <TableCell>เบอร์ติดต่อ</TableCell>
                  <TableCell>รูปรถ/ทะเบียน</TableCell>
                  <TableCell>ไฟล์</TableCell>
                  <TableCell>สถานะ</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  "& .MuiTableCell-body": {
                    color: "white",
                  }
                }}
              >
                {
                  confirmationData.map((data, index) => {
                    const imageUrl = data.imagesUploadedData ? `${FILE_URL}${data.imagesUploadedData.url}` : ""
                    const fileUrl = data.fileUploadedData ? data.fileUploadedData.originalName : ""

                    return (
                      <TableRow key={index} className="relative" sx={{ opacity: data.cannotImport ? 0.8 : 1 }}>
                        <TableCell sx={{ backgroundColor: "#393B3A" }}>{index + 1}</TableCell>
                        <TableCell sx={{ backgroundColor: "#48494B" }}>{data.plate_group}</TableCell>
                        <TableCell sx={{ backgroundColor: "#393B3A" }}>{data.plate_number}</TableCell>
                        <TableCell sx={{ backgroundColor: "#48494B" }}>{data.province}</TableCell>
                        <TableCell sx={{ backgroundColor: "#393B3A" }}>{data.plate_class}</TableCell>
                        <TableCell sx={{ backgroundColor: "#48494B" }}>{data.case_number || "-"}</TableCell>
                        <TableCell sx={{ backgroundColor: "#393B3A" }}>
                          {data.arrest_warrant_date ? dayjs(data.arrest_warrant_date).format("DD/MM/YYYY") : "-"}
                        </TableCell>
                        <TableCell sx={{ backgroundColor: "#48494B" }}>
                          {data.arrest_warrant_expire_date ? dayjs(data.arrest_warrant_expire_date).format("DD/MM/YYYY") : "-"}
                        </TableCell>
                        <TableCell sx={{ backgroundColor: "#393B3A" }}>{data.behavior || "-"}</TableCell>
                        <TableCell sx={{ backgroundColor: "#48494B" }}>{data.case_owner_name}</TableCell>
                        <TableCell sx={{ backgroundColor: "#393B3A" }}>{data.case_owner_agency}</TableCell>
                        <TableCell sx={{ backgroundColor: "#48494B", textWrap: "nowrap" }}>{data.case_owner_phone}</TableCell>
                        <TableCell sx={{ backgroundColor: "#393B3A", textAlign: "center" }}>
                          {imageUrl ? (
                            <div>
                              <img
                                key={index}
                                src={imageUrl}
                                alt={`image-${index}`}
                                className="inline-flex items-center justify-center align-middle h-[50px] w-[60px]"
                              />
                            </div>
                          ) : (
                            "ไม่พบข้อมูล"
                          )}
                        </TableCell>
                        <TableCell sx={{ backgroundColor: "#48494B" }}>{fileUrl || "ไม่พบข้อมูล"}</TableCell>
                        <TableCell sx={{ backgroundColor: "#393B3A" }}>{data.activeString}</TableCell>
                        <TableCell sx={{ backgroundColor: "#48494B" }}>
                          <IconButton 
                            onClick={() => handleDeleteData(index)}
                            >
                            <Icon icon={Trash2} size={20} color="#FFFFFF" />
                          </IconButton>
                        </TableCell>

                        {data.cannotImport && (
                          <TableCell
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(72, 73, 75, 0.8)", // Semi-transparent overlay
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontWeight: "bold",
                              color: "#F0B70E !important",
                              zIndex: 1,
                            }}
                            colSpan={15}
                          >
                            ไม่สามารถเพิ่มข้อมูลได้ หรือ ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบไฟล์อีกครั้ง
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  )
}

export default Confirmation