import './App.css'
import { Outlet, Route, Routes } from "react-router-dom";
// import { Outlet, Route, Routes, Navigate } from "react-router-dom";
import Nav from "./layout/nav";
import "./styles/Main.scss";
import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { AppDispatch } from "./app/store"
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
} from "./features/dropdown/dropdownSlice";

// Screen
import Login from './modules/login/Login';
import SpecialRegistration from './modules/special-registration/SpecialRegistration'
import CCTV from './modules/cctv/CCTV';
import Setting from './modules/setting/Setting';
import SpecialRegistrationDetected from './modules/special-registration-detected/SpecialRegistrationDetected';
import SuspectPeopleDetected from './modules/suspect-people-detected/SuspectPeopleDetected';
import SpecialSuspectPerson from './modules/special-suspect-person/SpecialSuspectPerson';
import Chart from './modules/chart/Chart';

// const isAuthenticated = () => {
//   return !!localStorage.getItem('token');
// };

// const PrivateRoute = ({ children }: { children: JSX.Element }) => {
//   return isAuthenticated() ? children : <Navigate to="/Login" replace />;
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
    dispatch(fetchRegionsThunk());
    dispatch(fetchStreamEncodesThunk());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/Login" element={<Login />} />
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

    // <Routes>
    //   <Route path="/Login" element={<Login />} />

    //   <Route
    //     path="/*"
    //     element={
    //       <PrivateRoute>
    //         <Layout />
    //       </PrivateRoute>
    //     }
    //   >
    //     <Route path="checkpoint/special-registration" element={<SpecialRegistration />} />
    //     <Route path="checkpoint/cctv" element={<CCTV />} />
    //     <Route path="checkpoint/settings" element={<Setting />} />
    //   </Route>
    // </Routes>
  );
}

export default App;
