import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/demoStorage";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
