import React, {useEffect, useState, useCallback} from 'react'
import {
  SelectChangeEvent,
} from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../../app/store"
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

// Types
import {
  CameraSettings,
  CreateCameraSettings  
} from '../../../features/camera-settings/cameraSettingsTypes'
import { SearchResult } from '../../../types/index'
import { Province, Districts, SubDistricts } from '../../../features/dropdown/dropdownTypes'

// Components
import ToggleButton from '../../../components/toggle-button/ToggleButton'
import TextBox from '../../../components/text-box/TextBox'
import SelectBox from '../../../components/select-box/SelectBox'
import Loading from "../../../components/loading/Loading"
// API
import { 
  fetchProvincesThunk,
  fetchPoliceDivisionsThunk,
  fetchDistrictsThunk,
  fetchSubDistrictsThunk,
  fetchNamePrefixesThunk,
  fetchPositionThunk,
} from "../../../features/dropdown/dropdownSlice"
import { 
  postCameraSettingThunk,
  putCameraSettingThunk,
} from "../../../features/camera-settings/cameraSettingsSlice"

// Icon
import { Icon } from '../../../components/icons/Icon'
import { Save } from 'lucide-react'

// Modules
import LocationSetting from '../location-setting/LocationSetting'

// Pop-up
import PopupMessage from "../../../utils/popupMessage"

interface CameraSettingProps {
  closeDialog: () => void
  selectedRow: CameraSettings | null
  isEditMode: boolean
}

const CameraSetting: React.FC<CameraSettingProps> = ({closeDialog, selectedRow, isEditMode}) => {
  const [originalData, setOriginalData] = useState<CameraSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [state, setState] = useState({
    policeDivision: "",
    isLoading: false,
    isLocationSettingOpen: false,
    isSensorSettingOpen: false,
    provinceSelect: "",
    policeDivisionsSelect: "",
    districtsSelect: "",
    subDistrictsSelect: "",
    checkpoint: "",
    checkpointId: "",
    route: "",
    rtspLiveView: "",
    streamEncode: "",
    apiServer: "",
    rtspProcess: "",
    number_of_detections: 0,
    pcSerialNumber: "",
    license: "",
    location: {
      latitude: "",
      longtitude: "",
    },
    officer: {
      namePrefixesSelect: "",
      name: "",
      surname: "",
      phone: "",
      positionsSelect: "",
    },
    toggles: {
      startService: false,
      apiServerStatus: false,
      syncDataStatus: false,
      licenseStatus: false,
    },
  })

  const dispatch: AppDispatch = useDispatch()
  const dropdown = useSelector((state: RootState) => state.dropdown)

  const fetchData = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))
    await Promise.all([
      dispatch(fetchProvincesThunk()),
      dispatch(fetchPoliceDivisionsThunk()),
      dispatch(fetchDistrictsThunk()),
      dispatch(fetchNamePrefixesThunk()),
      dispatch(fetchPositionThunk()),
    ])
    setState((prev) => ({ ...prev, isLoading: false }))
  }

  useEffect(() => {
    fetchData()
  }, [dispatch])

  useEffect(() => {
    if (
      dropdown.provinces.length > 0 &&
      dropdown.policeDivisions.length > 0 &&
      dropdown.districts.length > 0 &&
      dropdown.namePrefixes.length > 0 &&
      dropdown.positions.length > 0
    ) {
      setIsLoading(false)
      if (isEditMode && selectedRow) {
        setState((prev) => ({
          ...prev,
          id: selectedRow.id,
          isLoading: false,
          isLocationSettingOpen: false,
          isSensorSettingOpen: false,
          provinceSelect: selectedRow.province,
          districtsSelect: selectedRow.district,
          subDistrictsSelect: selectedRow.sub_district,
          policeDivisionsSelect: selectedRow.police_division,
          checkpoint: selectedRow.checkpoint,
          checkpointId: selectedRow.checkpoint_id,
          route: selectedRow.route,
          rtspLiveView: selectedRow.rtsp_live_view,
          streamEncode: selectedRow.stream_encode,
          apiServer: selectedRow.api_server,
          rtspProcess: selectedRow.rtsp_process,
          pcSerialNumber: selectedRow.pc_serial_number,
          number_of_detections: selectedRow.number_of_detections,
          license: selectedRow.license,
          location: {
            latitude: selectedRow.latitude,
            longtitude: selectedRow.longtitude,
          },
          officer: {
            namePrefixesSelect: selectedRow.officer.prefix,
            name: selectedRow.officer.name,
            surname: selectedRow.officer.surname,
            phone: selectedRow.officer.phone,
            positionsSelect: selectedRow.officer.position,
          },
          toggles: {
            startService: selectedRow.camera_status === 1 ? true : false,
            apiServerStatus: selectedRow.api_server_status === 1 ? true : false,
            syncDataStatus: selectedRow.sync_data_status === 1 ? true : false,
            licenseStatus: selectedRow.license_status === 1 ? true : false,
          }
          }))
        setOriginalData(selectedRow)
      } 
    }
  }, [
    dropdown.provinces,
    dropdown.policeDivisions,
    dropdown.districts,
    dropdown.namePrefixes,
    dropdown.positions,
    isEditMode,
    selectedRow
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

  const handleDropdownOfficerChange = (key: keyof typeof state.officer, value: string) => {
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
        longtitude: result.location.lng.toString(),
      },
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      if (state.districtsSelect) {
        const districtsId = dropdown.districts.find((row) => row.name_th === state.districtsSelect)?.id
        if (districtsId) {
          await dispatch(fetchSubDistrictsThunk(districtsId))
        }
      }
    }
    fetchData()
  }, [dispatch, state.districtsSelect])

  const provinceOptions = dropdown.provinces.map((row) => ({
    value: row.name_th,
    label: row.name_th,
  }));
  
  const policeDivisionOptions = dropdown.policeDivisions.map((row) => ({
    value: row.police_division,
    label: row.police_division,
  }));
  
  const districtOptions = dropdown.districts
    .filter(
      (district: Districts) =>
        district.province_id === 
        dropdown.provinces.find((province: Province) => state.provinceSelect === province.name_th)?.id
    )
    .map((row) => ({
      value: row.name_th,
      label: row.name_th,
    }));
  
  const subDistrictOptions = dropdown.subDistricts
    .filter(
      (subDistrict: SubDistricts) =>
        subDistrict.district_id === 
        dropdown.districts.find((district: Districts) => state.districtsSelect === district.name_th)?.id
    )
    .map((row) => ({
      value: row.name_th,
      label: row.name_th,
    }));
  
  const namePrefixOptions = dropdown.namePrefixes.map((row) => ({
    value: row.name_th,
    label: row.name_th,
  }));
  
  const positionOptions = dropdown.positions.map((row) => ({
    value: row.name_th,
    label: row.name_th,
  }));
  
  const options = {
    province: provinceOptions,
    policeDivision: policeDivisionOptions,
    districts: districtOptions,
    subDistricts: subDistrictOptions,
    namePrefixes: namePrefixOptions,
    positions: positionOptions,
  };

  const createCameraSettings = (): CreateCameraSettings | null => {
    // Check each value for emptiness or missing values
    const cameraSettings: CreateCameraSettings = {
      camera_status: state.toggles.startService ? 1 : 0,
      checkpoint_id: state.checkpointId,
      checkpoint: state.checkpoint,
      latitude: state.location.latitude,
      longtitude: state.location.longtitude,
      number_of_detections: 0,
      police_division: state.policeDivisionsSelect,
      province: state.provinceSelect,
      district: state.districtsSelect,
      sub_district: state.subDistrictsSelect,
      route: state.route,
      rtsp_live_view: state.rtspLiveView,
      rtsp_process: state.rtspProcess,
      stream_encode: state.streamEncode,
      api_server: state.apiServer,
      pc_serial_number: state.pcSerialNumber,
      license: state.license,
      api_server_status: state.toggles.apiServerStatus ? 1 : 0,
      sync_data_status: state.toggles.syncDataStatus ? 1 : 0,
      license_status: state.toggles.licenseStatus ? 1 : 0,
      officer: {
        prefix: state.officer.namePrefixesSelect,
        name: state.officer.name,
        surname: state.officer.surname,
        position: state.officer.positionsSelect,
        phone: state.officer.phone,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  
    const isValid = Object.keys(cameraSettings).every(key => {
      const value = cameraSettings[key as keyof CreateCameraSettings]
      if (value == null || value === "" || (typeof value === "object" && Object.keys(value).length === 0)) {
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

  const updateCameraSettings = (): CameraSettings | null => {
    if (!selectedRow?.id) {
      console.error("The selected row does not have a valid 'id'.");
      return null;
    }
    // Check each value for emptiness or missing values
    const cameraSettings: CameraSettings = {
      id: selectedRow.id,
      camera_status: state.toggles.startService ? 1 : 0,
      checkpoint_id: state.checkpointId,
      checkpoint: state.checkpoint,
      latitude: state.location.latitude,
      longtitude: state.location.longtitude,
      number_of_detections: state.number_of_detections,
      police_division: state.policeDivisionsSelect,
      province: state.provinceSelect,
      district: state.districtsSelect,
      sub_district: state.subDistrictsSelect,
      route: state.route,
      rtsp_live_view: state.rtspLiveView,
      rtsp_process: state.rtspProcess,
      stream_encode: state.streamEncode,
      api_server: state.apiServer,
      pc_serial_number: state.pcSerialNumber,
      license: state.license,
      api_server_status: state.toggles.apiServerStatus ? 1 : 0,
      sync_data_status: state.toggles.syncDataStatus ? 1 : 0,
      license_status: state.toggles.licenseStatus ? 1 : 0,
      officer: {
        prefix: state.officer.namePrefixesSelect,
        name: state.officer.name,
        surname: state.officer.surname,
        position: state.officer.positionsSelect,
        phone: state.officer.phone,
      },
      updated_at: new Date().toISOString(),
    }

    const isValid = Object.keys(cameraSettings).every(key => {
      const value = cameraSettings[key as keyof CameraSettings]
      if (value == null || value === "") {
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

  const handleSubmit = useCallback(async () => {
    try {
      if (isEditMode && selectedRow) {
        if (!hasChanges()) {
          PopupMessage("ไม่พบการเปลี่ยนแปลง", "ข้อมูลไม่มีการเปลี่ยนแปลง", "warning")
          return
        }
        else {
          const updateCameraSetting = updateCameraSettings()
          if (updateCameraSetting) {
            await dispatch(putCameraSettingThunk(updateCameraSetting))
            closeDialog()
          } 
          else {
            PopupMessage("พบข้อผิดพลาด", "กรุณาใส่ข้อมูลให้ครบถ้วน", 'error')
          }
        }
      }
      else {
        const newCameraSetting = createCameraSettings()
        if (newCameraSetting) {
          await dispatch(postCameraSettingThunk(newCameraSetting))
          closeDialog()
        } 
        else {
          PopupMessage("พบข้อผิดพลาด", "กรุณาใส่ข้อมูลให้ครบถ้วน", 'error')
        }
      }
    } 
    catch (error) {
      PopupMessage("พบข้อผิดพลาด", `ไม่สามารถสร้างการตั้งค่ากล้องได้: ${error}`, 'error')
    }
  }, [dispatch, state])

  const handleTextChange = (key: keyof typeof state, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const handleTextLocationChange = (key: keyof typeof state.location, value: string) => {
    setState((prev) => ({ 
      ...prev, 
      location: { ...prev.location, [key]: value },
    }))
  }

  const handleTextOfficerChange = (key: keyof typeof state.officer, value: string) => {
    setState((prev) => ({
      ...prev, 
      officer: { ...prev.officer, [key]: value },
    }))
  }
  
  return (
    <div id='camera-setting'>
      {isLoading && <Loading />}
      <div className="bg-black text-white p-[30px] border-[1px] border-dodgerBlue w-full">
        {state.isLoading && <Loading />}
        {/* Header */}
        <div className='border-b-[1px] border-dodgerBlue pb-[20px]'>
          <div className='flex justify-between mb-[20px]'>
            <label className='text-[20px]'>ข้อมูลกล้อง</label>
            <div>
              <ToggleButton 
                onChange={(checked) => handleToggle('startService', checked)}
                checked={state.toggles.startService}
              />
              <label className='ml-[16px]'>Start Service</label>
            </div>
          </div>
          <div className='grid grid-cols-2 lt1443:grid-cols-1 gap-[60px]'>
            {/* First Column */}
            <div>
              <div className='my-[10px]'>
                <TextBox
                  id="checkpoint-id"
                  label="ID (จุดตรวจ)"
                  placeHolder=""
                  className="w-full"
                  value={state.checkpointId}
                  onChange={(value) => handleTextChange('checkpointId', value)}
                />
              </div>
              <div className='grid grid-cols-2 gap-5 my-[10px]'>
                <SelectBox
                  sx={{ marginTop: "15px" }}
                  id="police-divisions"
                  className="w-full"
                  value={state.policeDivisionsSelect}
                  onChange={(event: SelectChangeEvent<any>) => handleDropdownChange('policeDivisionsSelect', event.target.value)}
                  options={options.policeDivision}
                  label="Police Division (ภาค)"
                />
                <SelectBox
                  sx={{ marginTop: "15px" }}
                  id="province"
                  className="w-full"
                  value={state.provinceSelect}
                  onChange={(event: SelectChangeEvent<any>) => handleDropdownChange('provinceSelect', event.target.value)}
                  options={options.province}
                  label="Province (จังหวัด)"
                />
              </div>
              <div className='my-[10px]'>
                <TextBox
                  id="route"
                  label="Route (ถนน)"
                  placeHolder=""
                  className="w-full"
                  value={state.route}
                  onChange={(value) => handleTextChange('route', value)}
                />
              </div>
              <div className='my-[10px]'>
                <TextBox
                  id="rtsp-live-view"
                  label="RTSP Live View"
                  placeHolder=""
                  className="w-full"
                  value={state.rtspLiveView}
                  onChange={(value) => handleTextChange('rtspLiveView', value)}
                />
              </div>
              <div className='grid grid-cols-2 gap-5 my-[10px]'>
                <TextBox
                  id="stream-encode"
                  label="Steam Encode"
                  placeHolder=""
                  className="w-full"
                  value={state.streamEncode}
                  onChange={(value) => handleTextChange('streamEncode', value)}
                />
                <TextBox
                  id="api-server"
                  label="API Server"
                  placeHolder=""
                  className="w-full"
                  value={state.apiServer}
                  onChange={(value) => handleTextChange('apiServer', value)}
                />
              </div>
              <div className='grid grid-cols-2 gap-5 my-[10px] mt-[40px]'>
                <div>
                  <ToggleButton 
                    onChange={(checked) => handleToggle('apiServerStatus', checked)}
                    checked={state.toggles.apiServerStatus}
                  />
                  <label className='ml-[16px]'>API Server Status</label>
                </div>
                <div>
                  <ToggleButton 
                    onChange={(checked) => handleToggle('syncDataStatus', checked)}
                    checked={state.toggles.syncDataStatus}
                  />
                  <label className='ml-[16px]'>Sync Data Status </label>
                </div>
              </div>
            </div>
            {/* Seconds Column */}
            <div>
              <div className='my-[10px]'>
                <TextBox
                  id="checkpoint"
                  label="Check point (ด่านตรวจ)"
                  placeHolder=""
                  className="w-full"
                  value={state.checkpoint}
                  onChange={(value) => handleTextChange('checkpoint', value)}
                />
              </div>
              <div className='grid grid-cols-2 gap-5 my-[10px]'>
                <SelectBox
                  sx={{ marginTop: "15px" }}
                  id="district"
                  className="w-full"
                  value={state.districtsSelect}
                  onChange={(event: SelectChangeEvent<any>) => handleDropdownChange('districtsSelect', event.target.value)}
                  options={options.districts}
                  label="District (อำเภอ)"
                  disabled={state.provinceSelect === '' ? true : false}
                />
                <SelectBox
                  sx={{ marginTop: "15px" }}
                  id="sub-district"
                  className="w-full"
                  value={state.subDistrictsSelect}
                  onChange={(event: SelectChangeEvent<any>) => handleDropdownChange('subDistrictsSelect', event.target.value)}
                  options={options.subDistricts}
                  label="Sub District (ตำบล)"
                  disabled={state.districtsSelect === '' ? true : false}
                />
              </div>
              <div className='grid grid-cols-[auto_auto_50px] gap-5 my-[10px]'>
                <TextBox
                  id="latitude"
                  label="Location Latitude"
                  placeHolder=""
                  className="w-full"
                  value={state.location.latitude}
                  onChange={(value) => handleTextLocationChange('latitude', value)}
                />
                <TextBox
                  id="longtitude"
                  label="Location Longtitude"
                  placeHolder=""
                  className="w-full"
                  value={state.location.longtitude}
                  onChange={(value) => handleTextLocationChange('longtitude', value)}
                />
                {/* Google Map Icon */}
                <div className='flex items-end'>
                  <button 
                    className='flex items-center justify-center bg-dodgerBlue w-full h-[40px] rounded-[5px]'
                    onClick={() => handleButtonClick("isLocationSettingOpen", true)}
                  >
                    <img src="/icons/pin_google-maps.png" alt="Google Map" className='w-[25px] h-[25px]' />
                  </button>
                </div>
              </div>
              <div className='my-[10px]'>
                <TextBox
                  id="rtsp-process"
                  label="RTSP Process"
                  placeHolder=""
                  className="w-full"
                  value={state.rtspProcess}
                  onChange={(value) => handleTextChange('rtspProcess', value)}
                />
              </div>
              <div className='grid grid-cols-2 gap-5 my-[10px]'>
                <TextBox
                  id="pc-serial-number"
                  label="PC Serial Number"
                  placeHolder=""
                  className="w-full"
                  value={state.pcSerialNumber}
                  onChange={(value) => handleTextChange('pcSerialNumber', value)}
                />
                <TextBox
                  id="license"
                  label="License"
                  placeHolder=""
                  className="w-full"
                  value={state.license}
                  onChange={(value) => handleTextChange('license', value)}
                />
              </div>
              <div className='grid grid-cols-2 gap-5 my-[10px] mt-[40px]'>
                <div>
                  <ToggleButton 
                    onChange={(checked) => handleToggle('licenseStatus', checked)}
                    checked={state.toggles.licenseStatus}
                  />
                  <label className='ml-[16px]'>License Status</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Middle */}
        <div>
          <div className='flex my-[20px]'>
            <label className='text-[20px]'>เจ้าหน้าที่</label>
          </div>
          <div className='grid grid-cols-2 gap-[60px]'>
            {/* First Column */}
            <div>
              <div className='grid grid-cols-2 gap-5 my-[10px]'>
                <SelectBox
                  sx={{ marginTop: "15px" }}
                  id="name-prefix"
                  className="w-full"
                  value={state.officer.namePrefixesSelect}
                  onChange={(event: SelectChangeEvent<any>) => handleDropdownOfficerChange('namePrefixesSelect', event.target.value)}
                  options={options.namePrefixes}
                  label="คำนำหน้า"
                />
                <TextBox
                  id="name"
                  label="ชื่อ"
                  placeHolder=""
                  className="w-full"
                  value={state.officer.name}
                  onChange={(value) => handleTextOfficerChange('name', value)}
                />
              </div>
              <div className='grid grid-cols-2 gap-5 my-[10px]'>
                <TextBox
                  id="phone"
                  label="เบอร์โทร"
                  placeHolder=""
                  className="w-full"
                  value={state.officer.phone}
                  onChange={(value) => handleTextOfficerChange('phone', value)}
                />
              </div>
            </div>
            {/* Seconds Column */}
            <div>
              <div className='grid grid-cols-2 gap-5 my-[10px]'>
                <TextBox
                  id="surname"
                  label="นามสกุล"
                  placeHolder=""
                  className="w-full"
                  value={state.officer.surname}
                  onChange={(value) => handleTextOfficerChange('surname', value)}
                />
                <SelectBox
                  sx={{ marginTop: "15px" }}
                  id="position"
                  className="w-full"
                  value={state.officer.positionsSelect}
                  onChange={(event: SelectChangeEvent<any>) => handleDropdownOfficerChange('positionsSelect', event.target.value)}
                  options={options.positions}
                  label="ตำแหน่ง"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className='flex justify-end my-6 ml-7'>
        <button 
          type="button" 
          className="flex items-center justify-center bg-dodgerBlue w-[90px] h-[40px] rounded mr-[10px]" 
          onClick={() => handleSubmit()}
        >
          <Icon icon={Save} size={20} color='white' />
          <span className='ml-[5px]'>บันทึก</span>
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
      <Dialog open={state.isLocationSettingOpen} onClose={() => handleButtonClick("isLocationSettingOpen", false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-25 backdrop-blur-sm ">
          <DialogPanel 
          className="space-y-4 border bg-[var(--background-color)] p-5 bg-black text-white 
          w-[50%] min-w-[700px] h-full max-h-[850px] overflow-y-auto"
          >
            <div className="flex justify-between">
              <DialogTitle className="text-[28px]">Location กล้อง</DialogTitle>
            </div>
            <LocationSetting 
              closeDialog={() => handleButtonClick("isLocationSettingOpen", false)} 
              comfirmPoint={comfirmPoint}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default CameraSetting