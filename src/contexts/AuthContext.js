import React, {useState, useContext, useMemo} from "react";
import {useNavigate} from "react-router-dom";

const AuthContext = React.createContext();

export function useAuth(){
	return useContext(AuthContext);
}

export function AuthProvider(props){
	const [authUser, setAuthUser] = useState(()=>{

	})
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const value = {
		authUser, setAuthUser, isLoggedIn, setIsLoggedIn
	}
	const navigate = useNavigate();


	if(authUser==null) {
		const userData = JSON.parse(localStorage.getItem('userData'));
		if (userData) {
			setIsLoggedIn(true);
			setAuthUser(userData);
		}
	}

	return(
		<AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
	)
}