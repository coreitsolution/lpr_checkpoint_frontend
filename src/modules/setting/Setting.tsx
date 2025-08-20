import { useState, useEffect } from 'react'
import {
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
} from "@mui/material"
import { useSelector } from "react-redux"
import { RootState } from "../../app/store"
import { fetchClient, combineURL } from "../../utils/fetchClient"
import { getUrls } from '../../config/runtimeConfig';

// Modules
import CameraSetting from './camera-setting/CameraSetting'
import SensorSetting from './sensor-setting/SensorSetting'
import CheckpointSetting from './checkpoint-setting/CheckpointSetting'

// Context
import { useHamburger } from "../../context/HamburgerContext"

// Icon
import { Icon } from '../../components/icons/Icon'
import { Plus, Pencil, Trash2, Copy } from 'lucide-react'

// Component
import Loading from "../../components/loading/Loading"

// Types
import { 
  CameraDetailSettings, 
  CameraScreenSettingDetail, 
  CameraSettings,
  CameraSettingsData,
} from "../../features/camera-settings/cameraSettingsTypes"
import { 
  CheckpointResponse,
  Checkpoint,
} from "../../features/checkpoint-settings/checkpointSettingsTypes";
import { 
  Districts,
  SubDistricts,
} from "../../features/dropdown/dropdownTypes";
import {
  SettingDetail,
  SettingData,
} from "../../features/settings/settingsTypes"

// Pop-up
import { PopupMessage, PopupMessageWithTextInput } from "../../utils/popupMessage"

// Utils
import { formatNumber } from "../../utils/commonFunction"

// i18n
import { useTranslation } from "react-i18next";

const Setting = () => {
  const { API_URL } = getUrls();

  const { provinces } = useSelector(
    (state: RootState) => state.dropdown
  )

  const { isOpen } = useHamburger()

  // i18n
  const { t, i18n } = useTranslation();

  // State
  const [isCameraSettingOpen, setIsCameraSettingOpen] = useState(false)
  const [isSensorSettingOpen, setIsSensorSettingOpen] = useState(false)
  const [isCheckpointSettingOpen, setIsCheckpointSettingOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isCheckpointEditMode, setIsCheckpointEditMode] = useState(false)

  // Data
  const [cameraDetailSettingData, setCameraDetailSettingData] = useState<CameraDetailSettings[]>([])
  const [selectedRow, setSelectedRow] = useState<CameraDetailSettings | null>(null)
  const [checkpointData, setCheckpointData] = useState<Checkpoint | null>(null)
  const [cameraScreenSettingDetail, setCameraScreenSettingDetail] = useState<CameraScreenSettingDetail | null>(null)
  const [selectedScreenValue, setSelectedScreenValue] = useState<number>(1)
  const [cameraSettingSelect, setCameraSettingSelect] = useState<{ name: string; value: number }[]>([]);
  const [rowSelected, setRowSelected] = useState<number[]>([])

  const [isLoading, setIsLoading] = useState(false)

  const cameraRefreshKey = useSelector((state: RootState) => state.refresh.cameraRefreshKey);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await fetchCameraSetting()
      await fetchCheckpointSetting()
      await fetchCameraData()
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }

    fetchData();
  }, []);

  useEffect(() => {
    const options = [1, 2, 3, 4].map((num) => ({
      name: t('text.show-screen', { screenNum: num }),
      value: num,
    }));
    setCameraSettingSelect(options);
  }, [i18n.language, t]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await fetchCameraData()
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }

    fetchData();

    return () => {
      setCameraDetailSettingData([]);
    }
  }, [cameraRefreshKey]);

  useEffect(() => {
    if (checkpointData) {
      fetchCamera();
    }
  }, [checkpointData])

  const fetchCameraSetting = async () => {
    try {
      const response = await fetchClient<SettingData>(combineURL(API_URL, "/settings/get"), {
        method: "GET",
      })

      if (response.data) {
        setCameraScreenSettingDetail(response.data[0])
        const numValue = Number(response.data[0].value) || 1
        setSelectedScreenValue(numValue)
      }
    }
    catch (error) {
      setCameraScreenSettingDetail(null);
      setSelectedScreenValue(1);
    }
  }

  const fetchCheckpointSetting = async () => {
    try {
      const response = await fetchClient<CheckpointResponse>(combineURL(API_URL, "/checkpoints/get"), {
        method: "GET",
      });

      if (response.success && response.data.length > 0) {
        const provinceName = provinces && provinces.data && provinces.data.find(p => p.id === response.data[0].province_id)?.name_th || "";
        const districtName = await fetchDistrictName(response.data[0].district_id);
        const subdistrictName = await fetchSubdistrictName(response.data[0].subdistrict_id);

        setCheckpointData({
          ...response.data[0],
          province_name: provinceName,
          district_name: districtName,
          subdistrict_name: subdistrictName,
        });

      } 
      else {
        setCheckpointData(null);
      }
    }
    catch (error) {
      setCheckpointData(null);
    }
  }

  const fetchCameraData = async () => {
    try {
      const response = await fetchClient<CameraSettings>(combineURL(API_URL, "/cameras/get"), {
        method: "GET",
        queryParams: {
          filter: "request_delete=false,deleted=0"
        }
      });

      if (response.success && response.data.length > 0) {
        setCameraDetailSettingData(response.data);
      } 
      else {
        setCameraDetailSettingData([]);
      }
    }
    catch (error) {
      setCameraDetailSettingData([]);
    }
  }

  const fetchDistrictName = async (districtId: number) => {
    try {
      const response = await fetchClient<Districts>(combineURL(API_URL, "/districts/get"), {
        method: "GET",
        queryParams: { 
          filter: `id:${districtId}`
        },
      });

      return response.data ? response.data[0].name_th : "";
    } 
    catch (error) {
      return "";
    }
  }

  const fetchSubdistrictName = async (subdistrictId: number) => {
    try {
      const response = await fetchClient<SubDistricts>(combineURL(API_URL, "/subdistricts/get"), {
        method: "GET",
        queryParams: { 
          filter: `id:${subdistrictId}`
        },
      });

      return response.data ? response.data[0].name_th : "";
    } 
    catch (error) {
      return "";
    }
  }

  const renderStatus = (status: number) => (
    <span className={`px-2 py-1 rounded inline-block w-[80px] text-[15px] ${
      status === 1 ? 'bg-fruitSalad' : 'bg-nobel'
    } text-white`}>
      {status === 1 ? "ON" : "OFF"}
    </span>
  )

  const handleEditClick = (item: CameraDetailSettings) => {
    setIsEditMode(true)
    setSelectedRow(item)
    setIsCameraSettingOpen(true)
  }

  const handleSensorSettingClick = (item: CameraDetailSettings) => {
    setSelectedRow(item)
    setIsSensorSettingOpen(true)
  }

  const handleCameraButtonClick = (status: boolean) => {
    setIsEditMode(false)
    setSelectedRow(null)
    setIsCameraSettingOpen(status)
  }

  const handleDeleteClick = async (id: number) => {
    const confirm = await PopupMessageWithTextInput(
      t('message.warning.delete-confirmation'),
      "",
      t('button.confirm'), 
      t('button.cancel'), 
      "warning", 
      t('component.reason'), 
      t('place-holder.reason'), 
      "#FDB600"
    )

    if (!confirm.isConfirmed) return;

    try {
      await fetchClient<void>(combineURL(API_URL, `/cameras/delete`), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: id,
          reason: confirm.inputValue,
        }),
      });
      PopupMessage(t('message.success.request-delete-camera-success'), "", 'success')
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      PopupMessage(t('message.error.something-wrong-occur'), t('message.error.request-delete-camera-error', { error: errorMessage}), 'error')
    }
    finally {
      await fetchCamera();
    }
  }

  const handleSensorSettingScreenClose = async () => {
    setIsSensorSettingOpen(false)
    await fetchCamera()
  }

  const handleCameraSettingScreenClose = async () => {
    setIsCameraSettingOpen(false)
    await fetchCamera()
  }

  const handleCheckpointSettingScreenClose = async () => {
    setIsCheckpointSettingOpen(false)
    setIsLoading(true)
    await fetchCheckpointSetting();
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  const handleScreenSelect = async (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value)

    if (cameraDetailSettingData.length < value) {
      PopupMessage("", t('message.warning.number-camera-less-than-screen'), "warning")
      return
    }

    setSelectedScreenValue(value)

    try {
      if (cameraScreenSettingDetail) {
        const updateData = { 
          ...cameraScreenSettingDetail,
          value: value.toString(),
        };
        await fetchClient<SettingDetail>(combineURL(API_URL, "/settings/update"), {
          method: "PATCH",
          body: JSON.stringify(updateData),
        })

        PopupMessage(t('message.success.data-saved-successfully'), t('message.success.data-saved-successfully-detail'), "success");
      }
    }
    catch (error) {
      PopupMessage(t('message.error.error-while-saving-data'), (error as { message: string }).message || t('message.error.something-wrong-occur'), "error")
    }
  }

  const fetchCamera = async () => {
    setIsLoading(true);
    await fetchCameraData();
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  }

  const onCopySelectedClick = async () => {
    const selectedCameras = cameraDetailSettingData.filter(item => rowSelected.includes(item.id));

    try {
      for (const camera of selectedCameras) {
        const newCamera = { 
          ...camera, 
          id: undefined,
          cam_id: camera.cam_id + "_copy",
          latitude: camera.latitude ? Number(camera.latitude) : 0,
          longitude: camera.longitude ? Number(camera.longitude) : 0,
        };
        await fetchClient<CameraSettingsData>(combineURL(API_URL, "/cameras/create"), {
          method: "POST",
          body: JSON.stringify(newCamera),
        })
      }
    }
    catch (error) {
      PopupMessage(t('message.error.something-wrong-occur'),t('message.error.copy-camera-error', { error: (error as { message: string }).message || t('message.error.something-wrong-occur') }), 'error')
      return;
    }
    finally {
      setRowSelected([]);
      await fetchCamera();
    }
  }

  const onDeleteSelectedClick = async () => {
    const confirm = await PopupMessageWithTextInput(
      t('message.warning.delete-confirmation'),
      "",
      t('button.confirm'), 
      t('button.cancel'), 
      "warning", 
      t('component.reason'), 
      t('place-holder.reason'), 
      "#FDB600"
    )

    if (!confirm.isConfirmed) return;

    try {
      for (const id of rowSelected) {
        await fetchClient<void>(combineURL(API_URL, `/cameras/delete`), {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            id: id,
            reason: confirm.inputValue,
          }),
        });
      }
      PopupMessage(t('message.success.request-delete-camera-success'), "", 'success')
    } 
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      PopupMessage(t('message.error.something-wrong-occur'), t('message.error.request-delete-camera-error', { error: errorMessage}), 'error')
    }
    finally {
      setRowSelected([]);
      await fetchCamera();
    }
  }

  const handleCheckpointSettingClick = () => {
    setIsCheckpointSettingOpen(true);
    setIsCheckpointEditMode(checkpointData !== null);
  }

  return (
    <div id="setting" className={`main-content pe-6 ${isOpen ? "pl-[130px]" : "pl-[10px]"} transition-all duration-300`}>
      {isLoading && <Loading />}
      <div className='flex flex-col pt-10 mb-[30px]'>
        <label className='text-white mb-4'>{t('component.screen-setting')}</label>
        <Select
          value={selectedScreenValue}
          onChange={handleScreenSelect}
          style={{ backgroundColor: "#fff", color: "#000", width: "500px", height: "40px" }}
        >
          {cameraSettingSelect.map((option, index) => (
            <MenuItem key={index + 1} value={option.value}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      {/* Checkpoint Data */}
      <div className='flex flex-col gap-2'>
        <div className='flex justify-between'>
          <label className='text-[25px] text-white'>{t('text.station-data')}</label>
          <div className='flex gap-2'>
            <div 
              className={`bg-dodgerBlue cursor-pointer rounded-[5px]`}
              title={t('title.add-station-camera')}
            >
              <Button
                onClick={() => handleCheckpointSettingClick()}
                sx={{
                  textTransform: "capitalize"
                }}
              >
                <Icon icon={checkpointData ? Pencil : Plus} size={checkpointData ? 20 : 25} color="white" />
                <span className='ml-[5px] text-white text-[15px]'>{t('button.station-data')}</span>
              </Button>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-4 gap-y-5 gap-x-2 py-[15px] px-[10px] border-[1px] border-dodgerBlue'>
          {
            (() => {
              const address = checkpointData?.province_name ? `ต.${checkpointData?.subdistrict_name}/ อ.${checkpointData?.district_name}/ จ.${checkpointData?.province_name}` : "-";
              const latLon = checkpointData ? `${checkpointData.latitude}, ${checkpointData.longitude}` : "-";
              const checkpointInfo = checkpointData?.checkpoint_name || "-";
              const organization = checkpointData?.organization || "-";
              const route = checkpointData?.route || "-";

              return (
                <>
                  <p title={checkpointInfo} className='text-white text-[15px] truncate'>{`${t('text.station-data')} : ${checkpointInfo}`}</p>
                  <p title={organization} className='text-white text-[15px] truncate'>{`${t('text.agency')} : ${organization}`}</p>
                  <p title={address} className='text-white text-[15px] truncate'>{`${t('text.address')} : ${address}`}</p>
                  <p title={route} className='text-white text-[15px] truncate'>{`${t('text.route')} : ${route}`}</p>
                  <p title={latLon} className='text-white text-[15px] truncate'>{`${t('text.latitude')}, ${t('text.longitude')}  : ${latLon}`}</p>
                </>
              )
            })()
          }
        </div>
      </div>
      {/* Camera List */}
      <div className='mt-2'>
        <div className='flex justify-between'>
          <label className='text-[25px] text-white'>{t('text.camera-list')}</label>
          <div className='flex gap-2'>
            <div 
              className={`${rowSelected.length > 0 ? "bg-dodgerBlue cursor-pointer" : "bg-nobel cursor-not-allowed"} rounded-[5px]`}
              title={t('title.copy-select-camera')}
            >
              <Button
                onClick={() => onCopySelectedClick()}
                disabled={rowSelected.length > 0 ? false : true}
                sx={{
                  textTransform: "capitalize"
                }}
              >
                <Icon icon={Copy} size={25} color="white" />
                <span className='ml-[5px] text-white text-[15px]'>{t('button.copy')}</span>
              </Button>
            </div>
            <div 
              className={`${cameraDetailSettingData.length < 4 && checkpointData ? "bg-dodgerBlue cursor-pointer" : "bg-nobel cursor-not-allowed"} rounded-[5px]`}
              title={t('title.add-camera')}
            >
              <Button
                onClick={() => handleCameraButtonClick(true)}
                disabled={cameraDetailSettingData.length >= 4 || !checkpointData ? true : false}
                sx={{
                  textTransform: "capitalize"
                }}
              >
                <Icon icon={Plus} size={25} color="white" />
                <span className='ml-[5px] text-white text-[15px]'>{t('button.camera')}</span>
              </Button>
            </div>
            <div 
              className={`${rowSelected.length > 0 ? "bg-coralRed cursor-pointer" : "bg-nobel cursor-not-allowed"} rounded-[5px]`}
              title={t('title.delete-select-camera')}
            >
              <Button
                onClick={() => onDeleteSelectedClick()}
                disabled={rowSelected.length > 0 ? false : true}
                sx={{
                  textTransform: "capitalize"
                }}
              >
                <Icon icon={Trash2} size={25} color="white" />
                <span className='ml-[5px] text-white text-[15px]'>{t('button.delete')}</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="rounded-lg overflow-y-auto h-[68vh] mt-[15px]">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-swamp backdrop-blur-md bg-opacity-80 text-[15px] text-white">
              <tr>
                <th className="px-4 py-2 flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    className='w-5 h-5 cursor-pointer'
                    checked={rowSelected.length === cameraDetailSettingData.length && cameraDetailSettingData.length > 0}
                    onChange={() => {
                      if (rowSelected.length === cameraDetailSettingData.length) {
                        setRowSelected([])
                      } 
                      else {
                        setRowSelected(cameraDetailSettingData.map(item => item.id))
                      }
                    }}
                  />
                </th>
                <th className="px-4 py-2">{t('table.column.order')}</th>
                <th className="px-4 py-2">{t('table.column.camera-status')}</th>
                <th className="px-4 py-2">{t('table.column.checkpoint-id')}</th>
                <th className="px-4 py-2">{t('table.column.lat-lon')}</th>
                <th className="px-4 py-2">{t('table.column.count-detected')}</th>
                <th className="px-4 py-2">{t('table.column.sensor-setting')}</th>
                <th className="px-4 py-2">{t('table.column.manage')}</th>
              </tr>
            </thead>
            <tbody>
              {cameraDetailSettingData.map((camera, index) => (
                <tr key={camera.id} className="border-b h-[30px] text-[15px] text-white">
                  <td className="px-4 py-2 text-center bg-celtic">
                    <div className="flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 cursor-pointer"
                        checked={rowSelected.includes(camera.id)}
                        onChange={() => {
                          if (rowSelected.includes(camera.id)) {
                            setRowSelected(rowSelected.filter(item => item !== camera.id))
                          } 
                          else {
                            setRowSelected([...rowSelected, camera.id])
                          }
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center bg-tuna">{index + 1}</td>
                  <td className="px-4 py-2 text-center bg-celtic">
                    {renderStatus(camera.alive)}
                  </td>
                  <td className="px-4 py-2 bg-tuna">{camera.cam_id}</td>
                  <td className="px-4 py-2 bg-celtic">{camera.latitude + ", " + camera.longitude}</td>
                  <td className="px-4 py-2 text-end bg-tuna">{formatNumber(camera.detecion_count)}</td>
                  <td className="px-4 py-2 bg-celtic flex justify-center">
                    <Button onClick={() => handleSensorSettingClick(camera)}>
                      <img 
                        src={`/icons/sensor-setting${camera.detection_area !== "" ? "-green" : ""}.png`}
                        style={{ height: "30px", width: "30px" }} 
                        alt="Sensor Setting" 
                      />
                    </Button>
                  </td>
                  <td className="px-4 py-2 bg-tuna">
                    <div className="flex justify-center gap-2">
                      <button 
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditClick(camera)}
                      >
                        <Icon icon={Pencil} size={20} color="white"></Icon>
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteClick(camera.id)}
                      >
                        <Icon icon={Trash2} size={20} color="white"></Icon>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Camera Setting Dialog */}
      <CameraSetting 
        open={isCameraSettingOpen}
        closeDialog={handleCameraSettingScreenClose} 
        selectedRow={selectedRow}
        isEditMode={isEditMode}
      />
      {/* Sensor Setting Dialog */}
      <SensorSetting 
        open={isSensorSettingOpen}
        closeDialog={handleSensorSettingScreenClose} 
        selectedRow={selectedRow}
      />
      {/* Checkpoint Setting Dialog */}
      <CheckpointSetting 
        open={isCheckpointSettingOpen}
        closeDialog={handleCheckpointSettingScreenClose} 
        checkpointData={checkpointData}
        isEditMode={isCheckpointEditMode}
      />
    </div>
  )
}

export default Setting