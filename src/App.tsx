import './App.css'
import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Nav from "./layout/nav"
import "./styles/Main.scss"
import { useRef, useEffect } from "react"
import { useAppDispatch } from './app/hooks'
import { RootState } from "./app/store"
import { useSelector } from "react-redux"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { triggerCameraRefresh } from './features/refresh/refreshSlice';

// API
import { clearError } from './features/auth/authSlice'
import {
  fetchProvincesThunk,
  fetchDataStatusThunk,
  fetchRegistrationTypesThunk,
  fetchPoliceDivisionsThunk,
  fetchPersonTitlesThunk,
  fetchPositionThunk,
  fetchRegionsThunk,
  fetchStreamEncodesThunk,
  fetchVehicleBodyTypesThunk,
  fetchVehicleColorsThunk,
  fetchVehicleMakesThunk,
  fetchVehicleModelsThunk,
  fetchVehicleBodyTypesThThunk,
  fetchPersonTypesThunk,
} from "./features/dropdown/dropdownSlice"
import { 
  fetchCameraSettingsThunk,
} from "./features/camera-settings/cameraSettingsSlice"
import { 
  fetchSettingsThunk,
  fetchSettingsShortThunk,
} from "./features/settings/settingsSlice"
import {
  upsertRealtimeData,
} from './features/realtime-data/realtimeDataSlice';

// Types
import { CameraSettings } from "./features/camera-settings/cameraSettingsTypes"

// Screen
import Login from './modules/login/Login'
import SpecialRegistration from './modules/special-registration/SpecialRegistration'
import CCTV from './modules/cctv/CCTV'
import Setting from './modules/setting/Setting'
import SpecialRegistrationDetected from './modules/special-registration-detected/SpecialRegistrationDetected'
// import SuspectPeopleDetected from './modules/suspect-people-detected/SuspectPeopleDetected'
// import SpecialSuspectPerson from './modules/special-suspect-person/SpecialSuspectPerson'
// import Chart from './modules/chart/Chart'
import UserInfo from './modules/user-info/UserInfo'

// Components
import FullScreenButton from './components/full-screen-button/FullScreenButton'
import AuthListener from './components/auth-listener/AuthListener'
import CameraAlert from './components/camera-alert/CameraAlert'

// Config
import { getUrls } from './config/runtimeConfig';

// utils
import { websocketService, settingWebsocketService } from './utils/websocketService'
import { fetchClient, combineURL } from "./utils/fetchClient";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { WEB_SOCKET_SERVICE, SETTING_WEBSOCKET_URL, SETTING_WEBSOCKET_TOKEN, API_URL } = getUrls();
  const { authData } = useSelector((state: RootState) => state.auth)
  
  useEffect(() => {
    dispatch(clearError())
    if (authData && !authData.token) {
      navigate('/login', { replace: true })
    }
    else {
      dispatch(fetchProvincesThunk({
        "orderBy": "name_th",
      }));
      dispatch(fetchDataStatusThunk());
      dispatch(fetchRegistrationTypesThunk({
        "filter": "visible:1"
      }));
      dispatch(fetchPoliceDivisionsThunk());
      dispatch(fetchPersonTitlesThunk({
        "orderBy": "title_th",
      }));
      dispatch(fetchPositionThunk());
      dispatch(fetchRegionsThunk({
        "orderBy": "name_th",
      }));
      dispatch(fetchStreamEncodesThunk());
      dispatch(fetchVehicleBodyTypesThunk());
      dispatch(fetchVehicleColorsThunk());
      dispatch(fetchVehicleMakesThunk());
      dispatch(fetchVehicleModelsThunk());
      dispatch(fetchVehicleBodyTypesThThunk());
      dispatch(fetchPersonTypesThunk({
        "filter": "visible:1"
      }));
      dispatch(fetchCameraSettingsThunk({
        "filter": "deleted:0"
      }))
      dispatch(fetchSettingsThunk())
      dispatch(fetchSettingsShortThunk())

      const fetchDeletedCamera = async (cameraUid: string) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        let cameraName = "";
        
        try {
          const response = await fetchClient<CameraSettings>(combineURL(API_URL, "/cameras/get"), {
            method: "GET",
            signal: controller.signal,
            queryParams: { 
              filter: `cam_uid=${cameraUid}`,
            },
          });

          if (response.success) {
            cameraName = response.data[0].cam_id;
          }
        }
        catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(errorMessage);
        }
        finally {
          clearTimeout(timeoutId);
        }

        return cameraName;
      }

      const listener = async (message: any) => {
        if (message.event !== "delete-camera-approved" && message.event !== "reactivate-camera") return;

        const isReactive = message.event === "reactivate-camera";
        const isUpdatePage = location.pathname.includes('/settings');
        const cameraName = await fetchDeletedCamera(message.data.camera_uid);

        toast(
          (props) => (
            <CameraAlert
              {...props}
              data={{
                cameraName: cameraName || "-",
                approved: message.data.approved ?? false,
                timestamp: message.timestampUtc,
                isReactive,
                onUpdate: () => {
                  if (isUpdatePage) {
                    dispatch(triggerCameraRefresh())
                  }
                  else {
                    navigate('/checkpoint/settings', { replace: true })
                  }
                },
                updateVisible: true,
              }}
            />
          ),
          {
            autoClose: false,
            theme: 'light',
          }
        );
      }

      const handleWebSocketMessage = (message: any) => {
        if (message.topic !== "lpr-data/new-data") return;
  
        dispatch(upsertRealtimeData(JSON.parse(message.message)));
      }

      websocketService.connect(WEB_SOCKET_SERVICE || "");
      settingWebsocketService.connect(SETTING_WEBSOCKET_URL, SETTING_WEBSOCKET_TOKEN);

      websocketService.onMessage(handleWebSocketMessage)
      settingWebsocketService.onMessage(listener);
    }
  }, [dispatch, navigate, authData])

  return children
}

function Layout() {
  return (
    <>
      <ToastContainer newestOnTop={true}/>
      <Nav />
      <Outlet />
    </>
  )
}

function App() {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  return (
    <div ref={constraintsRef} className='min-h-screen min-w-screen'>
      {location.pathname !== '/login' && (
        <FullScreenButton constraintsRef={constraintsRef} />
      )}
      <AuthListener />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
          }
        >
          <Route path="checkpoint/special-registration" element={<SpecialRegistration />} />
          <Route path="checkpoint/cctv" element={<CCTV />} />
          <Route path="checkpoint/settings" element={<Setting />} />
          <Route path="checkpoint/special-registration-detected" element={<SpecialRegistrationDetected />} />
          <Route path="checkpoint/user-info" element={<UserInfo />} />
          {/* <Route path="checkpoint/suspect-people-detected" element={<SuspectPeopleDetected />} /> */}
          {/* <Route path="checkpoint/special-suspect-person" element={<SpecialSuspectPerson />} /> */}
          {/* <Route path="checkpoint/chart" element={<Chart />} /> */}
        </Route>
      </Routes>
    </div>
  )
}

export default App
