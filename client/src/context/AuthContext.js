import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";

const STORAGE_KEY_USER = "pm-user-data";
const STORAGE_KEY_PARTIAL = "pm-partial-session";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [partialSession, setPartialSession] = useState(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    loadStoredState();
  }, []);

  // ─────────────────────────────────────────────
  // Restore Auth State
  // ─────────────────────────────────────────────

  const loadStoredState = async () => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      const storedPartial = localStorage.getItem(STORAGE_KEY_PARTIAL);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else if (storedPartial) {
        setPartialSession(JSON.parse(storedPartial));
      }
    } catch (err) {
      console.error("Failed to restore auth state:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Step 1 → Check Phone
  // ─────────────────────────────────────────────

  const checkPhone = async (phone) => {
    setAuthLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/customers/user-login-by-phone`,
        { phone }
      );

      return {
        exists: true,
        userData: res?.data?.data,
      };
    } catch (err) {
      if (err.response?.status === 404) {
        return { exists: false };
      }

      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Login OTP Verification
  // ─────────────────────────────────────────────

  const verifyLoginOTP = async (
    phone,
    otp,
    userData
  ) => {
    setAuthLoading(true);

    try {
      if (otp !== "1111") {
        throw new Error("Invalid OTP");
      }

      const sessionUser = {
        ...userData,
        phone,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem(
        STORAGE_KEY_USER,
        JSON.stringify(sessionUser)
      );

      setUser(sessionUser);

      toast.success("Login Successful");

      return sessionUser;
    } catch (err) {
      toast.error(err.message || "OTP verification failed");
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Register OTP Verification
  // ─────────────────────────────────────────────

  const verifyRegisterOTP = async (phone, otp) => {
    setAuthLoading(true);

    try {
      if (otp !== "1111") {
        throw new Error("Invalid OTP");
      }

      const partial = {
        phone,
        otpVerified: true,
      };

      localStorage.setItem(
        STORAGE_KEY_PARTIAL,
        JSON.stringify(partial)
      );

      setPartialSession(partial);

      toast.success("OTP Verified");

      return partial;
    } catch (err) {
      toast.error(err.message || "OTP verification failed");
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Register User
  // ─────────────────────────────────────────────

  const registerUser = async (formData) => {
    setAuthLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/customers/create-user`,
        formData
      );

      const createdUser = res?.data?.data;

      localStorage.setItem(
        STORAGE_KEY_USER,
        JSON.stringify(createdUser)
      );

      localStorage.removeItem(STORAGE_KEY_PARTIAL);

      setUser(createdUser);
      setPartialSession(null);

      toast.success("Account Created");

      return createdUser;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        "Registration failed"
      );

      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Logout
  // ─────────────────────────────────────────────

  const logout = async () => {
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_PARTIAL);

      setUser(null);
      setPartialSession(null);

      toast.success("Logged out");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        partialSession,

        isLoggedIn: !!user,

        authLoading,
        initialLoading,

        checkPhone,
        verifyLoginOTP,
        verifyRegisterOTP,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);