import {useParams} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import {useEffect} from "react";


export default function ChatRoom(){
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	const { universityID } = useParams();


	useEffect(() => {
		if(!authUser) return;
		//loadUniversity();
		loadChats();
	}, [authUser]);

	function loadChats(){

	}

	return (
		<div className="shadow container-fluid bg-white user-select-none p-3">
			<nav className="breadcrumb-div" aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><a href="/">Home</a></li>
					<li className="breadcrumb-item" aria-current="page"><a href={`/community/${universityID}/`}>Community</a></li>
					<li className="breadcrumb-item active" aria-current="page">Chat</li>
				</ol>
			</nav>
			<div className="container-fluid p-3">
				<span className="fw-bold display-3 mb-3">{universityID}</span>
			</div>
		</div>
	)
}