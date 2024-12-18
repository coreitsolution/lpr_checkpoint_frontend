import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "../features/search/searchSlice";
import detectPersonReducer from "../features/detect-person/detectPersonSlice";
import userManagementReducer from "../features/user-management/userManagementSlice";
import SpecialLicenseReducer from "../features/special-license/specialLicenseSlice";
import dropdownReducer from "../features/dropdown/dropdownSlice";
import cameraSettingsReducer from "../features/camera-settings/cameraSettingsSlice";
import liveViewRealTimeReducer from "../features/live-view-real-time/liveViewRealTimeSlice";
import registrationDataReducer from "../features/registration-data/RegistrationDataSlice";
import authReducer from "../features/auth/authSlice"
import fileUploadReducer from "../features/file-upload/fileUploadSlice"

export const store = configureStore({
  reducer: {
    vehicles: searchReducer,
    persons: detectPersonReducer,
    userMgmt: userManagementReducer,
    licenses: SpecialLicenseReducer,
    dropdown: dropdownReducer,
    cameraSettings: cameraSettingsReducer,
    liveViewRealTimes: liveViewRealTimeReducer,
    registrationData: registrationDataReducer,
    auth: authReducer,
    fileUpdateData: fileUploadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
