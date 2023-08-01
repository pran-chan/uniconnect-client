import {useAuth} from "../contexts/AuthContext";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Education from "./Education";
import Experience from "./Experience";


export default function UserProfile(){

	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const { userID } = useParams();
	const [educationBlock,setEducationBlock] = useState();
	const [experienceBlock,setExperienceBlock] = useState();

	useEffect(() => {
		if(!authUser) return;
		if(authUser.id == userID){
			navigate("/account");
		}
		else{
			loadProfile();
		}
	}, [authUser]);

	useEffect(() => {
		console.log("Inside useEffect for user");
		console.log(user);
		if (user && user.educations) {
			setEducationBlock(user.educations.map((education) => (
				<div key={education.id} className="col">
					<Education key={education.id} education={education} minimal={true}/>
				</div>
			)));
		}
		if (user && user.experiences) {
			setExperienceBlock(user.experiences.map((experience) => (
				<div key={experience.id} >
					<Experience key={experience.id} experience={experience} minimal={true}/>
				</div>
			)));
		}
	}, [user]);

	function loadProfile(){
		axios.get("http://localhost:8000/user/"+userID+"/profile/", {
			headers: {
				'Authorization': `Token ${authUser.authToken}`
			}
		}).then(response => {
			if (response.data) {
				setUser(response.data);
			}

		}).catch(err => {
			console.log(err);
		});
	}

	function startChat(userID){
		let ls = [userID,authUser.id];
		ls.sort();
		let channel_name="pvt_"+ls[0]+"_"+ls[1];
		console.log(channel_name)
		navigate("/messages/?channel="+channel_name)

	}


	return (
		<div className="shadow container-fluid bg-white user-select-none p-3">
			<nav className="breadcrumb-div" aria-label="breadcrumb">
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><a href="/">Home</a></li>
					<li className="breadcrumb-item active" aria-current="page">Profile</li>
				</ol>
			</nav>
			<div className="container-fluid p-3">
				{user ? (
					<>
						<div className="row">
							<div className="col-1">
								<img src={user.profile_picture} className="rounded-circle img-thumbnail w-100" alt="profile pic" />
							</div>
							<div className="my-auto col-auto fs-4">
								<div>{user.first_name} {user.last_name}</div>
								<span id="username" className="fw-light fs-5">{user.username}</span>
								<div className="fw-light fs-5">{user.email}</div>
							</div>
							<div className="col-auto">
								<button className="btn btn-outline-dark fs-5 mt-3 w-auto ms-3" onClick={()=> startChat(user.id)}><i className={"bi-chat-dots-fill me-2"}></i>Chat</button>
							</div>
						</div>
						<div className="bg-warning-subtle p-3 rounded mt-3">
							<div className="fs-2 fw-bold">Education</div>
							<div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 p-3">
								{educationBlock}
							</div>
						</div>

						<div className="p-3 bg-secondary-subtle rounded mt-1 ">
							<div className="fs-2 fw-bold">Experience</div>
							<div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 p-3">
								{experienceBlock}
							</div>
						</div>
					</>
				):<></>
				}

			</div>
		</div>
	)
}