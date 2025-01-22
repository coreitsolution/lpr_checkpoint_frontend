import React, { useEffect, useState, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../../app/store"
import {
  Dialog,
  DialogTitle
} from "@mui/material"
import { format } from "date-fns"

// Types
import {
  CameraDetailSettings,
  NewCameraDetailSettings,
} from "../../../features/camera-settings/cameraSettingsTypes"
import { SearchResult } from "../../../types/index"
import { StreamEncodesDetail } from "../../../features/dropdown/dropdownTypes"

// Components
import ToggleButton from "../../../components/toggle-button/ToggleButton"
import TextBox from "../../../components/text-box/TextBox"
import Loading from "../../../components/loading/Loading"
import AutoComplete from "../../../components/auto-complete/AutoComplete"
import SelectBox from '../../../components/select-box/SelectBox'

// API
import {
  fetchDistrictsThunk,
  fetchSubDistrictsThunk,
} from "../../../features/dropdown/dropdownSlice"
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
    policeDivisionsSelect: -1,
    districtsSelect:  0 as number | '',
    subDistrictsSelect: 0,
    checkpoint: "",
    checkpointId: "",
    route: "",
    rtspLiveView: "",
    streamEncodeSelect: 0,
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
      namePrefixesSelect: 0,
      name: "",
      surname: "",
      phone: "",
      positionsSelect: 0,
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
    subDistricts,
    districts,
    policeDivisions,
    officerPrefixes,
    positions,
    streamEncodes
  } = useSelector((state: RootState) => state.dropdown)
  const [provincesOptions, setProvincesOptions] = useState<{ label: string ,value: number }[]>([])
  const [subDistrictsOptions, setSubDistrictsOptions] = useState<{ label: string ,value: number }[]>([])
  const [districtsOptions, setDistrictsOptions] = useState<{ label: string ,value: number }[]>([])
  const [policeDivisionsOptions, setPoliceDivisionsOptions] = useState<{ label: string ,value: number }[]>([])
  const [officerPrefixesOptions, setOfficerPrefixesOptions] = useState<{ label: string ,value: number }[]>([])
  const [positionsOptions, setPositionsOptions] = useState<{ label: string ,value: number }[]>([])
  const [streamEncodesOptions, setStreamEncodesOptions] = useState<{ label: string ,value: number }[]>([])

  useEffect(() => {
    if (
      provinces?.data &&
      provinces?.data?.length > 0 &&
      policeDivisions?.data &&
      policeDivisions?.data?.length > 0 &&
      officerPrefixes?.data && officerPrefixes?.data.length > 0 &&
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
          policeDivisionsSelect: selectedRow.division_id,
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
    policeDivisions,
    districts,
    officerPrefixes,
    positions,
    isEditMode,
    selectedRow,
  ])

  const hasChanges = () => {
    return JSON.stringify(state) !== JSON.stringify(originalData)
  }

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

  const comfirmPoint = (result: SearchResult) => {
    setState((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        latitude: result.location.lat.toString(),
        longitude: result.location.lng.toString(),
      },
    }))
  }
  
  useEffect(() => {
    const fetchData = async () => {
      let query: Record<string, string> = {}
      if (state.provinceSelect) {
        query["filter"] = `province_id:${state.provinceSelect}`
        query["orderBy"] = `name_th`
        await dispatch(fetchDistrictsThunk(query))
      }
      if (state.districtsSelect) {
        query["filter"] = `district_id:${state.districtsSelect},province_id:${state.provinceSelect}`
        query["orderBy"] = `name_th`
        await dispatch(fetchSubDistrictsThunk(query))
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
    if (districts && districts.data) {
      const options = districts.data.map((row) => ({
        label: row.name_th,
        value: row.id,
      }))
      setDistrictsOptions(options)
    }
  }, [districts])

  useEffect(() => {
    if (subDistricts && subDistricts.data) {
      const options = subDistricts.data.map((row) => ({
        label: row.name_th,
        value: row.id,
      }))
      setSubDistrictsOptions(options)
    }
  }, [subDistricts])

  useEffect(() => {
    if (policeDivisions && policeDivisions.data) {
      const options = policeDivisions.data.map((row) => ({
        label: row.title_th,
        value: row.id,
      }))
      setPoliceDivisionsOptions(options)
    }
  }, [policeDivisions])

  useEffect(() => {
    if (officerPrefixes && officerPrefixes.data) {
      const options = officerPrefixes.data.map((row) => ({
        label: row.title_th,
        value: row.id,
      }))
      setOfficerPrefixesOptions(options)
    }
  }, [officerPrefixes])

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

    const cameraSettings: NewCameraDetailSettings = {
      cam_id: state.checkpointId,
      checkpoint_name: state.checkpoint,
      latitude: Number(state.location.latitude),
      longitude: Number(state.location.longitude),
      division_id: Number(state.policeDivisionsSelect),
      province_id: Number(state.provinceSelect),
      district_id: Number(state.districtsSelect),
      sub_district_id: Number(state.subDistrictsSelect),
      route: state.route,
      rtsp_live_url: state.rtspLiveView,
      rtsp_process_url: state.rtspProcess,
      stream_encode_id: state.streamEncodeSelect,
      api_server_url: state.apiServer,
      pc_serial_number: state.pcSerialNumber,
      license_key: state.license,
      officer_title_id: Number(state.officer.namePrefixesSelect),
      officer_firstname: state.officer.name,
      officer_lastname: state.officer.surname,
      officer_position_id: Number(state.officer.positionsSelect),
      officer_phone: state.officer.phone,
      detection_area: JSON.stringify(defaultDetectionArea),
      visible: 1,
      active: 1,
    }

    const isValid = Object.keys(cameraSettings).every((key) => {
      const value = cameraSettings[key as keyof NewCameraDetailSettings]
      if (
        value == null ||
        value === "" ||
        (typeof value === "object" && Object.keys(value).length === 0)
      ) {
        console.error(`Invalid or empty field: ${key}`, value)
        return false
      }
      return true
    })

    if (!isValid) {
      console.error("Camera settings data is invalid.")
      return null
    }

    return cameraSettings
  }

  const updateCameraSettings = (): CameraDetailSettings | null => {
    if (!selectedRow?.id) {
      console.error("The selected row does not have a valid 'id'.")
      return null
    }
    // Check each value for emptiness or missing values
    const cameraSettings: CameraDetailSettings = {
      id: selectedRow.id,
      cam_id: state.checkpointId,
      cam_uid: selectedRow.cam_uid,
      alpr_cam_id: selectedRow.alpr_cam_id,
      checkpoint_name: state.checkpoint,
      division_id: state.policeDivisionsSelect,
      province_id: state.provinceSelect ? state.provinceSelect : 0,
      district_id: state.districtsSelect ? state.districtsSelect : 0,
      sub_district_id: state.subDistrictsSelect,
      detecion_count: selectedRow.detecion_count,
      route: state.route,
      latitude: state.location.latitude,
      longitude: state.location.longitude,
      rtsp_live_url: state.rtspLiveView,
      rtsp_process_url: state.rtspProcess,
      stream_encode_id: state.streamEncodeSelect,
      stream_encode: state.streamEncode,
      api_server_url: state.apiServer,
      live_server_url: selectedRow.live_server_url,
      live_stream_url: selectedRow.live_stream_url,
      wsport: selectedRow.wsport,
      pc_serial_number: state.pcSerialNumber,
      license_key: state.license,
      officer_title_id: state.officer.namePrefixesSelect,
      officer_firstname: state.officer.name,
      officer_lastname: state.officer.surname,
      officer_position_id: state.officer.positionsSelect,
      officer_phone: state.officer.phone,
      detection_area: selectedRow.detection_area,
      streaming: selectedRow.streaming,
      visible: selectedRow.visible,
      active: selectedRow.active,
      alive: selectedRow.alive,
      last_online: selectedRow.last_online,
      last_check: selectedRow.last_check,
      createdAt: selectedRow.createdAt,
      updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    }

    const isValid = Object.entries(cameraSettings).every(([key, value]) => {
      if (key === "last_online" || key === "last_check" || key === "detecion_count") {
        return true
      }
      if (value == null || value === "" || value === 0) {
        console.error(`Invalid or empty field: ${key}`, value)
        return false
      }
      return true
    })

    if (!isValid) {
      PopupMessage("พบข้อผิดพลาด", "ข้อมูลการตั้งค่ากล้องไม่ถูกต้อง", "error")
      return null
    }

    return cameraSettings
  }

  const handleSubmit = useCallback(async () => {
    try {
      if (isEditMode && selectedRow) {
        if (!hasChanges()) {
          PopupMessage(
            "ไม่พบการเปลี่ยนแปลง",
            "ข้อมูลไม่มีการเปลี่ยนแปลง",
            "warning"
          )
          return
        } else {
          const updateCameraSetting = updateCameraSettings()
          if (updateCameraSetting) {
            await dispatch(putCameraSettingThunk(updateCameraSetting))
            PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success")
            closeDialog()
          } else {
            PopupMessage("พบข้อผิดพลาด", "กรุณาใส่ข้อมูลให้ครบถ้วน", "error")
          }
        }
      } else {
        const newCameraSetting = createCameraSettings()
        if (newCameraSetting) {
          await dispatch(postCameraSettingThunk(newCameraSetting))
          PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success")
          closeDialog()
        } else {
          PopupMessage("พบข้อผิดพลาด", "กรุณาใส่ข้อมูลให้ครบถ้วน", "error")
        }
      }
    } catch (error) {
      PopupMessage(
        "พบข้อผิดพลาด",
        `ไม่สามารถสร้างการตั้งค่ากล้องได้: ${error}`,
        "error"
      )
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

  const handlePoliceDivisionChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault()
    if (value) {
      handleDropdownChange("policeDivisionsSelect", value.value)
      if (provinces && provinces.data) {
        const province_id = provinces.data.find((data) => data.police_region_id === value.value)?.id
        console.log(province_id)
        handleDropdownChange("provinceSelect", province_id ? province_id as any : '')
      }
    }
    else {
      handleDropdownChange("policeDivisionsSelect", '')
      handleDropdownChange("provinceSelect", '')
    }
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

  return (
    <div id="camera-setting">
      <div className="bg-black text-white p-[30px] border-[1px] border-dodgerBlue w-full">
        {state.isLoading && <Loading />}
        {/* Header */}
        <div className="border-b-[1px] border-dodgerBlue pb-[20px]">
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
                  label="ID (จุดตรวจ)"
                  placeHolder=""
                  className="w-full"
                  value={state.checkpointId}
                  onChange={(event) =>
                    handleTextChange("checkpointId", event.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-5 my-[10px]">
                <AutoComplete 
                  id="police-division-select"
                  sx={{ marginTop: "15px"}}
                  value={state.policeDivisionsSelect}
                  onChange={handlePoliceDivisionChange}
                  options={policeDivisionsOptions}
                  label="Police Division (ภาค)*"
                  labelFontSize="16px"
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
              <div className="my-[10px]">
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
              <div className="grid grid-cols-2 gap-5 my-[10px] mt-[40px]">
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
              </div>
            </div>
            {/* Seconds Column */}
            <div>
              <div className="my-[10px]">
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
              <div className="grid grid-cols-2 gap-5 my-[10px] mt-[40px]">
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
                  options={officerPrefixesOptions}
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
                  onChange={(event) =>
                    handleTextOfficerChange("phone", event.target.value)
                  }
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
                  label="คำนำหน้า"
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
                comfirmPoint={comfirmPoint}
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
