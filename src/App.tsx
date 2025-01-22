import './App.css'
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
// import { Outlet, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Nav from "./layout/nav";
import "./styles/Main.scss";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux"
import { AppDispatch } from "./app/store"
// import { useAppDispatch } from './app/hooks'
// API
import {
  fetchProvincesThunk,
  fetchDataStatusThunk,
  fetchRegistrationTypesThunk,
  fetchPoliceDivisionsThunk,
  fetchCommonPrefixesThunk,
  fetchOfficerPrefixesThunk,
  fetchPositionThunk,
  fetchRegionsThunk,
  fetchStreamEncodesThunk,
  fetchVehicleBodyTypesThunk,
  fetchVehicleColorsThunk,
  fetchVehicleMakesThunk,
  fetchVehicleModelsThunk,
  fetchVehicleBodyTypesThThunk,
  fetchPersonTypesThunk,
} from "./features/dropdown/dropdownSlice";
// import { clearError } from './features/auth/authSlice'

// Screen
import Login from './modules/login/Login';
import SpecialRegistration from './modules/special-registration/SpecialRegistration'
import CCTV from './modules/cctv/CCTV';
import Setting from './modules/setting/Setting';
import SpecialRegistrationDetected from './modules/special-registration-detected/SpecialRegistrationDetected';
import SuspectPeopleDetected from './modules/suspect-people-detected/SuspectPeopleDetected';
import SpecialSuspectPerson from './modules/special-suspect-person/SpecialSuspectPerson';
import Chart from './modules/chart/Chart';

// Components
import FullScreenButton from './components/full-screen-button/FullScreenButton'

// const isAuthenticated = () => {
//   return !!localStorage.getItem('token');
// };

// const PrivateRoute = ({ children }: { children: JSX.Element }) => {
//   const dispatch = useAppDispatch()
//   dispatch(clearError())
//   return isAuthenticated() ? children : <Navigate to="/login" replace />;
// };

function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

function App() {
  const dispatch: AppDispatch = useDispatch();
  const constraintsRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    dispatch(fetchProvincesThunk({
      "orderBy": "name_th",
    }));
    dispatch(fetchDataStatusThunk());
    dispatch(fetchRegistrationTypesThunk({
      "filter": "visible:1"
    }));
    dispatch(fetchPoliceDivisionsThunk());
    dispatch(fetchCommonPrefixesThunk());
    dispatch(fetchOfficerPrefixesThunk());
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
  }, [dispatch]);

  return (
    <div ref={constraintsRef} className='min-h-screen min-w-screen'>
      {location.pathname !== '/login' && (
        <FullScreenButton constraintsRef={constraintsRef} />
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route
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
          <Route path="checkpoint/suspect-people-detected" element={<SuspectPeopleDetected />} />
          <Route path="checkpoint/special-suspect-person" element={<SpecialSuspectPerson />} />
          <Route path="checkpoint/chart" element={<Chart />} />
        </Route> */}
        <Route path="/*" element={<Layout />}>
          <Route path="checkpoint/special-registration" element={<SpecialRegistration />} />
          <Route path="checkpoint/cctv" element={<CCTV />} />
          <Route path="checkpoint/settings" element={<Setting />} />
          <Route path="checkpoint/special-registration-detected" element={<SpecialRegistrationDetected />} />
          <Route path="checkpoint/suspect-people-detected" element={<SuspectPeopleDetected />} />
          <Route path="checkpoint/special-suspect-person" element={<SpecialSuspectPerson />} />
          <Route path="checkpoint/chart" element={<Chart />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
