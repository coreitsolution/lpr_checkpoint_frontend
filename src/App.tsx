import './App.css'
import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Nav from "./layout/nav"
import "./styles/Main.scss"
import { useRef, useEffect } from "react"
import { useAppDispatch } from './app/hooks'
import { RootState } from "./app/store"
import { useSelector } from "react-redux"

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
  fetchDistrictsThunk,
  fetchSubDistrictsThunk,
} from "./features/dropdown/dropdownSlice"

// Screen
import Login from './modules/login/Login'
import SpecialRegistration from './modules/special-registration/SpecialRegistration'
import CCTV from './modules/cctv/CCTV'
import Setting from './modules/setting/Setting'
import SpecialRegistrationDetected from './modules/special-registration-detected/SpecialRegistrationDetected'
import SuspectPeopleDetected from './modules/suspect-people-detected/SuspectPeopleDetected'
import SpecialSuspectPerson from './modules/special-suspect-person/SpecialSuspectPerson'
import Chart from './modules/chart/Chart'

// Components
import FullScreenButton from './components/full-screen-button/FullScreenButton'
import AuthListener from './components/auth-listener/AuthListener'

// Config
import { WEB_SOCKET_SERVICE } from './config/apiConfig'

// utils
import { websocketService } from './utils/websocketService'

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
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
      dispatch(fetchDistrictsThunk({
        "orderBy": "name_th",
      }));
      dispatch(fetchSubDistrictsThunk({
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
      websocketService.connect(WEB_SOCKET_SERVICE || "");
    }
  }, [dispatch, navigate, authData])

  return children
}

function Layout() {
  return (
    <>
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
          {/* <Route path="checkpoint/suspect-people-detected" element={<SuspectPeopleDetected />} /> */}
          <Route path="checkpoint/special-suspect-person" element={<SpecialSuspectPerson />} />
          {/* <Route path="checkpoint/chart" element={<Chart />} /> */}
        </Route>
      </Routes>
    </div>
  )
}

export default App
