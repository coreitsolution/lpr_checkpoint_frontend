import React, { useState, useRef, useEffect, useCallback } from "react";
import { SelectChangeEvent } from "@mui/material";
import PopupMessage from "../../utils/popupMessage";
import { format, parse } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { th } from "date-fns/locale";
import { FILE_URL } from '@/config/apiConfig'

// Components
import { Checkbox } from "../../components/ui/checkbox";
import { Textarea } from "../../components/ui/textarea";
import SelectBox from "../../components/select-box/SelectBox";
import TextBox from "../../components/text-box/TextBox";

// API
import {
  fetchProvincesThunk,
  fetchRegistrationTypesThunk,
} from "../../features/dropdown/dropdownSlice";
import {
  putSpecialPlateDataThunk,
  postSpecialRegistrationDataThunk,
} from "../../features/registration-data/RegistrationDataSlice";
import {
  postFilesDataThunk,
  deleteFilesDataThunk,
} from "../../features/file-upload/fileUploadSlice";

// Types
import {
  NewSpecialPlates,
  FileData,
  SpecialPlatesRespondsDetail,
  FileRespondsData,
  NewFileRespondsData,
} from "../../features/registration-data/RegistrationDataTypes";
import { DeleteRequestData } from "../../features/file-upload/fileUploadTypes"

// Icon
import { Icon } from "../../components/icons/Icon";
import { Download, Upload, Trash2 } from "lucide-react";

const locales = { th: th };

type LocaleKey = keyof typeof locales;

interface ManageExtraRegistrationProps {
  closeDialog: () => void;
  selectedRow: SpecialPlatesRespondsDetail | null;
  isEditMode: boolean;
}

interface FormData {
  plate_group: string;
  plate_number: string;
  province_id: number;
  imagesData: {
    [key: number]: FileData;
  };
  case_number: string;
  arrest_warrant_date: Date | null;
  arrest_warrant_expire_date: Date | null;
  behavior: string;
  case_owner_name: string;
  case_owner_phone: string;
  plate_class_id: number;
  case_owner_agency: string;
  active: number;
  filesData: FileRespondsData[] | NewFileRespondsData[];
  visible: number;
}

const ManageExtraRegistration: React.FC<ManageExtraRegistrationProps> = ({
  closeDialog,
  selectedRow,
  isEditMode,
}) => {
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
  const [originalData, setOriginalData] = useState<SpecialPlatesRespondsDetail | null>(
    null
  );
  const [registrationTypesOptions, setRegistrationTypesOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [provincesOptions, setProvincesOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [locale] = React.useState<LocaleKey>("th");

  const dispatch: AppDispatch = useDispatch();
  const { provinces, registrationTypes } = useSelector(
    (state: RootState) => state.dropdown
  );

  useEffect(() => {
    dispatch(fetchProvincesThunk("?orderBy=name_th"));
    dispatch(fetchRegistrationTypesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (registrationTypes && registrationTypes.data) {
      const options = registrationTypes.data.map((row) => ({
        label: row.title_en,
        value: row.id,
      }));
      setRegistrationTypesOptions(options);
    }
  }, [registrationTypes]);

  useEffect(() => {
    if (provinces && provinces.data) {
      const options = provinces.data.map((row) => ({
        label: row.name_th,
        value: row.id,
      }));
      setProvincesOptions(options);
    }
  }, [provinces]);

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
  });

  useEffect(() => {
    if (isEditMode && selectedRow) {
      setFormData({
        plate_group: selectedRow.plate_group,
        plate_number: selectedRow.plate_number,
        province_id: selectedRow.province_id,
        imagesData: selectedRow.special_plate_images,
        case_number: selectedRow.case_number,
        arrest_warrant_date: parse(
          selectedRow.arrest_warrant_date,
          "yyyy-MM-dd",
          new Date()
        ),
        arrest_warrant_expire_date: parse(
          selectedRow.arrest_warrant_expire_date,
          "yyyy-MM-dd",
          new Date()
        ),
        behavior: selectedRow.behavior,
        case_owner_name: selectedRow.case_owner_name,
        case_owner_phone: selectedRow.case_owner_phone,
        plate_class_id: selectedRow.plate_class_id,
        case_owner_agency: selectedRow.case_owner_agency,
        active: selectedRow.active,
        filesData: selectedRow.special_plate_files,
        visible: 1,
      });
      setOriginalData(selectedRow);
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
      });
    }
  }, [selectedRow, isEditMode, dispatch]);

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      // Convert the file list to an array for processing
      const fileArray = Array.from(files);


      // Helper function to determine next available positions
      const getNextAvailablePositions = (
        currentImages: { [key: number]: FileData },
        numNeeded: number
      ) => {
        const positions: number[] = [];
        for (let i = 0; i < 3 && positions.length < numNeeded; i++) {
          if (!currentImages[i]) {
            positions.push(i);
          }
        }
        return positions;
      };

      const availablePositions = getNextAvailablePositions(
        formData.imagesData,
        fileArray.length
      );


      try {
        const formData = new FormData();
        fileArray.forEach(file => {
          formData.append("files", file); // Append each file individually
        });
        // Dispatch the thunk to upload files and await the response
        const response = await dispatch(
          postFilesDataThunk(formData)
        ).unwrap();

        if (response?.data) {
          const uploadedImages = response.data.map((file: any, index: any) => ({
            position: availablePositions[index],
            image: {
              title: file.title,
              url: file.url,
            },
          }));

          const imagesDataUpdates = uploadedImages.reduce(
            (acc: any, { position, image }) => {
              if (position !== undefined) {
                acc[position] = image;
              }
              return acc;
            },
            {} as { [key: number]: FileData }
          );

          setFormData((prev) => ({
            ...prev,
            imagesData: {
              ...prev.imagesData,
              ...imagesDataUpdates,
            },
          }));
        }
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    },
    [dispatch, formData.imagesData]
  );

  const handleDeleteImage = useCallback(async (position: number, url: string) => {
    try {
      const deleteFile: DeleteRequestData = {
        url: url
      }
      const response = await deleteFileUpload(deleteFile);
    }
    catch (error) {

    }
    setFormData((prev) => {
      const updatedImagesData = { ...prev.imagesData };
      delete updatedImagesData[position];

      return {
        ...prev,
        imagesData: updatedImagesData,
      };
    });
  }, [dispatch])

  const handleTextChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      active: checked ? 1 : 0,
    });
  };

  const convertImagesToArray = (imagesObj: {
    [key: number]: FileData | null;
  }): (FileData | null)[] => {
    const maxIndex = Math.max(...Object.keys(imagesObj).map(Number), -1);

    // Create array of that length + 1
    return Array.from({ length: maxIndex + 1 }, (_, index) => {
      return imagesObj[index] || null;
    });
  };

  const getImagesArrayWithoutNulls = (imagesObj: {
    [key: number]: FileData | null;
  }): FileData[] => {
    return convertImagesToArray(imagesObj).filter(
      (img): img is FileData => img !== null
    );
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSaveClick = async () => {
    if (!validateForm()) return;

    if (!hasChanges()) {
      PopupMessage(
        "ไม่พบการเปลี่ยนแปลง",
        "ข้อมูลไม่มีการเปลี่ยนแปลง",
        "warning"
      );
      return;
    }

    try {
      const updatedFormData: NewSpecialPlates = {
        arrest_warrant_date: formData.arrest_warrant_date
          ? format(formData.arrest_warrant_date, "yyyy-MM-dd")
          : "",
        arrest_warrant_expire_date: formData.arrest_warrant_expire_date
          ? format(formData.arrest_warrant_expire_date, "yyyy-MM-dd")
          : "",
        plate_group: formData.plate_group,
        plate_number: formData.plate_number,
        province_id: formData.province_id,
        imagesData: formData.imagesData
          ? getImagesArrayWithoutNulls(convertImagesToArray(formData.imagesData))
          : [],
        case_number: formData.case_number,
        behavior: formData.behavior,
        active: formData.active,
        case_owner_phone: formData.case_owner_phone,
        case_owner_name: formData.case_owner_name,
        plate_class_id: formData.plate_class_id,
        case_owner_agency: formData.case_owner_agency,
        filesData: formData.filesData,
        visible: 1,
      };

      let response;
      let isSuccess = true;

      const handleSuccess = () => {
        PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success");
        closeDialog();
      };

      const handleError = () => {
        isSuccess = false;
        PopupMessage("บันทึกไม่สำเร็จ", "มีข้อผิดพลาดเกิดขึ้น", "error");
      };

      if (isEditMode && selectedRow) {
        // Update existing data
        const updateDataWithId = { ...updatedFormData, id: selectedRow.id };
        response = await dispatch(
          putSpecialPlateDataThunk(updateDataWithId)
        ).unwrap();

      } else {
        // Add new data
        response = await dispatch(
          postSpecialRegistrationDataThunk(updatedFormData)
        ).unwrap();
      }

      if (isSuccess) {
        handleSuccess();
      }
      else {
        handleError();
      }
    } catch (error) {
      console.error("Error:", error);
      PopupMessage("บันทึกไม่สำเร็จ", "มีข้อผิดพลาดเกิดขึ้น", "error");
    }
  };

  const handleImportFileClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files).filter((file) =>
      /\.(pdf|docx|doc)$/i.test(file.name)
    );

    if (newFiles.length > 0) {
      try {
        const formData = new FormData();
        newFiles.forEach(file => {
          formData.append("files", file); // Append each file individually
        });
        // Dispatch the thunk to upload files and await the response
        const response = await dispatch(
          postFilesDataThunk(formData)
        ).unwrap();
  
        if (response?.data) {
          const uploadedFiles: NewFileRespondsData[] = response.data.map((file) => ({
            title: file.title,
            url: file.url,
            createdAt: new Date().toDateString()
          }));

          setFormData((prev) => ({
            ...prev,
            filesData: [...prev.filesData, ...uploadedFiles],
          }));
        }
      }
      catch (error) {
        console.error("Error uploading files:", error);
      }
    }

    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = "";
    }
  }, [])

  const handleDeleteFile = useCallback(async(index: number, url: string) => {
    try {
      const deleteFile: DeleteRequestData = {
        url: url
      }
      const response = await deleteFileUpload(deleteFile);

      setFormData((prev) => ({
        ...prev,
        filesData: prev.filesData.filter((_, i) => i !== index), // Remove by index
      }));
    }
    catch (error) {
      console.error("Error deleting files:", error);
    }
  }, [])

  const validateForm = () => {
    const requiredFields = [
      "plate_group",
      "plate_number",
      "province_id",
      "plate_class_id",
      "case_number",
      "arrest_warrant_date",
      "arrest_warrant_expire_date",
      "behavior",
      "case_owner_name",
      "case_owner_agency",
      "case_owner_phone",
      "imagesData",
      "filesData",
    ];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        PopupMessage("กรุณากรอกข้อมูล", `กรุณากรอก ${field}`, "warning");
        return false;
      }
    }
    return true;
  };

  const handleStartArrestDateChange = (date: Date | null) => {
    setFormData((prevState) => ({
      ...prevState,
      arrest_warrant_date: date,
    }));
  };

  const handleEndArrestDateChange = (date: Date | null) => {
    setFormData((prevState) => ({
      ...prevState,
      arrest_warrant_expire_date: date,
    }));
  };

  const deleteFileUpload = async (deleteFile: DeleteRequestData) => {
    try {
      const response = await dispatch(
        deleteFilesDataThunk(deleteFile)
      ).unwrap();
    }
    catch (error) {
      
    }
  }

  const handleCancelButton = async () => {
    const filesToDelete: string[] = [];
  
    if (selectedRow && selectedRow.special_plate_images) {
      selectedRow.special_plate_images.forEach((image) => {
        const imageUrl = image.url;
        let isFound = false

        Object.values(formData.imagesData).forEach((existingImage) => {
          if (existingImage.url === imageUrl) {
            isFound = true;
          }
        });
  
        if (!isFound) {
          filesToDelete.push(imageUrl);
        }
      })
    } 
    else if (formData.imagesData) {
      Object.values(formData.imagesData).forEach((image) => {
        filesToDelete.push(image.url);
      });
    }
  
    for (const url of filesToDelete) {
      const deleteRequest: DeleteRequestData = { url };
      await deleteFileUpload(deleteRequest);
    }

    closeDialog();
  };

  const getFileName = (title:string, url:string):string => {
    try {
      const urlSplit = url.split('/');
      const fileNameWithExtension = urlSplit[urlSplit.length - 1]; 
      const extensionSplit = fileNameWithExtension.split('.');
      const extension = extensionSplit.length > 1 ? extensionSplit.pop() : 'txt';
      return `${title}.${extension}`;
    } 
    catch (error) {
      console.error("Error extracting file name:", error);
      return `${title}.txt`; // Default fallback
    }
  }

  return (
    <div
      id="manage-extra-registration"
      className="bg-black text-white p-[30px] border-[1px] border-dodgerBlue"
    >
      <div className="grid grid-cols-4 gap-2 items-start justify-start">
        {/* Row 1 */}
        <div className="mr-[50px] mb-[30px]">
          <TextBox
            sx={{ marginTop: "10px", fontSize: "15px" }}
            id="letter-category"
            label="หมวดอักษร*"
            placeHolder=""
            className="w-full"
            value={formData.plate_group}
            onChange={(event) =>
              handleTextChange("plate_group", event.target.value)
            }
          />
        </div>
        <div className="mr-[50px]">
          <TextBox
            sx={{ marginTop: "10px", fontSize: "15px" }}
            id="car-registration"
            label="ป้ายทะเบียน*"
            placeHolder=""
            className="w-full"
            value={formData.plate_number}
            onChange={(event) =>
              handleTextChange("plate_number", event.target.value)
            }
          />
        </div>
        <div className="mr-[20px]">
          <SelectBox
            sx={{ marginTop: "10px", height: "40px", fontSize: "15px" }}
            id="select-provices"
            className="w-full"
            value={
              formData.province_id === 0 ? "" : formData.province_id.toString()
            }
            onChange={(event: SelectChangeEvent<any>) =>
              handleSelectChange("province_id", event.target.value)
            }
            options={provincesOptions}
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
        <div className="mr-[50px] mb-[30px]">
          <SelectBox
            sx={{ marginTop: "10px", height: "40px", fontSize: "15px" }}
            id="select-registration-type"
            className="w-full"
            value={
              formData.plate_class_id === 0
                ? ""
                : formData.plate_class_id.toString()
            }
            onChange={(event: SelectChangeEvent<any>) =>
              handleSelectChange("plate_class_id", event.target.value)
            }
            options={registrationTypesOptions}
            label="กลุ่มทะเบียน*"
          />
        </div>
        {/* Row 3 */}
        <div className="col-start-1 mr-[50px] mb-[30px]">
          <TextBox
            sx={{ marginTop: "10px", fontSize: "15px" }}
            id="case-id"
            label="หมายเลขคดี"
            placeHolder=""
            className="w-full"
            value={formData.case_number}
            onChange={(event) =>
              handleTextChange("case_number", event.target.value)
            }
          />
        </div>
        <div className="mr-[50px] mb-[30px] pt-[3px]">
          <label>วันที่ออกหมายจับ</label>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={locales[locale]}
          >
            <DatePicker
              sx={{
                marginTop: "10px",
                borderRadius: "5px",
                backgroundColor: "white",
              }}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
              value={
                formData.arrest_warrant_date
                  ? formData.arrest_warrant_date
                  : null
              }
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
              sx={{
                marginTop: "10px",
                borderRadius: "5px",
                backgroundColor: "white",
              }}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
              value={
                formData.arrest_warrant_expire_date
                  ? formData.arrest_warrant_expire_date
                  : null
              }
              onChange={(value) => handleEndArrestDateChange(value)}
            />
          </LocalizationProvider>
        </div>
        {/* Row 4 */}
        <div className="col-start-1 col-span-3 mr-[20px] mb-[30px]">
          <label>พฤติกรรม</label>
          <Textarea
            className="w-full h-[100px] text-start text-wrap text-black mt-[15px] bg-white"
            name="behavior"
            value={formData.behavior}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        {/* Row 5 */}
        <div className="col-start-1 mr-[50px] mb-[30px]">
          <TextBox
            sx={{ marginTop: "10px", fontSize: "15px" }}
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
        <div className="mr-[50px] mb-[30px]">
          <TextBox
            sx={{ marginTop: "10px", fontSize: "15px" }}
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
        <div className="mr-[20px] mb-[30px]">
          <TextBox
            sx={{ marginTop: "10px", fontSize: "15px" }}
            id="case-owner-phone"
            label="เบอร์ติดต่อ"
            placeHolder=""
            className="w-full"
            value={formData.case_owner_phone}
            onChange={(event) =>
              handleTextChange("case_owner_phone", event.target.value)
            }
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
          <label className="text-[15px]">Active</label>
        </div>
        {/* Row 7 */}
        <div className="col-start-3 row-start-8 flex items-center justify-end mr-[20px]">
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
  );
};

export default ManageExtraRegistration;
