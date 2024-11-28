import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "../features/search/searchSlice";
import detectPersonReducer from "../features/detect-person/detectPersonSlice";
import userManagementReducer from "../features/user-management/userManagementSlice";
import SpecialLicenseReducer from "../features/special-license/specialLicenseSlice";
import dropdownReducer from "../features/dropdown/dropdownSlice";
import cameraSettingsSlice from "../features/camera-settings/cameraSettingsSlice";

export const store = configureStore({
  reducer: {
    vehicles: searchReducer,
    persons: detectPersonReducer,
    userMgmt: userManagementReducer,
    licenses: SpecialLicenseReducer,
    dropdown: dropdownReducer,
    cameraSettings: cameraSettingsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
