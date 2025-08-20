import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../../app/store"
import { fetchClient, combineURL } from "../../../utils/fetchClient"
import { getUrls } from '../../../config/runtimeConfig';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Divider,
} from "@mui/material"
import { useForm } from "react-hook-form";

// Types
import { 
  Districts,
  DistrictsDetail, 
  SubDistricts,
  SubDistrictsDetail,
  Option,
} from "../../../features/dropdown/dropdownTypes";
import { 
  CheckpointResponse,
  Checkpoint,
} from "../../../features/checkpoint-settings/checkpointSettingsTypes"

// Components
import TextBox from "../../../components/text-box/TextBox"
import AutoComplete from "../../../components/auto-complete/AutoComplete"

// Icon
import { Icon } from "../../../components/icons/Icon"
import { Save } from "lucide-react"

// Pop-up
import { PopupMessage, PopupMessageWithCancel } from "../../../utils/popupMessage"

// Utils
import { formatPhone, getId } from "../../../utils/commonFunction"

// i18n
import { useTranslation } from "react-i18next";

interface CheckpointSettingProps {
  open: boolean
  closeDialog: () => void
  checkpointData: Checkpoint | null
  isEditMode: boolean
}

interface FormData {
  id?: number
  checkpoint_ip: string
  checkpoint_name: string
  organization: string
  province_id: number | Option
  district_id: number | Option
  subdistrict_id: number | Option
  route: string
  latitude: string
  longitude: string
  officer_title_id: number | Option
  officer_firstname: string
  officer_lastname: string
  officer_position: string
  officer_phone: string
  pcSerialNumber: string
  license: string
}

const CheckpointSetting: React.FC<CheckpointSettingProps> = ({
  open,
  closeDialog,
  checkpointData,
  isEditMode,
}) => {

  // i18n
  const { t, i18n } = useTranslation();

  const { API_URL } = getUrls();

  const [state, setState] = useState<FormData>({
    id: undefined as number | undefined,
    checkpoint_ip: "",
    checkpoint_name: "",
    organization: "",
    province_id: 0,
    district_id: 0,
    subdistrict_id: 0,
    route: "",
    latitude: "",
    longitude: "",
    officer_title_id: 0,
    officer_firstname: "",
    officer_lastname: "",
    officer_position: "",
    officer_phone: "",
    pcSerialNumber: "",
    license: "",
  })

  const {
    provinces,
    personTitles,
    positions,
  } = useSelector((state: RootState) => state.dropdown)
  const [provincesOptions, setProvincesOptions] = useState<{ label: string ,value: number }[]>([])
  const [subDistrictsOptions, setSubDistrictsOptions] = useState<{ label: string ,value: number }[]>([])
  const [districtsOptions, setDistrictsOptions] = useState<{ label: string ,value: number }[]>([])
  const [personTitlesOptions, setPersonTitlesOptions] = useState<{ label: string ,value: number }[]>([])
  const [districtsList, setDistrictsList] = useState<DistrictsDetail[]>([])
  const [subDistrictsList, setSubDistrictsList] = useState<SubDistrictsDetail[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();

  useEffect(() => {
    if (
      provinces?.data &&
      provinces?.data?.length > 0 &&
      personTitles?.data && personTitles?.data.length > 0 &&
      positions?.data && positions?.data.length > 0
    ) {
      if (isEditMode && checkpointData) {
        const formattedPhone = checkpointData.officer_phone
          ? formatPhone(checkpointData.officer_phone)
          : checkpointData.officer_phone;

        setState((prev) => ({
          ...prev,
          id: checkpointData.id,
          checkpoint_ip: checkpointData.checkpoint_ip,
          checkpoint_name: checkpointData.checkpoint_name,
          organization: checkpointData.organization,
          province_id: checkpointData.province_id,
          district_id: checkpointData.district_id,
          subdistrict_id: checkpointData.subdistrict_id,
          route: checkpointData.route,
          latitude: checkpointData.latitude.toString(),
          longitude: checkpointData.longitude.toString(),
          officer_title_id: checkpointData.officer_title_id,
          officer_firstname: checkpointData.officer_firstname,
          officer_lastname: checkpointData.officer_lastname,
          officer_position: checkpointData.officer_position,
          officer_phone: formattedPhone,
          pcSerialNumber: checkpointData.serial_number,
          license: checkpointData.license_key,
        }));

        setValue("checkpoint_ip", checkpointData.checkpoint_ip);
        setValue("checkpoint_name", checkpointData.checkpoint_name);
        setValue("organization", checkpointData.organization);
        setValue("province_id", checkpointData.province_id);
        setValue("district_id", checkpointData.district_id);
        setValue("subdistrict_id", checkpointData.subdistrict_id);
        setValue("route", checkpointData.route);
        setValue("latitude", checkpointData.latitude.toString());
        setValue("longitude", checkpointData.longitude.toString());
        setValue("officer_title_id", checkpointData.officer_title_id);
        setValue("officer_firstname", checkpointData.officer_firstname);
        setValue("officer_lastname", checkpointData.officer_lastname);
        setValue("officer_position", checkpointData.officer_position);
        setValue("officer_phone", formattedPhone);
        setValue("pcSerialNumber", checkpointData.serial_number);
        setValue("license", checkpointData.license_key);
      }
    }
  }, [
    provinces,
    personTitles,
    positions,
    isEditMode,
    checkpointData,
  ])

  const handleDropdownChange = (key: keyof typeof state, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }))
    setValue(key, value);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (state.province_id) {
        const res = await fetchClient<Districts>(combineURL(API_URL, "/districts/get"), {
          method: "GET",
          queryParams: { 
            filter: `province_id=${state.province_id}`,
            limit: "100",
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
            filter: `province_id=${state.province_id},district_id=${state.district_id}`,
            limit: "100",
          },
        });
        if (res && res.data) {
          setSubDistrictsList(res.data)
        }
      }
    }
    fetchData()
  }, [state.province_id, state.district_id, state.subdistrict_id])

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
    if (personTitles && personTitles.data) {
      const options = personTitles.data.map((row) => ({
        label: i18n.language === "th" ? row.title_th : row.title_en,
        value: row.id,
      }))
      setPersonTitlesOptions(options)
    }
  }, [personTitles, i18n.language])

  const isDataChange = () => {
    return (
      state.checkpoint_ip !== checkpointData?.checkpoint_ip ||
      state.checkpoint_name !== checkpointData?.checkpoint_name ||
      state.organization !== checkpointData?.organization ||
      state.province_id !== checkpointData?.province_id ||
      state.district_id !== checkpointData?.district_id ||
      state.subdistrict_id !== checkpointData?.subdistrict_id ||
      state.route !== checkpointData?.route ||
      state.latitude !== checkpointData?.latitude.toString() ||
      state.longitude !== checkpointData?.longitude.toString() ||
      state.officer_title_id !== checkpointData?.officer_title_id ||
      state.officer_firstname !== checkpointData?.officer_firstname ||
      state.officer_lastname !== checkpointData?.officer_lastname ||
      state.officer_position !== checkpointData?.officer_position ||
      state.officer_phone.replaceAll(/[^0-9]/g, "") !== checkpointData?.officer_phone ||
      state.pcSerialNumber !== checkpointData?.serial_number ||
      state.license !== checkpointData?.license_key
    )
  }

  const onSubmit = async (data: any) => {
    try {
      if (isEditMode && !isDataChange()) {
        PopupMessage(
          t('message.warning.no-change-found'),
          t('message.warning.data-not-change'),
          "warning"
        )
        return;
      }

      if (isDataChange()) {
        const confirmed = await PopupMessageWithCancel(t('message.warning.edit-confirmation'), t('message.warning.do-you-want-to-continue'), t('button.confirm'), t('button.cancel'), "warning")
      
        if (!confirmed) {
          return;
        }
      }

      const body = { 
        checkpoint_ip: "10.1.1.1",
        checkpoint_name: data.checkpoint_name,
        organization: data.organization,
        province_id: getId(data.province_id),
        district_id: getId(data.district_id),
        subdistrict_id: getId(data.subdistrict_id),
        route: data.route,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        serial_number: data.pcSerialNumber,
        license_key: data.license,
        officer_title_id: getId(data.officer_title_id),
        officer_firstname: data.officer_firstname,
        officer_lastname: data.officer_lastname,
        officer_position: data.officer_position,
        officer_phone: data.officer_phone.replaceAll(/[^0-9]/g, ""),
      }

      const result = await fetchClient<CheckpointResponse>(combineURL(API_URL, "/checkpoints/config"), {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!result.status) {
        PopupMessage(t('message.error.error-while-saving-data'), (result.message || t('message.error.something-wrong-occur')), "error")
        return;
      }

      PopupMessage(t('message.success.data-saved-successfully'), t('message.success.data-saved-successfully-detail'), "success")
      closeDialog();
    } 
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      PopupMessage(t('message.error.something-wrong-occur'), t('message.error.setting-station-error', { error: errorMessage }), "error");
    }    
  }

  const handleTextChange = (key: keyof typeof state, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }))
    setValue(key, value);
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
      handleDropdownChange("subdistrict_id", '')
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
      handleDropdownChange("subdistrict_id", '')
    }
  }

  const handleSubDistrictChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault()
    if (value) {
      handleDropdownChange("subdistrict_id", value.value)
    }
    else {
      handleDropdownChange("subdistrict_id", '')
    }
  }
  
  const handlePrefixChange = (
    event: React.SyntheticEvent,
    value: { value: any ,label: string } | null
  ) => {
    event.preventDefault()
    if (value) {
      handleDropdownChange("officer_title_id", value.value)
    }
    else {
      handleDropdownChange("officer_title_id", '')
    }
  }

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const cleaned = input.replace(/\D/g, '');
    
    if (cleaned.length <= 10) {
      const formatted = formatPhone(cleaned)
      handleTextChange("officer_phone", formatted)
    }
    return cleaned
  }

  const handleCloseDialog = () => {
    clearData();
    closeDialog();
  }

  const clearData = () => {
    setState({
      id: undefined,
      checkpoint_ip: "",
      checkpoint_name: "",
      organization: "",
      province_id: 0,
      district_id: 0,
      subdistrict_id: 0,
      route: "",
      latitude: "",
      longitude: "",
      officer_title_id: 0,
      officer_firstname: "",
      officer_lastname: "",
      officer_position: "",
      officer_phone: "",
      pcSerialNumber: "",
      license: "",
    })
    setValue("checkpoint_ip", "");
    setValue("checkpoint_name", "");
    setValue("organization", "");
    setValue("province_id", "");
    setValue("district_id", "");
    setValue("subdistrict_id", "");
    setValue("route", "");
    setValue("latitude", "");
    setValue("longitude", "");
    setValue("officer_title_id", "");
    setValue("officer_firstname", "");
    setValue("officer_lastname", "");
    setValue("officer_position", "");
    setValue("officer_phone", "");
    setValue("pcSerialNumber", "");
    setValue("license", "");
    clearErrors();
  }

  return (
    <Dialog id="checkpoint-setting" open={open} maxWidth="xl" fullWidth sx={{ zIndex: 1000 }}>
      <DialogTitle className='bg-black'>
        <div className="flex justify-between items-center bg-black">
          <Typography variant="h5" color="white" className="font-bold">{t('screen.add-edit-station')}</Typography>
          <button
            onClick={handleCloseDialog} 
            className="text-white bg-transparent border-0 text-[28px] pr-6"
          >
            &times;
          </button>
        </div>
      </DialogTitle>
      <DialogContent className='bg-black'>
        <form onSubmit={handleSubmit(onSubmit)} onError={(e) => console.log(e)}>
          <div className="bg-black text-white p-[30px] border-[1px] border-dodgerBlue w-full">
            {/* Checkpoint Information */}
            <div>
              <div className="flex mb-[20px]">
                <label className="text-[20px]">{t('text.station-data')}</label>
              </div>
              <div className="grid grid-cols-2 lt1443:grid-cols-1 gap-[60px]">
                {/* First Column */}
                <div>
                  <div className="my-[10px]">
                    <TextBox
                      id="checkpoint-name"
                      label={t('component.checkpoint-name')}
                      value={state.checkpoint_name}
                      onChange={(event) =>
                        handleTextChange("checkpoint_name", event.target.value)
                      }
                      register={register("checkpoint_name", { 
                        required: true,
                      })}
                      sx={{ marginTop: "10px", fontSize: "15px" }}
                      error={!!errors.checkpoint_name}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5 my-[10px]">
                    <AutoComplete 
                      id="province-select"
                      sx={{ marginTop: "10px"}}
                      value={state.province_id}
                      onChange={handleProvinceChange}
                      options={provincesOptions}
                      label={t('component.province-name')}
                      labelFontSize="16px"
                      register={register("province_id", { 
                        required: true,
                      })}
                      error={!!errors.province_id}
                    />
                    <AutoComplete 
                      id="district-select"
                      sx={{ marginTop: "10px"}}
                      value={state.district_id}
                      onChange={handleDistrictChange}
                      options={districtsOptions}
                      label={t('component.district-name')}
                      labelFontSize="16px"
                      disabled={!state.province_id || state.province_id === 0  ? true : false}
                      register={register("district_id", { 
                        required: true,
                      })}
                      error={!!errors.district_id}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5 my-[10px]">
                    <TextBox
                      id="latitude"
                      label={t('component.location-lat')}
                      value={state.latitude}
                      onChange={(event) =>
                        handleTextChange("latitude", event.target.value)
                      }
                      sx={{ marginTop: "10px", fontSize: "15px" }}
                      register={register("latitude", { 
                        required: true,
                      })}
                      error={!!errors.latitude}
                    />
                    <TextBox
                      id="longitude"
                      label={t('component.location-lon')}
                      value={state.longitude}
                      onChange={(event) =>
                        handleTextChange("longitude", event.target.value)
                      }
                      sx={{ marginTop: "10px", fontSize: "15px" }}
                      register={register("longitude", { 
                        required: true,
                      })}
                      error={!!errors.longitude}
                    />
                  </div>
                </div>
                {/* Seconds Column */}
                <div>
                  <div className="my-[10px]">
                    <TextBox
                      id="organization"
                      label={t('component.organization-name')}
                      value={state.organization}
                      onChange={(event) =>
                        handleTextChange("organization", event.target.value)
                      }
                      register={register("organization", { 
                        required: true,
                      })}
                      sx={{ marginTop: "10px", fontSize: "15px" }}
                      error={!!errors.organization}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5 my-[10px]">
                    <AutoComplete 
                      id="subdistrict-select"
                      sx={{ marginTop: "10px"}}
                      value={state.subdistrict_id}
                      onChange={handleSubDistrictChange}
                      options={subDistrictsOptions}
                      label={t('component.sub-district-name')}
                      labelFontSize="16px"
                      disabled={!state.district_id || state.district_id === 0 ? true : false}
                      register={register("subdistrict_id", { 
                        required: true,
                      })}
                      error={!!errors.subdistrict_id}
                    />
                    <TextBox
                      id="route"
                      label={t('component.route-name')}
                      value={state.route}
                      onChange={(event) =>
                        handleTextChange("route", event.target.value)
                      }
                      sx={{ marginTop: "10px", fontSize: "15px" }}
                      register={register("route", { 
                        required: true,
                      })}
                      error={!!errors.route}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5 my-[10px]">
                    <TextBox
                      id="serial-number"
                      label={t('component.pc-serial-number')}
                      value={state.pcSerialNumber}
                      onChange={(event) =>
                        handleTextChange("pcSerialNumber", event.target.value)
                      }
                      sx={{ marginTop: "10px", fontSize: "15px" }}
                      register={register("pcSerialNumber", { 
                        required: true,
                      })}
                      error={!!errors.pcSerialNumber}
                    />
                    <TextBox
                      id="license"
                      label={t('component.license')}
                      value={state.license}
                      onChange={(event) =>
                        handleTextChange("license", event.target.value)
                      }
                      sx={{ marginTop: "10px", fontSize: "15px" }}
                      register={register("license", { 
                        required: true,
                      })}
                      error={!!errors.license}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Divider sx={{ borderColor: "#2B9BED", my: "10px" }} />
            {/* Officer Information */}
            <div>
              <div className="flex mb-[20px]">
                <label className="text-[20px]">{t('text.officer-data')}</label>
              </div>
              <div className="grid grid-cols-2 lt1443:grid-cols-1 gap-[60px]">
                {/* First Column */}
                <div>
                  <div className="grid grid-cols-2 gap-5 my-[10px]">
                    <AutoComplete 
                      id="prefix-select"
                      value={state.officer_title_id}
                      onChange={handlePrefixChange}
                      options={personTitlesOptions}
                      label={t('component.officer-prefix')}
                      labelFontSize="16px"
                      sx={{ marginTop: "10px" }}
                      register={register("officer_title_id", { 
                        required: true,
                      })}
                      error={!!errors.officer_title_id}
                    />
                    <TextBox
                      id="firstname"
                      label={t('component.officer-name')}
                      value={state.officer_firstname}
                      onChange={(event) =>
                        handleTextChange("officer_firstname", event.target.value)
                      }
                      register={register("officer_firstname", { 
                        required: true,
                      })}
                      sx={{ marginTop: "10px", fontSize: "15px" }}
                      error={!!errors.officer_firstname}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5 my-[10px]">
                    <TextBox
                      id="phone"
                      label={t('component.officer-phone')}
                      value={state.officer_phone}
                      onChange={handlePhoneChange}
                      register={register("officer_phone", { 
                        required: true,
                      })}
                      sx={{ marginTop: "10px", fontSize: "15px" }}
                      error={!!errors.officer_phone}
                    />
                  </div>
                </div>
                {/* Seconds Column */}
                <div>
                  <div className="grid grid-cols-2 gap-5 my-[10px]">
                    <TextBox
                      id="lastname"
                      label={t('component.officer-lastname')}
                      value={state.officer_lastname}
                      onChange={(event) =>
                        handleTextChange("officer_lastname", event.target.value)
                      }
                      register={register("officer_lastname", { 
                        required: true,
                      })}
                      sx={{ marginTop: "10px", fontSize: "15px" }}
                      error={!!errors.officer_lastname}
                    />
                    <TextBox
                      id="position"
                      label={t('component.officer-position')}
                      value={state.officer_position}
                      onChange={(event) =>
                        handleTextChange("officer_position", event.target.value)
                      }
                      register={register("officer_position", { 
                        required: true,
                      })}
                      sx={{ marginTop: "10px", fontSize: "15px" }}
                      error={!!errors.officer_position}
                    />
                  </div>
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

export default CheckpointSetting
