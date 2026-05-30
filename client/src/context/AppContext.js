import { createContext, useContext, useState } from "react";
import AuthModal from "../components/Login/AuthModal";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [authModal, setAuthModal] = useState({ isOpen: false, mode: "login" });

    const openAuthModal = (mode = "login") =>
        setAuthModal({ isOpen: true, mode });

    const closeAuthModal = () =>
        setAuthModal((prev) => ({ ...prev, isOpen: false }));

    const switchAuthMode = (mode) =>
        setAuthModal({ isOpen: true, mode });

    
    return (
        <AppContext.Provider value={{ authModal, openAuthModal, closeAuthModal, switchAuthMode }}>
            {children}
            {authModal.isOpen && (
                <AuthModal
                    mode={authModal.mode}
                    onModeChange={switchAuthMode}
                    onClose={closeAuthModal}
                />
            )}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);