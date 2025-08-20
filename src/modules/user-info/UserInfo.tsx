import React, { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useForm } from "react-hook-form";
import { 
  Typography,
  Button,
} from "@mui/material";
import dayjs from "dayjs";

// Icons
import { Save, Download } from "lucide-react";
import { Icon } from "../../components/icons/Icon";

// Components
import AutoComplete from '../../components/auto-complete/AutoComplete';
import TextBox from '../../components/text-box/TextBox';
import DatePickerBuddhist from "../../components/date-picker-buddhist/DatePickerBuddhist";

// Context
import { useHamburger } from "../../context/HamburgerContext";

// Utils
import { formatThaiID, formatPhone } from "../../utils/commonFunction"
import { fetchClient, combineURL } from "../../utils/fetchClient";
import { PopupMessage, PopupMessageWithCancel } from '../../utils/popupMessage';

// Types
import { 
  FileUploadResponse, 
  UserResponse, 
  User 
} from "../../features/api/types";

// Config
import { getUrls } from '../../config/runtimeConfig';

interface FormData {
  prefixId: number
  firstName: string
  lastName: string
  email: string
  nationalId: string
  phone: string
  position: string
  agency: string
  active: number
  userRoleId: number
  username: string
  password: string
  dateOfBirth: Date | null
  imageUrl: string
};


const UserInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen } = useHamburger();
  const { API_URL, IMAGE_URL } = getUrls();

  // Options
  const [prefixOptions, setPrefixOptions] = useState<{ label: string ,value: number }[]>([]);

  // Route
  const isAllowed = location.state?.allowed || false;

  // Data
  const [user, setUser] = useState<User | null>(null);

  const sliceDropdown = useSelector(
    (state: RootState) => state.dropdown
  );

  const [formData, setFormData] = useState<FormData>({
    prefixId: 0,
    firstName: "",
    lastName: "",
    email: "",
    nationalId: "",
    phone: "",
    position: "",
    agency: "",
    active: 0,
    userRoleId: 0,
    username: "",
    password: "",
    dateOfBirth: null,
    imageUrl: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isAllowed) {
      fetchUser();
    } 
    else {
      navigate("/checkpoint");
    }
  }, [isAllowed, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        prefixId: user.title_id,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        nationalId: formatThaiID(user.idcard ?? ""),
        phone: formatPhone(user.phone ?? ""),
        position: user.job_position,
        agency: user.agency,
        active: user.active,
        userRoleId: user.user_group_id,
        username: user.username,
        password: "",
        dateOfBirth: user.dob,
        imageUrl: user.image_url,
      })
      setValue("prefix", user.title_id);
      setValue("firstName", user.firstname);
      setValue("lastName", user.lastname);
      setValue("email", user.email);
      setValue("nationalId", user.idcard);
      setValue("phone", user.phone);
      setValue("userRoleId", user.user_group_id);
      setValue("username", user.username);
      setValue("password", "");
      setValue("dateOfBirth", user.dob);
      setValue("imageUrl", user.image_url);
      setValue("agency", user.agency);
      setValue("position", user.job_position);
      setValue("active", user.active);
    }
  }, [user]);

  useEffect(() => {
    if (sliceDropdown.personTitles && sliceDropdown.personTitles.data) {
      const options = sliceDropdown.personTitles.data.map((row) => ({
        label: row.title_th,
        value: row.id,
      }));
      setPrefixOptions(options);
    }
  }, [sliceDropdown.personTitles]);
  
  const handleTextChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDropdownChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrefixChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault();
    if (value) {
      handleDropdownChange("prefixId", value.value);
    }
    else {
      handleDropdownChange("prefixId", '');
    }
  };

  const handleDateOfBirthChange = (date: Date | null) => {
    setFormData((prevState) => ({
      ...prevState,
      dateOfBirth: date,
    }));
  };

  const handleNationalIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const cleaned = input.replace(/\D/g, '');
    
    if (cleaned.length <= 13) {
      const formatted = formatThaiID(cleaned)
      handleTextChange("nationalId", formatted);
      handleTextChange("username", cleaned);
      setValue("username", cleaned);
    }
    return cleaned;
  }

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const cleaned = input.replace(/\D/g, '');
    
    if (cleaned.length <= 10) {
      const formatted = formatPhone(cleaned)
      handleTextChange("phone", formatted)
    }
    return cleaned
  };

  const handleCancelClick = () => {
    navigate("/center/manage-user");
  }

  const onSubmit = (data: any) => {
    if (user) {
      updateUser(data);
    }
  }

  const updateUser = async (data: any) => {
    try {
      const { all } = isDataChanged();
      if (!all) {
        PopupMessage(
          "ไม่พบการเปลี่ยนแปลง",
          "ข้อมูลไม่มีการเปลี่ยนแปลง",
          "warning"
        )
        return;
      }

      const confirmed = await PopupMessageWithCancel("ยืนยันการแก้ไข", "", "ยืนยัน", "ยกเลิก", "warning", "#FDB600")

      if (!confirmed) return;
      
      const body = JSON.stringify({
        id: user?.id,
        username: data.username,
        password: data.password,
        idcard: data.nationalId.replaceAll("-", ""),
        dob: dayjs(data.dateOfBirth).format("YYYY-MM-DD HH:mm:ss"),
        firstname: data.firstName,
        lastname: data.lastName,
        sex: data.sex,
        phone: data.phone.replaceAll("-", ""),
        email: data.email,
        image_url: formData.imageUrl,
        position: data.positionId?.label ?? "",
        headquater: data.departmentId?.label ?? "",
        active: data.active,
        visible: true,
        created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      })

      const response = await fetchClient<UserResponse>(combineURL(API_URL, "/users/update"), {
        method: "PUT",
        body,
      })

      if (response.success) {
        PopupMessage("บันทึกข้อมูลสำเร็จ", "", "success");
      }
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      PopupMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูล", errorMessage, "error");
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const fileArray = Array.from(files)
    
    try {
      const formData = new FormData()
      fileArray.forEach(file => {
        formData.append("files", file)
      })

      const response = await fetchClient<FileUploadResponse>(combineURL(API_URL, "/upload/"), {
        method: "POST",
        isFormData: true,
        body: formData,
      })

      if (response.success) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: response.data[0].url,
        }))
      }
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      PopupMessage("เกิดข้อผิดพลาดในการอัพโหลดไฟล์", errorMessage, "error");
    }
  }

  const handleDeleteImage = useCallback(async (url: string) => {
    try {
      const body = JSON.stringify({
        urls: [url]
      })

      await fetchClient<FileUploadResponse>(combineURL(API_URL, `/upload/remove`), {
        method: "POST",
        body,
      })

      setFormData((prev) => ({
        ...prev,
        imageUrl: "",
      }))
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      PopupMessage("เกิดข้อผิดพลาดในการลบข้อมูล", errorMessage, "error");
    }
  }, []);

  const isDataChanged = () => {
    const isImageChanged = formData.imageUrl !== user?.image_url;

    const isOtherDataChanged =
      formData.prefixId!== user?.title_id  ||
      formData.firstName !== user?.firstname ||
      formData.lastName !== user?.lastname ||
      formData.email !== user?.email ||
      formData.nationalId.replaceAll("-", "") !== user?.idcard ||
      formData.phone.replaceAll("-", "") !== user?.phone ||
      formData.position !== user?.job_position ||
      formData.agency !== user?.agency ||
      formData.active !== user?.active ||
      formData.userRoleId !== user?.user_group_id ||
      formData.username !== user?.username ||
      formData.password ||
      formData.dateOfBirth !== user?.dob ||
      formData.imageUrl !== user?.image_url

    return { all: isOtherDataChanged || isImageChanged };
  };

  const fetchUser = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const username = localStorage.getItem("username");
    if (!username) {
      navigate('/checkpoint', { replace: true })
      PopupMessage("เกิดข้อผิดพลาดในการดึงข้อมูล", "ไม่พบข้อมูลผู้ใช้", "error");
      return;
    }
    try {
      const response = await fetchClient<UserResponse>(combineURL(API_URL, "/users/get"), {
        method: "GET",
        signal: controller.signal,
        queryParams: { 
          filter: `username=${username}`,
        },
      })

      if (response.success) {
        setUser(response.data[0]);
      }
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      PopupMessage("เกิดข้อผิดพลาดในการดึงข้อมูล", errorMessage, "error");
    }
    finally {
      clearTimeout(timeoutId);
    }
  }

  return (
    <div id='user-info' className={`main-content ${isOpen ? "pl-[130px]" : "pl-[10px]"} pr-[10px] transition-all duration-500`}>
      {/* Header */}
      <Typography variant="h5" color="white" className="font-bold">{"ข้อมูลส่วนตัว"}</Typography>
      <form onSubmit={handleSubmit(onSubmit)} className='h-full'>
        <div className='flex flex-col relative h-full'>
          <div className='grid grid-cols-4 gap-[4%] p-[25px]'>
            {/* User Image */}
            <div className='row-span-3 flex justify-center items-center relative h-[295px]' title=''>
              {
                formData.imageUrl ? (
                  <div className="absolute inset-0">
                    <img src={`${IMAGE_URL}${formData.imageUrl}`} alt="User Image" className="object-contain w-full h-full" />
                    <button
                      type="button"
                      className="absolute z-[52] top-2 right-2 text-white bg-red-500 rounded-full w-[30px] h-[30px] flex items-center justify-center hover:cursor-pointer"
                      onClick={() => handleDeleteImage(formData.imageUrl)}
                    >
                      &times;
                    </button>
                  </div>
                ) :
                (
                  <div className='flex border-[1px] border-white border-dashed w-full h-full'>
                    {/* No Images */}
                    <div className="flex flex-col justify-center items-center w-full h-full">
                      <Icon icon={Download} size={80} color="#999999" />
                      <span className="text-[18px] text-nobel mt-[20px]">
                        {"อัปโหลดรูป"}
                      </span>
                    </div>                    
                  </div>
                )
              }
              {/* Hidden File Input */}
              <input
                id="image-upload"
                type="file"
                name="images"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
            </div>

            {/* User Info */}
            <AutoComplete 
              id="prefix-select"
              sx={{ marginTop: "10px"}}
              value={formData.prefixId}
              onChange={handlePrefixChange}
              options={prefixOptions}
              label="คำนำหน้า"
              placeholder="กรุณาเลือกคำนำหน้า"
              labelFontSize="15px"
              error={!!errors.prefix}
              register={register("prefix", { 
                required: true,
              })}
              required={true}
            />

            <TextBox
              sx={{ marginTop: "10px", fontSize: "15px" }}
              id="first-name"
              label={"ชื่อ"}
              placeholder="กรุณาใส่ชื่อ"
              value={formData.firstName}
              onChange={(event) =>
                handleTextChange("firstName", event.target.value)
              }
              error={!!errors.firstName}
              register={register("firstName", { 
                required: true,
              })}
              required={true}
            />

            <TextBox
              sx={{ marginTop: "10px", fontSize: "15px" }}
              id="last-name"
              label="นามสกุล"
              placeholder="กรุณาใส่นามสกุล"
              value={formData.lastName}
              onChange={(event) =>
                handleTextChange("lastName", event.target.value)
              }
              error={!!errors.lastName}
              register={register("lastName", { 
                required: true,
              })}
              required={true}
            />

            <TextBox
              sx={{ marginTop: "10px", fontSize: "15px" }}
              id="national-id"
              label="บัตรประชาชน"
              placeholder="กรุณาใส่บัตรประชาชน"
              value={formData.nationalId}
              onChange={handleNationalIdChange}
              error={!!errors.nationalId}
              register={register("nationalId", { 
                required: true,
                validate: (value) => {
                  const digitsOnly = value.replace(/\D/g, '').slice(0, 13);
                  if (digitsOnly.length !== 13) return "";
                  return true;
                }
              })}
              required={true}
            />

            <div>
              <Typography sx={{ fontSize: "15px"}} variant='subtitle1' color='white'>
                {"วัน/เดือน/ปี เกิด"}
              </Typography>
              <DatePickerBuddhist
                value={formData.dateOfBirth}
                sx={{
                  marginTop: "8px",
                  "& .MuiOutlinedInput-input": {
                    fontSize: 15
                  }
                }}
                className="w-full"
                id="start-date-time"
                onChange={(value) => handleDateOfBirthChange(value)}
                error={!!errors.dateOfBirth}
                register={register("dateOfBirth", { 
                  required: true,
                })}
              >
              </DatePickerBuddhist>
            </div>

            <TextBox
              sx={{ marginTop: "10px", fontSize: "15px" }}
              id="phone"
              label="เบอร์โทรศัพท์"
              placeholder="กรุณาใส่เบอร์โทรศัพท์"
              value={formData.phone}
              onChange={handlePhoneChange}
              error={!!errors.phone}
              register={register("phone", { 
                required: true,
                validate: (value) => {
                  const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
                  if (digitsOnly.length !== 10) return "";
                  return true;
                }
              })}
              required={true}
            />

            <TextBox
              sx={{ marginTop: "10px", fontSize: "15px" }}
              id="email"
              label="Email"
              placeholder="กรุณาใส่ Email"
              value={formData.email}
              onChange={(event) =>
                handleTextChange("email", event.target.value)
              }
              error={!!errors.email}
              register={register("email", { 
                required: false,
              })}
            />

            <TextBox
              sx={{ marginTop: "10px", fontSize: "15px" }}
              id="position"
              label="ตำแหน่ง"
              placeholder="กรุณาเลือกตำแหน่ง"
              value={formData.position}
              required={true}
              error={!!errors.position}
              register={register("position", { 
                required: true,
              })}
            />

            <TextBox
              sx={{ marginTop: "10px", fontSize: "15px" }}
              id="agency"
              label="หน่วยงาน"
              placeholder="กรุณาใส่หน่วยงาน"
              value={formData.agency}
              required={true}
              error={!!errors.agency}
              register={register("agency", { 
                required: true,
              })}
              disabled={true}
            />

            <div className='col-start-1 mt-2'>
              <div className='flex items-center justify-center h-full'>
                <label>{`สถานะ : ${formData.active === 1 ? "ใช้งาน" : "ไม่ใช้งาน"}`}</label>
              </div>
            </div>

            <div className='col-start-2 col-span-3 border-b-[1px] border-white mt-5'></div>

            <div className='col-start-2'>
              <TextBox
                sx={{ marginTop: "10px", fontSize: "15px" }}
                id="username"
                label="Username"
                value={formData.username}
                required={true}
                error={!!errors.username}
                register={register("username", { 
                  required: true,
                })}
              />
            </div>

            <TextBox
              sx={{ marginTop: "10px", fontSize: "15px" }}
              type="password"
              id="password"
              label="Password"
              value={formData.password}
              onChange={(event) =>
                handleTextChange("password", event.target.value)
              }
              error={!!errors.password}
              register={register("password", { 
                required: true,
              })}
              required={true}
            />
          </div>

          {/* Button Part */}
          <div className='flex absolute bottom-11 right-0 gap-2'>
            <Button
              type='submit'
              variant="contained"
              className="primary-btn"
              startIcon={ <Save />}
              sx={{
                width: "100px",
                height: "40px",
                textTransform: "capitalize",
                '& .MuiSvgIcon-root': { 
                  fontSize: 20
                } 
              }}
            >
              {"บันทึก"}
            </Button>

            <Button
              variant="text"
              className="secondary-checkpoint-search-btn"
              sx={{
                width: "100px",
                height: "40px",
                textTransform: "capitalize",
                '& .MuiSvgIcon-root': { 
                  fontSize: 20
                } 
              }}
              onClick={handleCancelClick}
            >
              {"ยกเลิก"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default UserInfo;