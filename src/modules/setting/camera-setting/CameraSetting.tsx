import React, { useEffect, useState, useCallback } from "react";
import { SelectChangeEvent } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../app/store";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { format } from "date-fns";

// Types
import {
  CameraSettings,
  CreateCameraSettings,
  CameraDetailSettings,
  NewCameraDetailSettings,
} from "../../../features/camera-settings/cameraSettingsTypes";
import { SearchResult } from "../../../types/index";

// Components
import ToggleButton from "../../../components/toggle-button/ToggleButton";
import TextBox from "../../../components/text-box/TextBox";
import SelectBox from "../../../components/select-box/SelectBox";
import Loading from "../../../components/loading/Loading";

// API
import {
  fetchProvincesThunk,
  fetchPoliceDivisionsThunk,
  fetchDistrictsThunk,
  fetchSubDistrictsThunk,
  fetchCommonPrefixesThunk,
  fetchOfficerPrefixesThunk,
  fetchPositionThunk,
} from "../../../features/dropdown/dropdownSlice";
import {
  postCameraSettingThunk,
  putCameraSettingThunk,
} from "../../../features/camera-settings/cameraSettingsSlice";

// Icon
import { Icon } from "../../../components/icons/Icon";
import { Save } from "lucide-react";

// Modules
import LocationSetting from "../location-setting/LocationSetting";

// Pop-up
import PopupMessage from "../../../utils/popupMessage";
interface CameraSettingProps {
  closeDialog: () => void;
  selectedRow: CameraDetailSettings | null;
  isEditMode: boolean;
}

const CameraSetting: React.FC<CameraSettingProps> = ({
  closeDialog,
  selectedRow,
  isEditMode,
}) => {
  const [originalData, setOriginalData] = useState<CameraDetailSettings | null>(
    null
  );
  const [state, setState] = useState({
    id: undefined as number | undefined,
    policeDivision: "",
    isLoading: false,
    isLocationSettingOpen: false,
    isSensorSettingOpen: false,
    provinceSelect: '',
    policeDivisionsSelect: '',
    districtsSelect: '',
    subDistrictsSelect: '',
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
      longitude: "",
    },
    officer: {
      namePrefixesSelect: '',
      name: "",
      surname: "",
      phone: "",
      positionsSelect: '',
    },
    toggles: {
      startService: false,
      apiServerStatus: false,
      syncDataStatus: false,
      licenseStatus: false,
    },
  });

  const dispatch: AppDispatch = useDispatch();
  const {
    provinces,
    subDistricts,
    districts,
    policeDivisions,
    officerPrefixes,
    positions,
  } = useSelector((state: RootState) => state.dropdown);
  const [provincesOptions, setProvincesOptions] = useState<{ label: string; value: number }[]>([]);
  const [subDistrictsOptions, setSubDistrictsOptions] = useState<{ label: string; value: number }[]>([]);
  const [districtsOptions, setDistrictsOptions] = useState<{ label: string; value: number }[]>([]);
  const [policeDivisionsOptions, setPoliceDivisionsOptions] = useState<{ label: string; value: number }[]>([]);
  const [officerPrefixesOptions, setOfficerPrefixesOptions] = useState<{ label: string; value: number }[]>([]);
  const [positionsOptions, setPositionsOptions] = useState<{ label: string; value: number }[]>([]);

  const fetchData = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    await Promise.all([
      dispatch(fetchProvincesThunk("?orderBy=name_th")),
      dispatch(fetchPoliceDivisionsThunk()),
      dispatch(fetchOfficerPrefixesThunk()),
      dispatch(fetchPositionThunk()),
    ]);
    setState((prev) => ({ ...prev, isLoading: false }));
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

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
          provinceSelect: selectedRow.province_id.toString(),
          districtsSelect: selectedRow.district_id.toString(),
          subDistrictsSelect: selectedRow.sub_district_id.toString(),
          policeDivisionsSelect: selectedRow.division_id.toString(),
          checkpoint: selectedRow.checkpoint_name,
          checkpointId: selectedRow.cam_id,
          route: selectedRow.route,
          rtspLiveView: selectedRow.rtsp_live_url,
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
            namePrefixesSelect: selectedRow.officer_title_id.toString(),
            name: selectedRow.officer_firstname,
            surname: selectedRow.officer_lastname,
            phone: selectedRow.officer_phone,
            positionsSelect: selectedRow.officer_position_id.toString(),
          },
          toggles: {
            startService: false,
            apiServerStatus: false,
            syncDataStatus: false,
            licenseStatus: false,
          },
        }));
        setOriginalData(selectedRow);
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
  ]);

  const hasChanges = () => {
    return JSON.stringify(state) !== JSON.stringify(originalData);
  };

  const handleToggle = (key: keyof typeof state.toggles, value: boolean) => {
    setState((prev) => ({
      ...prev,
      toggles: { ...prev.toggles, [key]: value },
    }));
  };

  const handleDropdownChange = (key: keyof typeof state, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleDropdownOfficerChange = (
    key: keyof typeof state.officer,
    value: string
  ) => {
    setState((prev) => ({
      ...prev,
      officer: { ...prev.officer, [key]: value },
    }));
  };

  const handleButtonClick = (key: keyof typeof state, value: boolean) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const comfirmPoint = (result: SearchResult) => {
    setState((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        latitude: result.location.lat.toString(),
        longitude: result.location.lng.toString(),
      },
    }));
  };
  
  useEffect(() => {
    const fetchData = async () => {
      if (state.provinceSelect) {
        await dispatch(fetchDistrictsThunk(`?filter=province_id:${state.provinceSelect}`));
      }
      if (state.districtsSelect) {
        await dispatch(
          fetchSubDistrictsThunk(`?filter=district_id:${state.districtsSelect},province_id:${state.provinceSelect}`)
        );
      }
    };
    fetchData();
  }, [dispatch, state.provinceSelect, state.districtsSelect]);

  useEffect(() => {
    if (provinces && provinces.data) {
      const options = provinces.data.map((row) => ({
        label: row.name_th,
        value: row.id,
      }));
      setProvincesOptions(options);
    }
  }, [provinces]);

  useEffect(() => {
    if (districts && districts.data) {
      const options = districts.data.map((row) => ({
        label: row.name_th,
        value: row.id,
      }));
      setDistrictsOptions(options);
    }
  }, [districts]);

  useEffect(() => {
    if (subDistricts && subDistricts.data) {
      const options = subDistricts.data.map((row) => ({
        label: row.name_th,
        value: row.id,
      }));
      setSubDistrictsOptions(options);
    }
  }, [subDistricts]);

  useEffect(() => {
    if (policeDivisions && policeDivisions.data) {
      const options = policeDivisions.data.map((row) => ({
        label: row.title_th,
        value: row.id,
      }));
      setPoliceDivisionsOptions(options);
    }
  }, [policeDivisions]);

  useEffect(() => {
    if (officerPrefixes && officerPrefixes.data) {
      const options = officerPrefixes.data.map((row) => ({
        label: row.title_th,
        value: row.id,
      }));
      setOfficerPrefixesOptions(options);
    }
  }, [officerPrefixes]);

  useEffect(() => {
    if (positions && positions.data) {
      const options = positions.data.map((row) => ({
        label: row.position_th,
        value: row.id,
      }));
      setPositionsOptions(options);
    }
  }, [positions]);

  const createCameraSettings = (): NewCameraDetailSettings | null => {
    const defaultDetectionArea = {
      frame: {
        width: 850,
        height: 450,
      },
      points: [
        { x: 0, y:100 },
        { x: 850, y:100 },
        { x: 850, y:350 },
        { x: 0, y:350 },
        { x: 0, y:100 }
      ]
    }

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
      stream_encode: state.streamEncode,
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
    };

    const isValid = Object.keys(cameraSettings).every((key) => {
      const value = cameraSettings[key as keyof NewCameraDetailSettings];
      if (
        value == null ||
        value === "" ||
        (typeof value === "object" && Object.keys(value).length === 0)
      ) {
        console.error(`Invalid or empty field: ${key}`, value);
        return false;
      }
      return true;
    });

    if (!isValid) {
      console.error("Camera settings data is invalid.");
      return null;
    }

    return cameraSettings;
  };

  const updateCameraSettings = (): CameraDetailSettings | null => {
    if (!selectedRow?.id) {
      console.error("The selected row does not have a valid 'id'.");
      return null;
    }
    // Check each value for emptiness or missing values
    const cameraSettings: CameraDetailSettings = {
      id: selectedRow.id,
      cam_id: state.checkpointId,
      cam_uid: selectedRow.cam_uid,
      checkpoint_name: state.checkpoint,
      division_id: Number(state.policeDivisionsSelect),
      province_id: Number(state.provinceSelect),
      district_id: Number(state.districtsSelect),
      sub_district_id: Number(state.subDistrictsSelect),
      number_of_detections: 0,
      route: state.route,
      latitude: state.location.latitude,
      longitude: state.location.longitude,
      rtsp_live_url: state.rtspLiveView,
      rtsp_process_url: state.rtspProcess,
      stream_encode: state.streamEncode,
      api_server_url: state.apiServer,
      live_server_url: selectedRow.live_server_url,
      live_stream_url: selectedRow.live_stream_url,
      wsport: selectedRow.wsport,
      pc_serial_number: state.pcSerialNumber,
      license_key: state.license,
      officer_title_id: Number(state.officer.namePrefixesSelect),
      officer_firstname: state.officer.name,
      officer_lastname: state.officer.surname,
      officer_position_id: Number(state.officer.positionsSelect),
      officer_phone: state.officer.phone,
      detection_area: selectedRow.detection_area,
      streaming: selectedRow.streaming,
      visible: selectedRow.visible,
      active: selectedRow.active,
      alive: selectedRow.alive,
      last_online: selectedRow.last_online,
      last_check: selectedRow.last_check,
      createdAt: selectedRow.createdAt,
      updatedAt: format(new Date(), "yyyy-MM-dd hh:mm:ss"),
    }

    const isValid = Object.entries(cameraSettings).every(([key, value]) => {
      if (key === "last_online" || key === "last_check") {
        return true
      }
      if (value == null || value === "") {
        console.error(`Invalid or empty field: ${key}`, value);
        return false
      }
      return true
    });

    if (!isValid) {
      console.error("Camera settings data is invalid.");
      return null
    }

    return cameraSettings
  };

  const handleSubmit = useCallback(async () => {
    try {
      if (isEditMode && selectedRow) {
        if (!hasChanges()) {
          PopupMessage(
            "ไม่พบการเปลี่ยนแปลง",
            "ข้อมูลไม่มีการเปลี่ยนแปลง",
            "warning"
          );
          return;
        } else {
          const updateCameraSetting = updateCameraSettings();
          if (updateCameraSetting) {
            await dispatch(putCameraSettingThunk(updateCameraSetting));
            PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success");
            closeDialog();
          } else {
            PopupMessage("พบข้อผิดพลาด", "กรุณาใส่ข้อมูลให้ครบถ้วน", "error");
          }
        }
      } else {
        const newCameraSetting = createCameraSettings();
        if (newCameraSetting) {
          await dispatch(postCameraSettingThunk(newCameraSetting));
          PopupMessage("บันทึกสำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย", "success");
          closeDialog();
        } else {
          PopupMessage("พบข้อผิดพลาด", "กรุณาใส่ข้อมูลให้ครบถ้วน", "error");
        }
      }
    } catch (error) {
      PopupMessage(
        "พบข้อผิดพลาด",
        `ไม่สามารถสร้างการตั้งค่ากล้องได้: ${error}`,
        "error"
      );
    }
  }, [dispatch, state]);

  const handleTextChange = (key: keyof typeof state, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleTextLocationChange = (
    key: keyof typeof state.location,
    value: string
  ) => {
    setState((prev) => ({
      ...prev,
      location: { ...prev.location, [key]: value },
    }));
  };

  const handleTextOfficerChange = (
    key: keyof typeof state.officer,
    value: string
  ) => {
    setState((prev) => ({
      ...prev,
      officer: { ...prev.officer, [key]: value },
    }));
  };

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
                <SelectBox
                  sx={{ marginTop: "15px" }}
                  id="police-divisions"
                  className="w-full"
                  value={state.policeDivisionsSelect}
                  onChange={(event: SelectChangeEvent<any>) =>
                    handleDropdownChange(
                      "policeDivisionsSelect",
                      event.target.value
                    )
                  }
                  options={policeDivisionsOptions}
                  label="Police Division (ภาค)"
                />
                <SelectBox
                  sx={{ marginTop: "15px" }}
                  id="province"
                  className="w-full"
                  value={state.provinceSelect}
                  onChange={(event: SelectChangeEvent<any>) =>
                    handleDropdownChange("provinceSelect", event.target.value)
                  }
                  options={provincesOptions}
                  label="Province (จังหวัด)"
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
                <TextBox
                  id="stream-encode"
                  label="Steam Encode"
                  placeHolder=""
                  className="w-full"
                  value={state.streamEncode}
                  onChange={(event) =>
                    handleTextChange("streamEncode", event.target.value)
                  }
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
                <SelectBox
                  sx={{ marginTop: "15px" }}
                  id="district"
                  className="w-full"
                  value={state.districtsSelect}
                  onChange={(event: SelectChangeEvent<any>) =>
                    handleDropdownChange("districtsSelect", event.target.value)
                  }
                  options={districtsOptions}
                  label="District (อำเภอ)"
                  disabled={state.provinceSelect === '' ? true : false}
                />
                <SelectBox
                  sx={{ marginTop: "15px" }}
                  id="sub-district"
                  className="w-full"
                  value={state.subDistrictsSelect}
                  onChange={(event: SelectChangeEvent<any>) =>
                    handleDropdownChange(
                      "subDistrictsSelect",
                      event.target.value
                    )
                  }
                  options={subDistrictsOptions}
                  label="Sub District (ตำบล)"
                  disabled={state.districtsSelect === '' ? true : false}
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
                <SelectBox
                  sx={{ marginTop: "15px" }}
                  id="name-prefix"
                  className="w-full"
                  value={state.officer.namePrefixesSelect}
                  onChange={(event: SelectChangeEvent<any>) =>
                    handleDropdownOfficerChange(
                      "namePrefixesSelect",
                      event.target.value
                    )
                  }
                  options={officerPrefixesOptions}
                  label="คำนำหน้า"
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
                <SelectBox
                  sx={{ marginTop: "15px" }}
                  id="position"
                  className="w-full"
                  value={state.officer.positionsSelect}
                  onChange={(event: SelectChangeEvent<any>) =>
                    handleDropdownOfficerChange(
                      "positionsSelect",
                      event.target.value
                    )
                  }
                  options={positionsOptions}
                  label="ตำแหน่ง"
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
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-25 backdrop-blur-sm ">
          <DialogPanel
            className="space-y-4 border bg-[var(--background-color)] p-5 bg-black text-white 
          w-[50%] min-w-[700px] h-full max-h-[850px] overflow-y-auto"
          >
            <div className="flex justify-between">
              <DialogTitle className="text-[28px]">Location กล้อง</DialogTitle>
            </div>
            <LocationSetting
              closeDialog={() =>
                handleButtonClick("isLocationSettingOpen", false)
              }
              comfirmPoint={comfirmPoint}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default CameraSetting;
