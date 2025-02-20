import React, {useRef, useState, useEffect} from 'react'
import * as XLSX from "xlsx"
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
import { Icon } from '../../../components/icons/Icon'
import { Trash2 } from 'lucide-react'

// Types
import {
  ImportSpecialPlates,
} from "../../../features/registration-data/RegistrationDataTypes"

// Utils
import { PopupMessage } from "../../../utils/popupMessage"
import { getFileNameWithoutExtension } from "../../../utils/comonFunction"

// Component
import Loading from "../../../components/loading/Loading"

dayjs.extend(buddhistEra)

interface TextUploadProps {
  setTextsDataList: (data: ImportSpecialPlates[]) => void
  textsDataList: ImportSpecialPlates[]
}

const TextUpload: React.FC<TextUploadProps> = ({setTextsDataList, textsDataList}) => {
  const hiddenFileInput = useRef<HTMLInputElement | null>(null)
  const [textsData, setTextsData] = useState<ImportSpecialPlates[]>(textsDataList)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setTextsDataList(textsData)
  }, [textsData, setTextsDataList])
  
  const handleClickImport = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click()
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      setIsLoading(true)
      const arrayBuffer = e.target?.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: ImportSpecialPlates[] = XLSX.utils.sheet_to_json(sheet);
      
      let fileImportError = "";
      const requiredFields = [
        "plate_group", "plate_number", "province", "plate_class",
        "case_owner_name", "case_owner_agency", "case_owner_phone"
      ];

      const fileNames = new Set<string>();
      const duplicateFiles: string[] = [];
      const imageNames = new Set<string>();
      const duplicateImages: string[] = [];

      // Validate data
      const validatedData = jsonData.map((row, index) => {
        const missingFields = requiredFields.filter((field) => !row[field as keyof ImportSpecialPlates]);

        // Additional validations for blacklist plate_class
        if (row.plate_class?.toLowerCase() === "blacklist") {
          if (!row.arrest_warrant_date) missingFields.push("arrest_warrant_date");
          if (!row.arrest_warrant_expire_date) missingFields.push("arrest_warrant_expire_date");
          if (!row.behavior) missingFields.push("behavior");
          if (!row.case_number) missingFields.push("case_number");
        }

        if (missingFields.length > 0) {
          fileImportError = `ช่องที่จำเป็นและไม่สามารถเว้นว่างไว้ได้: ${missingFields.join(", ")}`;
          return null;
        }

        // Check duplicate image
        const imageName = getFileNameWithoutExtension(row.filesData)
        if (fileNames.has(imageName)) {
          duplicateImages.push(imageName);
          fileImportError = `พบไฟล์ชื่อซ้ำ: ${duplicateImages.join(", ")}. กรุณาเปลี่ยนชื่อไฟล์ไม่ให้ซ้ำกัน`
          return null;
        }
        imageNames.add(imageName);

        // Check duplicate filename
        const fileName = getFileNameWithoutExtension(row.filesData)
        if (fileNames.has(fileName)) {
          duplicateFiles.push(fileName);
          fileImportError = `พบไฟล์ชื่อซ้ำ: ${duplicateImages.join(", ")}. กรุณาเปลี่ยนชื่อไฟล์ไม่ให้ซ้ำกัน`
          return null;
        }
        fileNames.add(fileName);

        return {
          id: index + 1,
          plate_group: row.plate_group,
          plate_number: row.plate_number,
          province: row.province,
          plate_class: row.plate_class,
          case_number: row.case_number || "",
          arrest_warrant_date: parseExcelDate(row.arrest_warrant_date),
          arrest_warrant_expire_date: parseExcelDate(row.arrest_warrant_expire_date),
          behavior: row.behavior || "",
          case_owner_name: row.case_owner_name,
          case_owner_agency: row.case_owner_agency,
          case_owner_phone: row.case_owner_phone,
          imagesData: row.imagesData,
          filesData: row.filesData,
          active: row.active,
        };
      }).filter(Boolean) as ImportSpecialPlates[];

      if (fileImportError) {
        PopupMessage("โหลดข้อมูลไม่สำเร็จ", fileImportError, "error");
      }
      else if (!fileImportError && validatedData && validatedData.length > 0) {
        setTextsData(validatedData as ImportSpecialPlates[]);
      }
      setIsLoading(false)
    };
    reader.readAsArrayBuffer(file);

    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = ""
    }
  };

  const handleDeleteData = (indexToDelete: number) => {
    setTextsData(prevData => prevData.filter((_, index) => index !== indexToDelete));
  };

  const parseExcelDate = (dateValue: any) => {
    if (!dateValue) {
      return ""
    }
    if (typeof dateValue === "number") {
      const date = new Date((dateValue - 25569) * 86400 * 1000);
      const year = date.getFullYear();
      const correctedYear = year >= 2500 ? year - 543 : year;

      return `${correctedYear}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }
    if (typeof dateValue === "string") {
      const [day, month, year] = dateValue.split("/");
      let numericYear = parseInt(year, 10);
      // Check if the year is in BE (Assume any year >= 2500 is BE)
      if (numericYear >= 2500) {
          numericYear -= 543;
      }

      return `${numericYear}-${month}-${day}`;
    }
  }

  return (
    <div id='text-upload'>
      {isLoading && <Loading />}
      <div className='flex flex-col h-full'>
        <div className='flex justify-end'>
          <button
            className='px-4 py-1 text-dodgerBlue border-[1px] border-dodgerBlue bg-white rounded-[5px] hover:bg-blue-500 hover:text-white'
            onClick={handleClickImport}
          >
            เลือกไฟล์ Excel
          </button>
          {/* Hidden File Input */}
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
        <div className="flex-grow overflow-x-auto">
          <TableContainer component={Paper} className="mt-4 h-[56.3vh] w-[2500px]"
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
                  textsData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ backgroundColor: "#393B3A" }}>{index + 1}</TableCell>
                      <TableCell sx={{ backgroundColor: "#48494B" }}>{data.plate_group}</TableCell>
                      <TableCell sx={{ backgroundColor: "#393B3A" }}>{data.plate_number}</TableCell>
                      <TableCell sx={{ backgroundColor: "#48494B" }}>{data.province}</TableCell>
                      <TableCell sx={{ backgroundColor: "#393B3A" }}>{data.plate_class}</TableCell>
                      <TableCell sx={{ backgroundColor: "#48494B" }}>{data.case_number || "-"}</TableCell>
                      <TableCell sx={{ backgroundColor: "#393B3A" }}>{data.arrest_warrant_date ? dayjs(data.arrest_warrant_date).format("DD/MM/BBBB") : "-"}</TableCell>
                      <TableCell sx={{ backgroundColor: "#48494B" }}>{data.arrest_warrant_expire_date ? dayjs(data.arrest_warrant_expire_date).format("DD/MM/BBBB") : "-"}</TableCell>
                      <TableCell sx={{ backgroundColor: "#393B3A" }}>{data.behavior || "-"}</TableCell>
                      <TableCell sx={{ backgroundColor: "#48494B" }}>{data.case_owner_name}</TableCell>
                      <TableCell sx={{ backgroundColor: "#393B3A" }}>{data.case_owner_agency}</TableCell>
                      <TableCell sx={{ backgroundColor: "#48494B", textWrap: "nowrap" }}>{data.case_owner_phone}</TableCell>
                      <TableCell sx={{ backgroundColor: "#393B3A" }}>{data.imagesData}</TableCell>
                      <TableCell sx={{ backgroundColor: "#48494B" }}>{data.filesData}</TableCell>
                      <TableCell sx={{ backgroundColor: "#393B3A" }}>{data.active}</TableCell>
                      <TableCell sx={{ backgroundColor: "#48494B" }}>
                        <IconButton onClick={() => handleDeleteData(index)}>
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
      </div>
    </div>
  )
}

export default TextUpload