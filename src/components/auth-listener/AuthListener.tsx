import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../app/store"

// API
import {
  logout
} from "../../features/auth/authSlice"

const AuthListener = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth.authData);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token" && event.newValue === null) {
        dispatch(logout());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);


  return null;
};

export default AuthListener;
