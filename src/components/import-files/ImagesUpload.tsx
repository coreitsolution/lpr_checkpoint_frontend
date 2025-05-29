import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PopupMessage } from "../../utils/popupMessage"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../app/store"
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from "@mui/material/IconButton";

// Icon
import { Icon } from '../../components/icons/Icon'
import { Trash2, FileSliders, FileText } from 'lucide-react'

// API
import {
  postFilesDataThunk,
  deleteFilesDataThunk,
} from "../../features/file-upload/fileUploadSlice"

// Types
import { DeleteRequestData, FileUploadDetail } from "../../features/file-upload/fileUploadTypes"

// Config
import { getUrls } from '../../config/runtimeConfig';

// Utils
import { getFileNameWithoutExtension } from "../../utils/comonFunction"

// Component
import Loading from "../../components/loading/Loading"

dayjs.extend(buddhistEra)

interface ImagesUploadProps {
  setImagesDataList: (data: FileUploadDetail[]) => void
  imagesDataList: FileUploadDetail[]
}

const ImagesUpload: React.FC<ImagesUploadProps> = ({setImagesDataList, imagesDataList}) => {
  const dispatch: AppDispatch = useDispatch()
  const { FILE_URL } = getUrls();
  const hiddenImageInput = useRef<HTMLInputElement | null>(null)
  const [filesData, setFilesData] = useState<FileUploadDetail[]>(imagesDataList)
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setImagesDataList(filesData)
  }, [filesData, setImagesDataList])

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    let fileArray = Array.from(files);
    const fileNames = new Set<string>();
    const duplicateFiles: string[] = [];

    fileArray = fileArray.filter((file) => {
      const fileName = getFileNameWithoutExtension(file.name)
      if (fileNames.has(fileName)) {
        duplicateFiles.push(fileName);
        return false;
      }
      fileNames.add(fileName);
      return true;
    });

    if (duplicateFiles.length > 0) {
      PopupMessage(
        "เกิดข้อผิดพลาด", 
        `พบไฟล์ชื่อซ้ำ: ${duplicateFiles.join(", ")}. กรุณาเปลี่ยนชื่อไฟล์ไม่ให้ซ้ำกัน`, 
        "error"
      );
      return;
    }
    console.time("handleImageUpload")
    try {
      const formData = new FormData()
      setIsLoading(true)
      fileArray.forEach(file => {
        formData.append("files", file) // Append each file individually
      })
      // Dispatch the thunk to upload files and await the response
      const response = await dispatch(
        postFilesDataThunk(formData)
      ).unwrap()

      if (response?.data) {
        const uploadedFiles: FileUploadDetail[] = response.data.map((file) => ({
          ...file,
          createdAt: new Date().toDateString(),
        }))

        setFilesData(uploadedFiles)
      }
      setIsLoading(false)
    }
    catch (error) {
      setIsLoading(false)
      PopupMessage("เกิดข้อผิดพลาดในการอัพโหลดไฟล์", error instanceof Error ? error.message : String(error), "error")
    }
    console.timeEnd("handleImageUpload")
    if (hiddenImageInput.current) {
      hiddenImageInput.current.value = ""
    }
  }, [dispatch])

  const deleteFileUpload = async (deleteFile: DeleteRequestData) => {
    try {
      await dispatch(
        deleteFilesDataThunk(deleteFile)
      ).unwrap()
    }
    catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error))
    }
  }

  const handleDeleteImage = useCallback(async (index: number, url: string) => {
    try {
      const deleteFile: DeleteRequestData = {
        url: url
      }
      await deleteFileUpload(deleteFile)

      setFilesData((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }
    catch (error) {
      PopupMessage("เกิดข้อผิดพลาดในการลบไฟล์", error instanceof Error ? error.message : String(error), "error");
    }
  }, [dispatch])

  const handleImportImageClick = () => {
    if (hiddenImageInput.current) {
      hiddenImageInput.current.click()
    }
  }

  return (
    <div id='images-upload'>
      {isLoading && <Loading />}
      <div className='flex flex-col h-full'>
        <div className='flex justify-end'>
          <button
            className='px-4 py-1 text-dodgerBlue border-[1px] border-dodgerBlue bg-white rounded-[5px] hover:bg-blue-500 hover:text-white'
            onClick={handleImportImageClick}
          >
            เลือกรูปภาพ
          </button>
          {/* Hidden File Input */}
          <input
            ref={hiddenImageInput}
            id="image-upload"
            type="file"
            name="images"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        <div className='flex justify-between items-center mt-[10px]'>
          <div className='flex items-center'>
            <img src="/icons/red-waring.png" alt="Warning" className='w-[20px] h-[20px]' />
            <label className='ml-2 text-white text-[12px] font-bold'>กรุณาเลือกไฟล์ทั้งหมด...(ถ้ามี)</label>
          </div>
          <div className='flex items-center space-x-2'>
            <div title='Detail View' className='cursor-pointer' onClick={() => setIsSimpleMode(false)}>
              <Icon icon={FileSliders} size={25} color="#FFFFFF" />
            </div>
            <div title='Simple View' className='cursor-pointer' onClick={() => setIsSimpleMode(true)}>
              <Icon icon={FileText} size={25} color="#FFFFFF" />
            </div>
          </div>
        </div>
        {
          !isSimpleMode ? 
          (
            <div className="flex-grow overflow-x-auto">
              <TableContainer component={Paper} className="mt-4 h-[55vh]"
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
                      <TableCell sx={{ width: "5%", textAlign: "center" }}>ลำดับ</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>ชื่อไฟล์</TableCell>
                      <TableCell sx={{ width: "10%", textAlign: "center" }}>ตัวอย่าง</TableCell>
                      <TableCell sx={{ width: "15%", textAlign: "center" }}>วันที่</TableCell>
                      <TableCell sx={{ width: "5%" }}></TableCell>
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
                      filesData && filesData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ backgroundColor: "#393B3A", textAlign: "center" }}>{index + 1}</TableCell>
                          <TableCell sx={{ backgroundColor: "#48494B" }}>{data.originalName}</TableCell>
                          <TableCell sx={{ backgroundColor: "#393B3A", textAlign: "center" }}>
                            <div>
                              <img key={index} src={`${FILE_URL}${data.url}`} alt={`image-${index + 1}`} className="inline-flex items-center justify-center align-middle h-[50px] w-[100px]" />
                            </div>
                          </TableCell>
                          <TableCell sx={{ backgroundColor: "#48494B", textAlign: "center" }}>{dayjs(data.createdAt).format('DD-MM-BBBB HH:mm:ss')}</TableCell>
                          <TableCell sx={{ backgroundColor: "#393B3A", textAlign: "center" }}>
                            <IconButton onClick={() => handleDeleteImage(index, data.url)}>
                              <Icon icon={Trash2} size={20} color="#FFFFFF" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) :
          (
            <div className='flex mt-4 h-[55vh] overflow-y-auto flex-wrap pt-2 space-x-2'>
              {
                filesData && filesData.map((data, index) => (
                  <div key={`divImage-${index + 1}`} className='flex flex-col relative justify-center h-[130px] w-[100px] text-center'>
                    <div className='flex flex-none w-[100px] h-[100px]'>
                      <img src={`${FILE_URL}${data.url}`} alt={`image-${index + 1}`} className='w-full h-full' />
                    </div>
                    <p title={`${index + 1}.${data.originalName}`} className='truncate'>{`${index + 1}.${data.originalName}`}</p>
                    <button
                      type="button"
                      className="absolute z-[52] top-[-5px] right-[-5px] text-center text-white bg-red-500 rounded-full w-[20px] h-[20px] flex items-center justify-center hover:cursor-pointer"
                      onClick={() => handleDeleteImage(index, data.url)}
                    >
                      &times;
                    </button>
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
    </div>
  )
}

export default ImagesUpload