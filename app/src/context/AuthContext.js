import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../utils/basicInfo';

const STORAGE_KEY_USER = 'pm-user-data';
const STORAGE_KEY_PARTIAL = 'pm-partial-session';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [partialSession, setPartialSession] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);

    useEffect(() => { loadStoredState(); }, []);
    // console.log("user:", user)
    // ─── Restore state on app start ──────────────────────────────────────────
    const loadStoredState = async () => {
        try {
            const [storedUser, storedPartial] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEY_USER),
                AsyncStorage.getItem(STORAGE_KEY_PARTIAL),
            ]);

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else if (storedPartial) {
                // OTP verified but profile never completed — will resume on profile screen
                setPartialSession(JSON.parse(storedPartial));
            }
        } catch (err) {
            console.error('Failed to restore auth state:', err);
        } finally {
            setInitialLoading(false);
        }
    };

    // ─── Step 1: Check if phone number exists ────────────────────────────────
    // Returns { exists: true, userData }  →  go to Login OTP screen
    // Returns { exists: false }           →  go to Register OTP screen
    // Throws on network error             →  UI shows generic error
    const checkPhone = async phone => {
        setAuthLoading(true);
        try {
            const res = await axios.post(
                `${API_BASE_URL}/customers/user-login-by-phone`,
                { phone },
            );
            return { exists: true, userData: res.data.data };
        } catch (err) {
            if (err.response?.status === 404) {
                return { exists: false };
            }
            throw err;
        } finally {
            setAuthLoading(false);
        }
    };

    // ─── Step 2a (login): Verify OTP → persist full session ──────────────────
    const verifyLoginOTP = async (phone, otp, userData) => {
        setAuthLoading(true);
        try {
            if (otp !== '1111') throw new Error('Invalid OTP. Please try again.');

            const sessionUser = { ...userData, phone, loginTime: new Date().toISOString() };
            await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));
            setUser(sessionUser);
            return sessionUser;
        } finally {
            setAuthLoading(false);
        }
    };

    // ─── Step 2b (register): Verify OTP → persist PARTIAL session ────────────
    // Saved immediately so app restart can resume from the profile screen
    const verifyRegisterOTP = async (phone, otp) => {
        setAuthLoading(true);
        try {
            if (otp !== '1111') throw new Error('Invalid OTP. Please try again.');

            const partial = { phone, otpVerified: true };
            await AsyncStorage.setItem(STORAGE_KEY_PARTIAL, JSON.stringify(partial));
            setPartialSession(partial);
            return partial;
        } finally {
            setAuthLoading(false);
        }
    };

    // ─── Step 3 (register): Create user → upgrade to full session ────────────
    const registerUser = async formData => {
        setAuthLoading(true);
        try {
            const res = await axios.post(
                `${API_BASE_URL}/customers/create-user`,
                formData,
            );
            const createdUser = res.data.data;

            await Promise.all([
                AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(createdUser)),
                AsyncStorage.removeItem(STORAGE_KEY_PARTIAL),
            ]);

            setUser(createdUser);
            setPartialSession(null);
            return createdUser;
        } catch (err) {
            throw err;
        } finally {
            setAuthLoading(false);
        }
    };

    // ─── Logout ───────────────────────────────────────────────────────────────
    const logout = async () => {
        try {
            await Promise.all([
                AsyncStorage.removeItem(STORAGE_KEY_USER),
                AsyncStorage.removeItem(STORAGE_KEY_PARTIAL),
            ]);
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
            setPartialSession(null);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            partialSession,        // { phone, otpVerified } — use in app navigator to resume profile
            isLoggedIn: !!user,
            authLoading,
            initialLoading,
            checkPhone,
            verifyLoginOTP,
            verifyRegisterOTP,
            registerUser,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);