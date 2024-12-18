import './App.css'
import { Outlet, Route, Routes, Navigate } from "react-router-dom";
import Nav from "./layout/nav";
import "./styles/Main.scss";

// Screen
import Login from './modules/login/Login';
import SpecialRegistration from './modules/special-registration/SpecialRegistration'
import CCTV from './modules/cctv/CCTV';
import Setting from './modules/setting/Setting';

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/Login" replace />;
};

function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/Login" element={<Login />} />
      <Route path="/*" element={<Layout />}>
        <Route path="checkpoint/special-registration" element={<SpecialRegistration />} />
        <Route path="checkpoint/cctv" element={<CCTV />} />
        <Route path="checkpoint/settings" element={<Setting />} />
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
