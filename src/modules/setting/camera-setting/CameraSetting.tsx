import React, { useEffect, useState, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../../app/store"
import {
  Dialog,
  DialogTitle
} from "@mui/material"
import { format } from "date-fns"
import L from 'leaflet';

// Types
import {
  CameraDetailSettings,
  NewCameraDetailSettings,
} from "../../../features/camera-settings/cameraSettingsTypes"
import { SearchResult } from "../../../types/index"
import { StreamEncodesDetail } from "../../../features/dropdown/dropdownTypes"
import { DistrictsDetail, SubDistrictsDetail } from "../../../features/dropdown/dropdownTypes";

// Components
import ToggleButton from "../../../components/toggle-button/ToggleButton"
import TextBox from "../../../components/text-box/TextBox"
import Loading from "../../../components/loading/Loading"
import AutoComplete from "../../../components/auto-complete/AutoComplete"
import SelectBox from '../../../components/select-box/SelectBox'

// API
import {
  postCameraSettingThunk,
  putCameraSettingThunk,
} from "../../../features/camera-settings/cameraSettingsSlice"

// Icon
import { Icon } from "../../../components/icons/Icon"
import { Save } from "lucide-react"

// Modules
import LocationSetting from "../location-setting/LocationSetting"

// Pop-up
import { PopupMessage } from "../../../utils/popupMessage"

// Constants
import { DEFAULT_DETECTION_AREA } from "../../../constants/detectionArea"

// Utils
import { formatPhone } from "../../../utils/comonFunction"

interface CameraSettingProps {
  closeDialog: () => void
  selectedRow: CameraDetailSettings | null
  isEditMode: boolean
}

const CameraSetting: React.FC<CameraSettingProps> = ({
  closeDialog,
  selectedRow,
  isEditMode,
}) => {
  const [originalData, setOriginalData] = useState<CameraDetailSettings | null>(
    null
  )
  const [state, setState] = useState({
    id: undefined as number | undefined,
    policeDivision: "",
    isLoading: false,
    isLocationSettingOpen: false,
    isSensorSettingOpen: false,
    provinceSelect: 0 as number | '',
    organization: "",
    districtsSelect:  0 as number | '',
    subDistrictsSelect: 0,
    checkpoint: "",
    checkpointId: "",
    route: "",
    rtspLiveView: "",
    streamEncodeSelect: '' as number | '',
    streamEncode: {} as StreamEncodesDetail,
    apiServer: "",
    rtspProcess: "",
    number_of_detections: 0,
    pcSerialNumber: "",
    license: "",
    location: {
      latitude: "",
      longitude: "",
    },
    officer: {
      namePrefixesSelect: 0 as number | '',
      name: "",
      surname: "",
      phone: "",
      positionsSelect: 0 as number | '',
    },
    toggles: {
      startService: false,
      apiServerStatus: false,
      syncDataStatus: false,
      licenseStatus: false,
    },
  })

  const dispatch: AppDispatch = useDispatch()
  const {
    provinces,
    personTitles,
    positions,
    streamEncodes,
    districts,
    subDistricts,
  } = useSelector((state: RootState) => state.dropdown)
  const [provincesOptions, setProvincesOptions] = useState<{ label: string ,value: number }[]>([])
  const [subDistrictsOptions, setSubDistrictsOptions] = useState<{ label: string ,value: number }[]>([])
  const [districtsOptions, setDistrictsOptions] = useState<{ label: string ,value: number }[]>([])
  const [personTitlesOptions, setPersonTitlesOptions] = useState<{ label: string ,value: number }[]>([])
  const [positionsOptions, setPositionsOptions] = useState<{ label: string ,value: number }[]>([])
  const [streamEncodesOptions, setStreamEncodesOptions] = useState<{ label: string ,value: number }[]>([])
  const [districtsList, setDistrictsList] = useState<DistrictsDetail[]>([])
  const [subDistrictsList, setSubDistrictsList] = useState<SubDistrictsDetail[]>([])
  
  useEffect(() => {
    if (
      provinces?.data &&
      provinces?.data?.length > 0 &&
      personTitles?.data && personTitles?.data.length > 0 &&
      positions?.data && positions?.data.length > 0
    ) {
      if (isEditMode && selectedRow) {
        setState((prev) => ({
          ...prev,
          id: selectedRow.id,
          isLoading: false,
          isLocationSettingOpen: false,
          isSensorSettingOpen: false,
          provinceSelect: selectedRow.province_id,
          districtsSelect: selectedRow.district_id,
          subDistrictsSelect: selectedRow.sub_district_id,
          organization: selectedRow.organization,
          checkpoint: selectedRow.checkpoint_name,
          checkpointId: selectedRow.cam_id,
          route: selectedRow.route,
          rtspLiveView: selectedRow.rtsp_live_url,
          streamEncodeSelect: selectedRow.stream_encode_id,
          streamEncode: selectedRow.stream_encode,
          apiServer: selectedRow.api_server_url,
          rtspProcess: selectedRow.rtsp_process_url,
          pcSerialNumber: selectedRow.pc_serial_number,
          number_of_detections: 0,
          license: selectedRow.license_key,
          location: {
            latitude: selectedRow.latitude,
            longitude: selectedRow.longitude,
          },
          officer: {
            namePrefixesSelect: selectedRow.officer_title_id,
            name: selectedRow.officer_firstname,
            surname: selectedRow.officer_lastname,
            phone: selectedRow.officer_phone,
            positionsSelect: selectedRow.officer_position_id,
          },
          toggles: {
            startService: false,
            apiServerStatus: false,
            syncDataStatus: false,
            licenseStatus: false,
          },
        }))
        setOriginalData(selectedRow)
      }
    }
  }, [
    provinces,
    personTitles,
    positions,
    isEditMode,
    selectedRow,
  ])

  const hasChanges = () => {
    if (!originalData || !state) return false;
    return (
      originalData.cam_id !== state.checkpointId ||
      originalData.checkpoint_name !== state.checkpoint ||
      originalData.organization !== state.organization ||
      originalData.province_id !== state.provinceSelect ||
      originalData.district_id !== state.districtsSelect ||
      originalData.sub_district_id !== state.subDistrictsSelect ||
      originalData.route !== state.route ||
      originalData.latitude !== state.location.latitude ||
      originalData.longitude !== state.location.longitude ||
      originalData.rtsp_live_url !== state.rtspLiveView ||
      originalData.rtsp_process_url !== state.rtspProcess ||
      originalData.stream_encode_id !== state.streamEncodeSelect ||
      originalData.api_server_url !== state.apiServer ||
      originalData.pc_serial_number !== state.pcSerialNumber ||
      originalData.license_key !== state.license ||
      originalData.officer_title_id !== state.officer.namePrefixesSelect ||
      originalData.officer_firstname !== state.officer.name ||
      originalData.officer_lastname !== state.officer.surname ||
      originalData.officer_position_id !== state.officer.positionsSelect ||
      originalData.officer_phone !== state.officer.phone
    );
  };

  const handleToggle = (key: keyof typeof state.toggles, value: boolean) => {
    setState((prev) => ({
      ...prev,
      toggles: { ...prev.toggles, [key]: value },
    }))
  }

  const handleDropdownChange = (key: keyof typeof state, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const handleDropdownOfficerChange = (
    key: keyof typeof state.officer,
    value: string
  ) => {
    setState((prev) => ({
      ...prev,
      officer: { ...prev.officer, [key]: value },
    }))
  }

  const handleButtonClick = (key: keyof typeof state, value: boolean) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const confirmPoint = (result: SearchResult) => {
    const latLng = L.latLng(result.location);
    const lat = latLng.lat.toFixed(5);
    const lng = latLng.lng.toFixed(5);
    setState((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        latitude: lat.toString(),
        longitude: lng.toString(),
      },
    }))
  }
  
  useEffect(() => {
    const fetchData = async () => {
      if (state.provinceSelect) {
        const res = districts?.data?.filter((district) => district.province_id === state.provinceSelect)
        if (res) {
          setDistrictsList(res)
        }
      }
      if (state.districtsSelect) {
        const res = subDistricts?.data?.filter((district) => district.district_id === state.districtsSelect && district.province_id === state.provinceSelect)
        if (res) {
          setSubDistrictsList(res)
        }
      }
    }
    fetchData()
  }, [dispatch, state.provinceSelect, state.districtsSelect])

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
    if (districtsList) {
      const options = districtsList.map((row) => ({
        label: row.name_th,
        value: row.id,
      }))
      setDistrictsOptions(options)
    }
  }, [districtsList])

  useEffect(() => {
    if (subDistrictsList) {
      const options = subDistrictsList.map((row) => ({
        label: row.name_th,
        value: row.id,
      }))
      setSubDistrictsOptions(options)
    }
  }, [subDistrictsList])

  useEffect(() => {
    if (personTitles && personTitles.data) {
      const options = personTitles.data.map((row) => ({
        label: row.title_th,
        value: row.id,
      }))
      setPersonTitlesOptions(options)
    }
  }, [personTitles])

  useEffect(() => {
    if (positions && positions.data) {
      const options = positions.data.map((row) => ({
        label: row.position_th,
        value: row.id,
      }))
      setPositionsOptions(options)
    }
  }, [positions])

  useEffect(() => {
    if (streamEncodes && streamEncodes.data) {
      const options = streamEncodes.data.map((row) => ({
        label: row.name,
        value: row.id,
      }))
      setStreamEncodesOptions(options)
    }
  }, [streamEncodes])

  const createCameraSettings = (): NewCameraDetailSettings | null => {
    const defaultDetectionArea = DEFAULT_DETECTION_AREA
    
    const requiredFields: (keyof typeof state)[] = [
      "checkpointId",
      "checkpoint",
      "location",
      "rtspProcess",
      "rtspLiveView",
      "streamEncodeSelect",
      "officer",
    ];

    const fieldErrorMessages: Record<string, string> = {
      checkpointId: "ID (กล้อง)",
      checkpoint: "Check point (ด่านตรวจ)",
      "location.latitude": "Location Latitude",
      "location.longitude": "Location longitude",
      rtspProcess: "RTSP Process",
      rtspLiveView: "RTSP Live View",
      streamEncodeSelect: "Stream Encode",
      "officer.namePrefixesSelect": "คำนำหน้า",
      "officer.name": "ชื่อ",
      "officer.surname": "นามสกุล",
      "officer.phone": "เบอร์โทร",
      "officer.positionsSelect": "ตำแหน่ง",
    };

    const skipField = [
      "organization",
      "province_id",
      "district_id",
      "sub_district_id",
      "route",
      "api_server_url",
      "pc_serial_number",
      "license_key",
      "detection_area",
    ]

    for (const field of requiredFields) {
      const value = state[field as keyof typeof state]

      if (typeof value === "object" && value !== null) {
        for (const key in value) {
          const nestedKey = `${field}.${key}`;
          if (!value[key as keyof typeof value]) {
            PopupMessage(
              "พบข้อผิดพลาด",
              `กรุณากรอกข้อมูลในช่อง '${fieldErrorMessages[nestedKey] || nestedKey}'`,
              "error"
            );
            return null;
          }
        }
      }
      else if (!value && !skipField.includes(field)) {
        PopupMessage(
          "พบข้อผิดพลาด",
          `กรุณากรอกข้อมูลในช่อง '${fieldErrorMessages[field]}'`,
          "error"
        )
        return null
      }
    }

    const cameraSettings: NewCameraDetailSettings = {
      cam_id: state.checkpointId,
      checkpoint_name: state.checkpoint,
      latitude: Number(state.location.latitude),
      longitude: Number(state.location.longitude),
      organization: state.organization || "",
      province_id: state.provinceSelect ? Number(state.provinceSelect) : 0,
      district_id: state.districtsSelect ? Number(state.districtsSelect) : 0,
      sub_district_id: state.subDistrictsSelect ? Number(state.subDistrictsSelect) : 0,
      route: state.route || "",
      rtsp_live_url: state.rtspLiveView,
      rtsp_process_url: state.rtspProcess,
      stream_encode_id: state.streamEncodeSelect ? Number(state.streamEncodeSelect) : 0,
      api_server_url: state.apiServer || "",
      pc_serial_number: state.pcSerialNumber || "",
      license_key: state.license || "",
      officer_title_id: state.officer.namePrefixesSelect ? Number(state.officer.namePrefixesSelect) : 0,
      officer_firstname: state.officer.name,
      officer_lastname: state.officer.surname,
      officer_position_id: Number(state.officer.positionsSelect),
      officer_phone: state.officer.phone,
      detection_area: JSON.stringify(defaultDetectionArea),
      visible: 1,
      active: 1,
    }

    return cameraSettings
  }

  const updateCameraSettings = (): CameraDetailSettings | null => {
    if (!selectedRow?.id) {
      console.error("The selected row does not have a valid 'id'.");
      return null;
    }
  
    const requiredFields: (keyof typeof state)[] = [
      "checkpointId",
      "checkpoint",
      "location",
      "rtspProcess",
      "rtspLiveView",
      "streamEncodeSelect",
      "officer",
    ];
  
    const fieldErrorMessages: Record<string, string> = {
      checkpointId: "ID (กล้อง)",
      checkpoint: "Check point (ด่านตรวจ)",
      "location.latitude": "Location Latitude",
      "location.longitude": "Location Longitude",
      rtspProcess: "RTSP Process",
      rtspLiveView: "RTSP Live View",
      streamEncodeSelect: "Stream Encode",
      "officer.namePrefixesSelect": "คำนำหน้า",
      "officer.name": "ชื่อ",
      "officer.surname": "นามสกุล",
      "officer.phone": "เบอร์โทร",
      "officer.positionsSelect": "ตำแหน่ง",
    };
  
    for (const field of requiredFields) {
      const value = state[field as keyof typeof state];
  
      if (typeof value === "object" && value !== null) {
        for (const key in value) {
          const nestedKey = `${field}.${key}`;
          if (key === "positionsSelect" && value[key as keyof typeof value] === 0) {
            continue;
          }
          if (!value[key as keyof typeof value]) {
            PopupMessage(
              "พบข้อผิดพลาด",
              `กรุณากรอกข้อมูลในช่อง '${fieldErrorMessages[nestedKey] || nestedKey}'`,
              "error"
            );
            return null;
          }
        }
      } else if (!value) {
        PopupMessage(
          "พบข้อผิดพลาด",
          `กรุณากรอกข้อมูลในช่อง '${fieldErrorMessages[field] || field}'`,
          "error"
        );
        return null;
      }
    }
  
    const cameraSettings: CameraDetailSettings = {
      id: selectedRow.id,
      cam_id: state.checkpointId,
      cam_uid: selectedRow.cam_uid,
      alpr_cam_id: selectedRow.alpr_cam_id,
      checkpoint_name: state.checkpoint,
      organization: state.organization || "",
      province_id: state.provinceSelect ? Number(state.provinceSelect) : 0,
      district_id: state.districtsSelect ? Number(state.districtsSelect) : 0,
      sub_district_id: state.subDistrictsSelect ? Number(state.subDistrictsSelect) : 0,
      detecion_count: selectedRow.detecion_count,
      route: state.route || "",
      latitude: state.location.latitude,
      longitude: state.location.longitude,
      rtsp_live_url: state.rtspLiveView,
      rtsp_process_url: state.rtspProcess,
      stream_encode_id: state.streamEncodeSelect ? Number(state.streamEncodeSelect) : 0,
      stream_encode: state.streamEncode || "",
      api_server_url: state.apiServer || "",
      live_server_url: selectedRow.live_server_url,
      live_stream_url: selectedRow.live_stream_url,
      wsport: selectedRow.wsport,
      pc_serial_number: state.pcSerialNumber || "",
      license_key: state.license || "",
      officer_title_id: state.officer.namePrefixesSelect ? Number(state.officer.namePrefixesSelect) : 0,
      officer_firstname: state.officer.name,
      officer_lastname: state.officer.surname,
      officer_position_id: state.officer.positionsSelect ? Number(state.officer.positionsSelect) : 0,
      officer_phone: state.officer.phone,
      detection_area: selectedRow.detection_area || "",
      streaming: selectedRow.streaming,
      visible: selectedRow.visible,
      active: selectedRow.active,
      alive: selectedRow.alive,
      last_online: selectedRow.last_online,
      last_check: selectedRow.last_check,
      createdAt: selectedRow.createdAt,
      updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };
  
    return cameraSettings;
  };
  

  const handleSubmit = useCallback(async () => {
    try {
      if (isEditMode && selectedRow) {
        if (!hasChanges()) {
          PopupMessage("ไม่พบการเปลี่ยนแปลง", "ข้อมูลไม่มีการเปลี่ยนแปลง", "warning");
          return;
        }
    
        const updateCameraSetting = updateCameraSettings();
        if (!updateCameraSetting) {
          return;
        }
    
        const result = await dispatch(putCameraSettingThunk(updateCameraSetting));
        
        if (putCameraSettingThunk.rejected.match(result)) {
          PopupMessage("พบข้อผิดพลาด", result.payload || "เกิดข้อผิดพลาดในการอัปเดต", "error");
          return;
        }
    
        PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success");
        closeDialog();
      } 
      else {
        const newCameraSetting = createCameraSettings();
        if (!newCameraSetting) {
          return;
        }
    
        const result = await dispatch(postCameraSettingThunk(newCameraSetting));
    
        if (postCameraSettingThunk.rejected.match(result)) {
          PopupMessage("พบข้อผิดพลาด", result.payload || "เกิดข้อผิดพลาดในการบันทึก", "error");
          return;
        }
    
        PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success");
        closeDialog();
      }
    } 
    catch (error) {
      PopupMessage("พบข้อผิดพลาด", `ไม่สามารถสร้างการตั้งค่ากล้องได้: ${error}`, "error");
    }    
  }, [dispatch, state])

  const handleTextChange = (key: keyof typeof state, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const handleTextLocationChange = (
    key: keyof typeof state.location,
    value: string
  ) => {
    setState((prev) => ({
      ...prev,
      location: { ...prev.location, [key]: value },
    }))
  }

  const handleTextOfficerChange = (
    key: keyof typeof state.officer,
    value: string
  ) => {
    setState((prev) => ({
      ...prev,
      officer: { ...prev.officer, [key]: value },
    }))
  }

  const handleProvinceChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault()
    if (value) {
      handleDropdownChange("provinceSelect", value.value)
    }
    else {
      handleDropdownChange("provinceSelect", '')
      handleDropdownChange("districtsSelect", '')
      handleDropdownChange("subDistrictsSelect", '')
    }
  }

  const handleDistrictChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault()
    if (value) {
      handleDropdownChange("districtsSelect", value.value)
    }
    else {
      handleDropdownChange("districtsSelect", '')
      handleDropdownChange("subDistrictsSelect", '')
    }
  }

  const handleSubDistrictChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault()
    handleDropdownChange("subDistrictsSelect", value ? value.value : '')
  }

  const handleNamePrefixChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault()
    handleDropdownOfficerChange("namePrefixesSelect", value ? value.value : '')
  }

  const handlePositionsChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault()
    handleDropdownOfficerChange("positionsSelect", value ? value.value : '')
  }

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const cleaned = input.replace(/\D/g, '');
    
    if (cleaned.length <= 10) {
      const formatted = formatPhone(cleaned)
      handleTextOfficerChange("phone", formatted)
    }
    return cleaned
  }

  return (
    <div id="camera-setting">
      <div className="bg-black text-white p-[30px] border-[1px] border-dodgerBlue w-full">
        {state.isLoading && <Loading />}
        {/* Header */}
        <div className="border-b-[1px] border-dodgerBlue pb-[20px]">
          <div className="flex justify-between mb-[20px]">
            <label className="text-[20px]">ข้อมูลด่าน</label>
          </div>
          <div className="grid grid-cols-2 lt1443:grid-cols-1 gap-[60px]">
            {/* First Column */}
            <div>
              <div className="grid grid-cols-2 gap-5 my-[10px]">
                <TextBox
                  id="checkpoint"
                  label="Check point (ด่านตรวจ)"
                  placeHolder=""
                  className="w-full"
                  value={state.checkpoint}
                  onChange={(event) =>
                    handleTextChange("checkpoint", event.target.value)
                  }
                />
                <TextBox
                  id="organization"
                  label="ชื่อสำนักงานหรือสาขา"
                  placeHolder=""
                  className="w-full"
                  value={state.organization}
                  onChange={(event) =>
                    handleTextChange("organization", event.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-5 my-[10px]">
                <AutoComplete 
                  id="district-select"
                  sx={{ marginTop: "15px"}}
                  value={state.districtsSelect}
                  onChange={handleDistrictChange}
                  options={districtsOptions}
                  label="District (อำเภอ)"
                  labelFontSize="16px"
                  disabled={state.provinceSelect === 0 || state.provinceSelect === "" ? true : false}
                />
                <AutoComplete 
                  id="sub-district-select"
                  sx={{ marginTop: "15px"}}
                  value={state.subDistrictsSelect}
                  onChange={handleSubDistrictChange}
                  options={subDistrictsOptions}
                  label="Sub District (ตำบล)"
                  labelFontSize="16px"
                  disabled={state.districtsSelect === 0 || state.districtsSelect === "" ? true : false}
                />
              </div>
            </div>
            {/* Second Column */}
            <div>
              <div className="grid grid-cols-2 gap-5 my-[10px]">
                <TextBox
                  id="route"
                  label="Route (ถนน)"
                  placeHolder=""
                  className="w-full"
                  value={state.route}
                  onChange={(event) =>
                    handleTextChange("route", event.target.value)
                  }
                />
                <AutoComplete 
                  id="provice-select"
                  sx={{ marginTop: "15px"}}
                  value={state.provinceSelect}
                  onChange={handleProvinceChange}
                  options={provincesOptions}
                  label="Province (จังหวัด)"
                  labelFontSize="16px"
                />
              </div>
              <div className="grid grid-cols-[auto_auto_50px] gap-5 my-[10px]">
                <TextBox
                  id="latitude"
                  label="Location Latitude"
                  placeHolder=""
                  className="w-full"
                  value={state.location.latitude}
                  onChange={(event) =>
                    handleTextLocationChange("latitude", event.target.value)
                  }
                />
                <TextBox
                  id="longitude"
                  label="Location longitude"
                  placeHolder=""
                  className="w-full"
                  value={state.location.longitude}
                  onChange={(event) =>
                    handleTextLocationChange("longitude", event.target.value)
                  }
                />
                {/* Google Map Icon */}
                <div className="flex items-end">
                  <button
                    className="flex items-center justify-center bg-dodgerBlue w-full h-[40px] rounded-[5px]"
                    onClick={() =>
                      handleButtonClick("isLocationSettingOpen", true)
                    }
                  >
                    <img
                      src="/icons/pin_google-maps.png"
                      alt="Google Map"
                      className="w-[25px] h-[25px]"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-b-[1px] border-dodgerBlue py-[20px]">
          <div className="flex justify-between mb-[20px]">
            <label className="text-[20px]">ข้อมูลกล้อง</label>
            <div>
              <ToggleButton
                onChange={(checked) => handleToggle("startService", checked)}
                checked={state.toggles.startService}
              />
              <label className="ml-[16px]">Start Service</label>
            </div>
          </div>
          <div className="grid grid-cols-2 lt1443:grid-cols-1 gap-[60px]">
            {/* First Column */}
            <div>
              <div className="my-[10px]">
                <TextBox
                  id="checkpoint-id"
                  label="ID (กล้อง)"
                  placeHolder=""
                  className="w-full"
                  value={state.checkpointId}
                  onChange={(event) =>
                    handleTextChange("checkpointId", event.target.value)
                  }
                />
              </div>
              <div className="my-[10px]">
                <TextBox
                  id="rtsp-live-view"
                  label="RTSP Live View"
                  placeHolder=""
                  className="w-full"
                  value={state.rtspLiveView}
                  onChange={(event) =>
                    handleTextChange("rtspLiveView", event.target.value)
                  }
                />
              </div>
              <div className="my-[10px]">
                <TextBox
                  id="rtsp-process"
                  label="RTSP Process"
                  placeHolder=""
                  className="w-full"
                  value={state.rtspProcess}
                  onChange={(event) =>
                    handleTextChange("rtspProcess", event.target.value)
                  }
                />
              </div>
            </div>
            {/* Seconds Column */}
            <div>
              <div className="grid grid-cols-2 gap-5 my-[10px]">
                <SelectBox
                  sx={{ marginTop: "15px"}}
                  id="stream-encode-select"
                  label="Stream Encode"
                  value={state.streamEncodeSelect}
                  onChange={(event) =>
                    {
                      handleDropdownChange("streamEncodeSelect", event.target.value)
                      const selectedStreamEncode = streamEncodes?.data?.find((item) => item.id === Number(event.target.value))
                      if (selectedStreamEncode) {
                        setState((prev) => ({ ...prev, streamEncode: selectedStreamEncode }))
                      }
                    }
                  }
                  options={streamEncodesOptions}
                />
                <TextBox
                  id="api-server"
                  label="API Server"
                  placeHolder=""
                  className="w-full"
                  value={state.apiServer}
                  onChange={(event) =>
                    handleTextChange("apiServer", event.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-5 my-[10px]">
                <TextBox
                  id="pc-serial-number"
                  label="PC Serial Number"
                  placeHolder=""
                  className="w-full"
                  value={state.pcSerialNumber}
                  onChange={(event) =>
                    handleTextChange("pcSerialNumber", event.target.value)
                  }
                />
                <TextBox
                  id="license"
                  label="License"
                  placeHolder=""
                  className="w-full"
                  value={state.license}
                  onChange={(event) =>
                    handleTextChange("license", event.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-5 my-[10px] mt-[40px]">
                <div>
                  <ToggleButton
                    onChange={(checked) =>
                      handleToggle("apiServerStatus", checked)
                    }
                    checked={state.toggles.apiServerStatus}
                  />
                  <label className="ml-[16px]">API Server Status</label>
                </div>
                <div>
                  <ToggleButton
                    onChange={(checked) =>
                      handleToggle("syncDataStatus", checked)
                    }
                    checked={state.toggles.syncDataStatus}
                  />
                  <label className="ml-[16px]">Sync Data Status </label>
                </div>
                <div>
                  <ToggleButton
                    onChange={(checked) =>
                      handleToggle("licenseStatus", checked)
                    }
                    checked={state.toggles.licenseStatus}
                  />
                  <label className="ml-[16px]">License Status</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Middle */}
        <div>
          <div className="flex my-[20px]">
            <label className="text-[20px]">เจ้าหน้าที่</label>
          </div>
          <div className="grid grid-cols-2 gap-[60px]">
            {/* First Column */}
            <div>
              <div className="grid grid-cols-2 gap-5 my-[10px]">
                <AutoComplete 
                  id="name-prefix-select"
                  sx={{ marginTop: "15px"}}
                  value={state.officer.namePrefixesSelect}
                  onChange={handleNamePrefixChange}
                  options={personTitlesOptions}
                  label="คำนำหน้า"
                  labelFontSize="16px"
                />
                <TextBox
                  id="name"
                  label="ชื่อ"
                  placeHolder=""
                  className="w-full"
                  value={state.officer.name}
                  onChange={(event) =>
                    handleTextOfficerChange("name", event.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-5 my-[10px]">
                <TextBox
                  id="phone"
                  label="เบอร์โทร"
                  placeHolder=""
                  className="w-full"
                  value={state.officer.phone}
                  onChange={handlePhoneChange}
                />
              </div>
            </div>
            {/* Seconds Column */}
            <div>
              <div className="grid grid-cols-2 gap-5 my-[10px]">
                <TextBox
                  id="surname"
                  label="นามสกุล"
                  placeHolder=""
                  className="w-full"
                  value={state.officer.surname}
                  onChange={(event) =>
                    handleTextOfficerChange("surname", event.target.value)
                  }
                />
                <AutoComplete 
                  id="position-select"
                  sx={{ marginTop: "15px"}}
                  value={state.officer.positionsSelect}
                  onChange={handlePositionsChange}
                  options={positionsOptions}
                  label="ตำแหน่ง"
                  labelFontSize="16px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="flex justify-end my-6 ml-7">
        <button
          type="button"
          className="flex items-center justify-center bg-dodgerBlue w-[90px] h-[40px] rounded mr-[10px]"
          onClick={() => handleSubmit()}
        >
          <Icon icon={Save} size={20} color="white" />
          <span className="ml-[5px]">บันทึก</span>
        </button>
        <button
          type="button"
          className="bg-white border-[1px] border-dodgerBlue text-dodgerBlue w-[90px] h-[40px] rounded"
          onClick={closeDialog}
        >
          ยกเลิก
        </button>
      </div>
      {/* Location Setting Dialog */}
      <Dialog
        open={state.isLocationSettingOpen}
        onClose={() => handleButtonClick("isLocationSettingOpen", false)}
        className="absolute z-30"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm ">
          <div
            className="border bg-[var(--background-color)] bg-black text-white 
          w-[50%] min-w-[700px] h-[88vh] overflow-y-auto"
          >
            <div className="flex justify-between">
              <DialogTitle className="text-[28px]">Location กล้อง</DialogTitle>
            </div>
            <div className="px-5">
              <LocationSetting
                closeDialog={() =>
                  handleButtonClick("isLocationSettingOpen", false)
                }
                confirmPoint={confirmPoint}
                location={state.location}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default CameraSetting
