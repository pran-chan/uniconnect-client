import "../styles/loginform.css"
import {useEffect, useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";




export default function Login(){
	const { register, handleSubmit, formState:{errors} } = useForm();
	const [alertText, setAlertText] = useState(null);
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	const navigate = useNavigate();

	useEffect(()=>{
		if(isLoggedIn){
			navigate(-1);
		}
	},[isLoggedIn,authUser])

	function handleLogin(){
		console.log("Inside handleLogin");
		axios.get("http://localhost:8000/user/profile",{
			headers:{
				'Authorization': `Token ${authUser.authToken}`
			}
		}).then(response => {
			console.log("Fetched profile data");
			if(response.data){
				let userData = response.data;
				authUser.id = userData.id;
				authUser.username = userData.username;
				authUser.firstName = userData.first_name;
				authUser.lastName = userData.last_name;
				setAuthUser(authUser);
				console.log(authUser);
				localStorage.setItem('userData',JSON.stringify(authUser));
				setIsLoggedIn(true);
			}
		}).catch(err=>{
			console.log(err);
		});
	}


	function onSubmit(data){
		const email = data.email;
		const password = data.password;
		setAlertText(null);
		axios.post('http://localhost:8000/user/login/',
			{
				'email': email,
				'password': password
			}
		).then( (response)=> {
			if(response.data){
				setAuthUser({
					"email":email,
					"authToken":response.data.token
				});
				console.log("Succesfully logged in");
				handleLogin();
			}
		}).catch((error)=>{
			let res = error.response;
			console.log(res);
			if(res){
				setAlertText(res.data?.error);
			}
		});
	}
	function toggleSignUp(){
		navigate("/signup");
	}

	return (
		<div className="formContainer">
			<form className="loginForm" onSubmit={handleSubmit(onSubmit)}>
				<span className="logo-container"><img className="logo" src="../images/logo-name.png" alt="UniConnect Logo"/></span>
				<div className="text">Log in to your UniConnect account.</div>
				<input {...register("email",{required:"Email is Required"})} id="email" className="email" type="email" placeholder="Email"/>
				{errors.email && <p role="alert">{errors.email?.message}</p>}
				<input {...register("password",{required:true, minLength:{value:8,message:"Password is atleast 8 characters"}})} id="password" className="password" type="password" placeholder="Password"/>
				{errors.password && <p role="alert">{errors.password?.message}</p>}
				{alertText ? <div className="alert">{alertText}</div> : <></>}<br/>
				<button type="submit" id="submit" className="submitButton">Log In</button><br/>
				<button className="link" onClick={toggleSignUp}>Not registered? Click here!</button>
			</form>
		</div>
	);
}





