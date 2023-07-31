import "../styles/loginform.css"
import {useEffect, useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import axios, {post} from 'axios';
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";




export default function SignUp(){
	const { register, handleSubmit, formState:{errors} } = useForm();
	const [alertText, setAlertText] = useState('');
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	const navigate = useNavigate();

	useEffect(()=>{
		if(isLoggedIn){
			navigate(-1);
		}
	})

	function handleLogin(){
		console.log("Inside HandleLogin");
		axios.get("http://localhost:8000/user/profile",{
			headers:{
				'Authorization': `Token ${authUser.authToken}`
			}
		}).then(response => {
			if(response.data){
				let userData = response.data;
				authUser.username = userData.username;
				authUser.firstName = userData.first_name;
				authUser.lastName = userData.last_name;
				setAuthUser(authUser);
				console.log(authUser);
				localStorage.setItem('userData',JSON.stringify(authUser));
				setIsLoggedIn(true);
			}
		});
	}


	function onSubmit(data){
		setAlertText(null);
		const postData = {
			'email': data.email,
			'password': data.password,
			'first_name':data.first_name,
			'phone_number':data.phone
		}
		if(data.last_name){
			postData.last_name = data.last_name;
		}

		if(data.password !== data.confirm_password){
			setAlertText("Passwords do not match");
			return;
		}

		axios.post('http://localhost:8000/user/signup/',
			postData
		).then( (response)=> {
			console.log(response);
			if(response.status===201){
				axios.post('http://localhost:8000/user/login/',
					{
						'email': postData.email,
						'password': postData.password
					}
				).then( (resp)=> {
					if(resp.data){
						setAuthUser({
							"email":postData.email,
							"authToken":resp.data.token
						});
						console.log(authUser);
						navigate("/login");
						//setTimeout(handleLogin,100);
					}
				});
			}
		}).catch((error)=>{
			let res = error.response;
			console.log(res);
			if(res.data?.password){
				setAlertText(res.data?.password);
			}
			else if(res.data?.email){
				if(res.data?.email[0].includes("unique")){
					setAlertText("Email address already in use");
				}
			}
			else if(res.data?.phone_number){
				if(res.data?.phone_number[0].includes("unique")){
					setAlertText("Phone number already in use");
				}
			}
		});
	}
	function toggleSignUp(){
		navigate("/login");
	}

	return (
		<div className="formContainer" id="formContainer">
			<form className="loginForm" onSubmit={handleSubmit(onSubmit)}>
				<span className="logo-container"><img className="logo" src="../images/logo-name.png"
				                                      alt="UniConnect Logo"/></span>
				<div className="text">Let's get you connected!</div>
				<input {...register("first_name",{required:"First name is Required"})} id="first_name" className="name" type="text" placeholder="First Name"/>
				<input {...register("last_name")} id="last_name" className="name" type="text" placeholder="Last Name"/>
				<input {...register("email",{required:"Email is Required"})} id="email" className="email" type="email" placeholder="Email"/>
				<input {...register("phone",{required:"Phone is Required"})} id="phone" className="phone" type="tel" placeholder="Phone" />
				<input {...register("password",{required:true, minLength:{value:8,message:"Password is atleast 8 characters"}})} id="password" className="password" type="password" placeholder="Password" />
				<input {...register("confirm_password",{required:true, minLength:{value:8,message:"Password is atleast 8 characters"}})} id="confirm_pass" className="password" type="password" placeholder="Retype Password"/>
				{alertText ? <div className="alert">{alertText}</div> : <></>}<br/>
				<button type="submit" id="submit" className="submitButton">Sign Up</button><br/>
				<button className="link" onClick={toggleSignUp}>Already registered? Click here!</button>
			</form>
		</div>
	)

}





