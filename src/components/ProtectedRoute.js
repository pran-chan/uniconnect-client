import { Navigate } from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";

export const ProtectedRoute = ({ children }) => {
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	if (!isLoggedIn) {
		// user is not authenticated
		return <Navigate to="/login" />;
	}
	return children;
};