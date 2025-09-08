import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../../app/store"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material"
import { format } from "date-fns"
import { fetchClient, combineURL } from "../../../utils/fetchClient"
import { getUrls } from '../../../config/runtimeConfig';
import { useForm } from "react-hook-form";

// Types
import {
  CameraDetailSettings,
  CameraSettingsDataResponse,
} from "../../../features/camera-settings/cameraSettingsTypes"
import { 
  Districts,
  SubDistricts,
  DistrictsDetail, 
  SubDistrictsDetail,
} from "../../../features/dropdown/dropdownTypes";

// Components
import TextBox from "../../../components/text-box/TextBox"
import Loading from "../../../components/loading/Loading"
import AutoComplete from "../../../components/auto-complete/AutoComplete"

// Icon
import { Icon } from "../../../components/icons/Icon"
import { Save } from "lucide-react"

// Pop-up
import { PopupMessage, PopupMessageWithCancel } from "../../../utils/popupMessage"

// Utils
import { getId } from "../../../utils/commonFunction"

// Constants
import { DEFAULT_DETECTION_AREA } from "../../../constants/detectionArea"

// i18n
import { useTranslation } from "react-i18next";

interface CameraSettingProps {
  open: boolean
  closeDialog: () => void
  selectedRow: CameraDetailSettings | null
  isEditMode: boolean
}

const CameraSetting: React.FC<CameraSettingProps> = ({
  open,
  closeDialog,
  selectedRow,
  isEditMode,
}) => {
  // i18n
  const { t, i18n } = useTranslation();

  const { API_URL } = getUrls();

  const [originalData, setOriginalData] = useState<CameraDetailSettings | null>(
    null
  )
  const [state, setState] = useState({
    id: undefined as number | undefined,
    checkpointId: "",
    isLoading: false,
    isLocationSettingOpen: false,
    isSensorSettingOpen: false,
    rtspLiveView: "",
    streamEncodeSelect: 0,
    apiServer: "",
    rtspProcess: "",
    number_of_detections: 0,
    province_id: 0,
    district_id: 0,
    sub_district_id: 0,
    route: "",
    latitude: "",
    longitude: "",
  })
  const [districtsList, setDistrictsList] = useState<DistrictsDetail[]>([])
  const [subDistrictsList, setSubDistrictsList] = useState<SubDistrictsDetail[]>([])

  const {
    provinces,
    streamEncodes,
  } = useSelector((state: RootState) => state.dropdown)

  // Options
  const [streamEncodesOptions, setStreamEncodesOptions] = useState<{ label: string ,value: number }[]>([])
  const [provincesOptions, setProvincesOptions] = useState<{ label: string ,value: number }[]>([])
  const [subDistrictsOptions, setSubDistrictsOptions] = useState<{ label: string ,value: number }[]>([])
  const [districtsOptions, setDistrictsOptions] = useState<{ label: string ,value: number }[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();

  useEffect(() => {
    if (isEditMode && selectedRow) {
      setState((prev) => ({
        ...prev,
        id: selectedRow.id,
        isLoading: false,
        isLocationSettingOpen: false,
        isSensorSettingOpen: false,
        checkpointId: selectedRow.cam_id,
        rtspLiveView: selectedRow.rtsp_live_url,
        streamEncodeSelect: selectedRow.stream_encode_id,
        apiServer: selectedRow.api_server_url,
        rtspProcess: selectedRow.rtsp_process_url,
        number_of_detections: 0,
        province_id: selectedRow.province_id,
        district_id: selectedRow.district_id,
        sub_district_id: selectedRow.sub_district_id,
        route: selectedRow.route,
        latitude: selectedRow.latitude.toString(),
        longitude: selectedRow.longitude.toString(),
      }))
      setOriginalData(selectedRow)

      setValue("checkpointId", selectedRow.cam_id);
      setValue("rtspLiveView", selectedRow.rtsp_live_url);
      setValue("streamEncodeSelect", selectedRow.stream_encode_id);
      setValue("apiServer", selectedRow.api_server_url);
      setValue("rtspProcess", selectedRow.rtsp_process_url);
      setValue("number_of_detections", 0);
      setValue("province_id", selectedRow.province_id);
      setValue("district_id", selectedRow.district_id);
      setValue("sub_district_id", selectedRow.sub_district_id);
      setValue("route", selectedRow.route);
      setValue("latitude", selectedRow.latitude.toString());
      setValue("longitude", selectedRow.longitude.toString());
    }
    else {
      setState({
        id: undefined,
        checkpointId: "",
        isLoading: false,
        isLocationSettingOpen: false,
        isSensorSettingOpen: false,
        rtspLiveView: "",
        streamEncodeSelect: 0,
        apiServer: "",
        rtspProcess: "",
        number_of_detections: 0,
        province_id: 0,
        district_id: 0,
        sub_district_id: 0,
        route: "",
        latitude: "",
        longitude: "",
      })

      setValue("checkpointId", "");
      setValue("rtspLiveView", "");
      setValue("streamEncodeSelect", "");
      setValue("apiServer", "");
      setValue("rtspProcess", "");
      setValue("number_of_detections", 0);
      setValue("province_id", "");
      setValue("district_id", "");
      setValue("sub_district_id", "");
      setValue("route", "");
      setValue("latitude", "");
      setValue("longitude", "");
    }
  }, [
    open
  ])

  useEffect(() => {
    if (streamEncodes && streamEncodes.data) {
      const options = streamEncodes.data.map((row) => ({
        label: row.name,
        value: row.id,
      }))
      setStreamEncodesOptions(options)
    }
  }, [streamEncodes])

  useEffect(() => {
    if (provinces && provinces.data) {
      const options = provinces.data.map((row) => ({
        label: i18n.language === "th" ? row.name_th : row.name_en,
        value: row.id,
      }))
      setProvincesOptions(options)
    }
  }, [provinces, i18n.language])

  useEffect(() => {
    if (districtsList) {
      const options = districtsList.map((row) => ({
        label: i18n.language === "th" ? row.name_th : row.name_en,
        value: row.id,
      }))
      setDistrictsOptions(options)
    }
  }, [districtsList, i18n.language])

  useEffect(() => {
    if (subDistrictsList) {
      const options = subDistrictsList.map((row) => ({
        label: i18n.language === "th" ? row.name_th : row.name_en,
        value: row.id,
      }))
      setSubDistrictsOptions(options)
    }
  }, [subDistrictsList, i18n.language])

  useEffect(() => {
    const fetchData = async () => {
      if (state.province_id) {
        const res = await fetchClient<Districts>(combineURL(API_URL, "/districts/get"), {
          method: "GET",
          queryParams: {
            filter: `province_id=${state.province_id}`
          },
        });
        if (res && res.data) {
          setDistrictsList(res.data)
        }
      }
      if (state.province_id && state.district_id) {
        const res = await fetchClient<SubDistricts>(combineURL(API_URL, "/subdistricts/get"), {
          method: "GET",
          queryParams: {
            filter: `province_id=${state.province_id},district_id=${state.district_id}`
          },
        });
        if (res && res.data) {
          setSubDistrictsList(res.data)
        }
      }
    }
    fetchData()
  }, [state.province_id, state.district_id, state.sub_district_id])

  const hasChanges = () => {
    if (!originalData || !state) return false;
    return (
      originalData.cam_id !== state.checkpointId ||
      originalData.rtsp_live_url !== state.rtspLiveView ||
      originalData.rtsp_process_url !== state.rtspProcess ||
      originalData.stream_encode_id !== state.streamEncodeSelect ||
      originalData.api_server_url !== state.apiServer ||
      originalData.province_id !== state.province_id ||
      originalData.district_id !== state.district_id ||
      originalData.sub_district_id !== state.sub_district_id ||
      originalData.route !== state.route ||
      originalData.latitude !== state.latitude ||
      originalData.longitude !== state.longitude
    );
  };

  const handleDropdownChange = (key: keyof typeof state, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }))
    setValue(key, value);
  }

  const createCameraSettings = async (data: any) => {
    const defaultDetectionArea = DEFAULT_DETECTION_AREA

    try {
      const body = {
        cam_id: data.checkpointId,
        rtsp_live_url: data.rtspLiveView,
        rtsp_process_url: data.rtspProcess,
        stream_encode_id: getId(data.streamEncodeSelect),
        api_server_url: data.apiServer || "",
        province_id: getId(data.province_id),
        district_id: getId(data.district_id),
        sub_district_id: getId(data.sub_district_id),
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        route: data.route,
        detection_area: JSON.stringify(defaultDetectionArea),
        visible: 1,
        active: 1,
      }

      const result = await fetchClient<CameraSettingsDataResponse>(combineURL(API_URL, "/cameras/create"), {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      })

      if (!result.success) {
        PopupMessage(t('message.error.something-wrong-occur'), (result.message || t('message.error.something-wrong-occur')), "error");
        return;
      }
  
      PopupMessage(t('message.success.data-saved-successfully'), t('message.success.data-saved-successfully-detail'), "success")
      closeDialog();
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      PopupMessage(t('message.error.something-wrong-occur'), t('message.error.setting-camera-error', { error: errorMessage }), "error");
    }
  }

  const updateCameraSettings = async (data: any) => {
    if (!selectedRow?.id) {
      console.error("The selected row does not have a valid 'id'.");
      return null;
    }

    const confirmed = await PopupMessageWithCancel(t('message.warning.edit-confirmation'), t('message.warning.do-you-want-to-continue'), t('button.confirm'), t('button.cancel'), "warning", "#FDB600")

    if (!confirmed) return;

    try {
      const body = {
        id: selectedRow.id,
        checkpoint_uid: selectedRow.checkpoint_uid,
        cam_id: data.checkpointId,
        rtsp_live_url: data.rtspLiveView,
        rtsp_process_url: data.rtspProcess,
        stream_encode_id: getId(data.streamEncodeSelect),
        api_server_url: data.apiServer || "",
        province_id: getId(data.province_id),
        district_id: getId(data.district_id),
        sub_district_id: getId(data.sub_district_id),
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        route: data.route,
        visible: 1,
        active: 1,
        createdAt: selectedRow.createdAt,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      }

      const result = await fetchClient<CameraSettingsDataResponse>(combineURL(API_URL, "/cameras/update"), {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      })

      if (!result.success) {
        PopupMessage(t('message.error.error-while-updating-data'), (result.message || t('message.error.something-wrong-occur')), "error");
        return;
      }
  
      PopupMessage(t('message.success.data-saved-successfully'), t('message.success.data-saved-successfully-detail'), "success")
      closeDialog();
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      PopupMessage(t('message.error.something-wrong-occur'), t('message.error.setting-update-camera-error', { error: errorMessage }), "error");
    }
  };
  

  const onSubmit = async (data: any) => {
    if (isEditMode && selectedRow) {
      if (!hasChanges()) {
        PopupMessage(
          t('message.warning.no-change-found'),
          t('message.warning.data-not-change'),
          "warning"
        )
        return;
      }
  
      await updateCameraSettings(data);
    } 
    else {
      await createCameraSettings(data);
    }   
  }

  const handleTextChange = (key: keyof typeof state, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }))
    setValue(key, value);
  }

  const handleLatitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const cleaned = input
                      .replace(/[^0-9.]/g, '')     
                      .replace(/(\..*)\./g, '$1'); 
    
    handleTextChange("latitude", cleaned)
    return cleaned
  }

  const handleLongitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const cleaned = input
                      .replace(/[^0-9.]/g, '')     
                      .replace(/(\..*)\./g, '$1'); 
    
    handleTextChange("longitude", cleaned)
    return cleaned
  }

  const handleProvinceChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault()
    if (value) {
      handleDropdownChange("province_id", value.value)
    }
    else {
      handleDropdownChange("province_id", '')
      handleDropdownChange("district_id", '')
      handleDropdownChange("sub_district_id", '')
    }
  }

  const handleDistrictChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault()
    if (value) {
      handleDropdownChange("district_id", value.value)
    }
    else {
      handleDropdownChange("district_id", '')
      handleDropdownChange("sub_district_id", '')
    }
  }

  const handleSubDistrictChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault()
    if (value) {
      handleDropdownChange("sub_district_id", value.value)
    }
    else {
      handleDropdownChange("sub_district_id", '')
    }
  }

  const handleStreamEncodeChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault()
    if (value) {
      handleDropdownChange("streamEncodeSelect", value.value)
    }
    else {
      handleDropdownChange("streamEncodeSelect", '')
    }
  }

  const handleCloseDialog = () => {
    clearData();
    closeDialog();
  }

  const clearData = () => {
    setState({
      id: undefined,
      checkpointId: "",
      isLoading: false,
      isLocationSettingOpen: false,
      isSensorSettingOpen: false,
      rtspLiveView: "",
      streamEncodeSelect: 0,
      apiServer: "",
      rtspProcess: "",
      number_of_detections: 0,
      province_id: 0,
      district_id: 0,
      sub_district_id: 0,
      route: "",
      latitude: "",
      longitude: "",
    })
    setValue("checkpointId", "");
    setValue("rtspLiveView", "");
    setValue("streamEncodeSelect", "");
    setValue("apiServer", "");
    setValue("rtspProcess", "");
    setValue("number_of_detections", "");
    setValue("province_id", "");
    setValue("district_id", "");
    setValue("sub_district_id", "");
    setValue("route", "");
    setValue("latitude", "");
    setValue("longitude", "");
    clearErrors();
  }

  return (
    <Dialog id="camera-setting" open={open} maxWidth="xl" fullWidth sx={{ zIndex: 1000 }}>
      <DialogTitle className="bg-black">
        <div>
          <Typography variant="h5" color="white" className="font-bold">{t('screen.camera-setting')}</Typography>
        </div>
      </DialogTitle>
      <DialogContent className="bg-black">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-black text-white p-[30px] border-[1px] border-dodgerBlue w-full">
            {state.isLoading && <Loading />}
            {/* Header */}
            <div>
              <div className="flex mb-[20px]">
                <label className="text-[20px]">{t('text.camera-data')}</label>
              </div>
              <div className="grid grid-cols-2 lt1443:grid-cols-1 gap-[60px]">
                {/* First Column */}
                <div>
                  <div className="my-[10px]">
                    <TextBox
                      id="checkpoint-id"
                      label={t('component.id-camera')}
                      value={state.checkpointId}
                      onChange={(event) =>
                        handleTextChange("checkpointId", event.target.value)
                      }
                      sx={{ marginTop: "15px", fontSize: "15px" }}
                      register={register("checkpointId", { 
                        required: true,
                      })}
                      error={!!errors.checkpointId}
                    />
                  </div>
                  <div className="my-[10px]">
                    <TextBox
                      id="rtsp-live-view"
                      label={t('component.rtsp-live-view')}
                      value={state.rtspLiveView}
                      onChange={(event) =>
                        handleTextChange("rtspLiveView", event.target.value)
                      }
                      sx={{ marginTop: "15px", fontSize: "15px" }}
                      register={register("rtspLiveView", { 
                        required: true,
                      })}
                      error={!!errors.rtspLiveView}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5 my-[10px]">
                    <AutoComplete 
                      id="province-select"
                      sx={{ marginTop: "15px"}}
                      value={state.province_id}
                      onChange={handleProvinceChange}
                      options={provincesOptions}
                      label={t('component.province-name')}
                      labelFontSize="15px"
                      register={register("province_id", { 
                        required: true,
                      })}
                      error={!!errors.province_id}
                    />
                    <AutoComplete 
                      id="district-select"
                      sx={{ marginTop: "15px"}}
                      value={state.district_id}
                      onChange={handleDistrictChange}
                      options={districtsOptions}
                      label={t('component.district-name')}
                      labelFontSize="15px"
                      disabled={!state.province_id || state.province_id === 0  ? true : false}
                      register={register("district_id", { 
                        required: true,
                      })}
                      error={!!errors.district_id}
                    />
                  </div>
                  <TextBox
                    id="latitude"
                    label={t('component.location-lat')}
                    value={state.latitude}
                    onChange={handleLatitudeChange}
                    sx={{ marginTop: "15px", fontSize: "15px" }}
                    register={register("latitude", { 
                      required: true,
                    })}
                    error={!!errors.latitude}
                  />
                </div>
                {/* Seconds Column */}
                <div>
                  <div className="grid grid-cols-2 gap-[60px] my-[10px]">
                    <AutoComplete 
                      id="stream-encode-select"
                      sx={{ marginTop: "15px"}}
                      value={state.streamEncodeSelect}
                      onChange={handleStreamEncodeChange}
                      options={streamEncodesOptions}
                      label={t('component.stream-encode')}
                      labelFontSize="15px"
                      register={register("streamEncodeSelect", { 
                        required: true,
                      })}
                      error={!!errors.streamEncodeSelect}
                    />
                    <TextBox
                      id="api-server"
                      label={t('component.api-server')}

                      value={state.apiServer}
                      onChange={(event) =>
                        handleTextChange("apiServer", event.target.value)
                      }
                      sx={{ marginTop: "15px", fontSize: "15px" }}
                      register={register("apiServer", { 
                        required: true,
                      })}
                      error={!!errors.apiServer}
                    />
                  </div>
                  <div className="my-[10px]">
                    <TextBox
                      id="rtsp-process"
                      label={t('component.rtsp-process')}

                      value={state.rtspProcess}
                      onChange={(event) =>
                        handleTextChange("rtspProcess", event.target.value)
                      }
                      sx={{ marginTop: "15px", fontSize: "15px" }}
                      register={register("rtspProcess", { 
                        required: true,
                      })}
                      error={!!errors.rtspProcess}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5 my-[10px]">
                    <AutoComplete 
                      id="subdistrict-select"
                      sx={{ marginTop: "15px"}}
                      value={state.sub_district_id}
                      onChange={handleSubDistrictChange}
                      options={subDistrictsOptions}
                      label={t('component.sub-district-name')}
                      labelFontSize="15px"
                      disabled={!state.district_id || state.district_id === 0 ? true : false}
                      register={register("sub_district_id", { 
                        required: true,
                      })}
                      error={!!errors.sub_district_id}
                    />
                    <TextBox
                      id="route"
                      label={t('component.route-name')}

                      value={state.route}
                      onChange={(event) =>
                        handleTextChange("route", event.target.value)
                      }
                      sx={{ marginTop: "15px", fontSize: "15px" }}
                      register={register("route", { 
                        required: true,
                      })}
                      error={!!errors.route}
                    />
                  </div>
                  <TextBox
                    id="longitude"
                    label={t('component.location-lon')}
                    value={state.longitude}
                    onChange={handleLongitudeChange}
                    sx={{ marginTop: "15px", fontSize: "15px" }}
                    register={register("longitude", { 
                      required: true,
                    })}
                    error={!!errors.longitude}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="flex justify-end my-6 ml-7">
            <button
              type="submit"
              className="flex items-center justify-center bg-dodgerBlue w-[90px] h-[40px] rounded mr-[10px]"
            >
              <Icon icon={Save} size={20} color="white" />
              <span className="ml-[5px] text-white">{t('button.confirm')}</span>
            </button>
            <button
              type="button"
              className="bg-white border-[1px] border-dodgerBlue text-dodgerBlue w-[90px] h-[40px] rounded"
              onClick={handleCloseDialog}
            >
              {t('button.cancel')}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CameraSetting
