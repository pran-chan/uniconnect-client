import "../styles/global.css"
import "../styles/account.css"
import {Navigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import {useEffect, useState} from "react";
import Modal from 'react-modal'


function addEducation(){
	return(
		<></>
	);
}

export default function Account(){
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	const [modalIsOpen, setIsOpen] = useState(false);
	Modal.setAppElement("body");

	useEffect(()=>{

	});

	function openForm(){
		setIsOpen(true);
	}
	function closeForm(){
		setIsOpen(false);
	}

	if(isLoggedIn){
		return (
			<>
				<button onClick={openForm}>Add Education</button>
				<Modal className="formContainer"
					isOpen={modalIsOpen}
					onRequestClose={closeForm}
					contentLabel="Add your Education"
				>
					<form className="loginForm">
						<div className="text">Add an Education</div>
						<input id="first_name" className="name" type="text" placeholder="First Name" required/>
						<input id="last_name" className="name" type="text" placeholder="Last Name"/>
						<input id="email" className="email" type="email" placeholder="Email" required/>
						<input id="phone" className="phone" type="tel" placeholder="Phone" required/>
						<input id="password" className="password" type="password" placeholder="Password" required/>
						<input id="confirm_pass" className="password" type="password" placeholder="Retype Password"
						       required/>
						<button id="submit" className="submitButton">Sign Up</button><br/>
						<button className="link">Already registered? Click here!</button>
					</form>
				</Modal>
			</>
		);
	}
	else{
		return <Navigate to="/login" />
	}
}