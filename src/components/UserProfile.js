import {useAuth} from "../contexts/AuthContext";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";


export default function UserProfile(){

	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	const navigate = useNavigate();
	const { userID } = useParams();

	useEffect(() => {
		if(!authUser) return;
		console.log(userID);
		console.log(authUser.id);
		if(authUser.id == userID){
			navigate("/account");
		}
	}, [authUser]);

	return (
		<div className="shadow container-fluid bg-white user-select-none p-3">
			<nav className="breadcrumb-div" aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><a href="/">Home</a></li>
					<li className="breadcrumb-item active" aria-current="page">Profile</li>
				</ol>
			</nav>
			<div className="container-fluid p-3">
				<div className="row">
					<div className="col-1">
						<img src="../images/van-gogh.jpg" className="rounded-circle img-thumbnail w-100" alt="profile picture"/>
					</div>
					<div className="my-auto col-auto fs-4">
						<div>First Name Last Name</div>
						<span id="username" className="fw-light fs-5">@Username</span>
						<div className="fw-light fs-5">Email@email.com</div>
					</div>
				</div>
			</div>
		</div>
	)
}