import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../modules/login/Login";
import ExtraRegistration from "../modules/special-registration/SpecialRegistration";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <LoginPage /> },
      { path: "/extra-registration", element: <ExtraRegistration /> },
    ]
  }
])