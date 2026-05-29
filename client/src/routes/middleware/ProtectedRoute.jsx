import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, initialLoading } = useAuth();
    const { openAuthModal } = useApp();

    if (initialLoading) {
        return null; // or loader
    }

    if (!isLoggedIn) {
        openAuthModal();
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;