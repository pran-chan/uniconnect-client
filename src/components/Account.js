import "../styles/global.css"
import "../styles/account.css"
import {useAuth} from "../contexts/AuthContext";
import {useEffect, useState} from "react";
import Education from "./Education"
import Experience from "./Experience";
import Modal from 'react-modal'
import axios, {post} from "axios";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";


function addEducation(){
	return(
		<></>
	);
}

export default function Account() {
	const { register, handleSubmit, formState:{errors} } = useForm();
	const { register:expRegister, handleSubmit:expHandleSubmit, formState:{errors: experrors} } = useForm();
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	const [educations,setEducations] = useState(null);
	const [experiences,setExperiences] = useState(null);
	const [educationIsOpen, setEducationOpen] = useState(false);
	const [experienceIsOpen, setExperienceOpen] = useState(false);
	const navigate = useNavigate();

	Modal.setAppElement("body");

	function reloadProfile(){
		axios.get("http://localhost:8000/user/profile/", {
			headers: {
				'Authorization': `Token ${authUser.authToken}`
			}
		}).then(resp => {
			if (resp.data) {
				setEducations(resp.data.educations);
				setExperiences(resp.data.experiences);
			}
		});
	}

	useEffect(() => {
		if(!isLoggedIn)
			navigate("/login");
		if(!authUser) return;
		reloadProfile()
	}, [authUser]);

	function openEducation() {
		setEducationOpen(true);
	}

	function closeEducation() {
		setEducationOpen(false);
		reloadProfile();
	}

	function openExperience() {
		setExperienceOpen(true);
	}

	function closeExperience() {
		setExperienceOpen(false);
		reloadProfile();
	}

	function submitEducationForm(data){
		const postData = {
			"degree":data.degree,
			"institution": data.institution,
			"city": data.city,
			"state": data.state,
			"country": data.country,
			"start_date": data.start_date,
			"end_date": data.end_date,
			"field_of_study": data.study_field
		}
		axios.post("http://localhost:8000/user/add_edu/",postData,{headers:{'Authorization':`Token ${authUser.authToken}`}}
			).then(res => {
				closeEducation();
			}).catch(err => {
				console.log(err);
			});
	}

	function submitExperienceForm(data){
		const postData = {
			"title":data.title,
			"company": data.company,
			"city": data.city,
			"state": data.state,
			"country": data.country,
			"start_date": data.start_date,
			"end_date": data.end_date,
			"description": data.description
		}
		axios.post("http://localhost:8000/user/add_exp/",postData,{headers:{'Authorization':`Token ${authUser.authToken}`}}
		).then(res => {
			closeExperience();
		}).catch(err => {
			console.log(err);
		});
	}

	function EducationForm() {
		return(
		<Modal className="formContainer"
		       isOpen={educationIsOpen}
		       onRequestClose={closeEducation}
		       contentLabel="Add your Education"
		       shouldCloseOnOverlayClick={false}
		>
			<form className="loginForm" onSubmit={handleSubmit(submitEducationForm)}>
				<div className="title">Add an Education</div>
				<input {...register("degree",{required:"Degree is Required"})} id="degree" className="degree" type="text" placeholder="Degree"/>
				<input {...register("study_field",{required:"Field of Study is Required"})} id="study_field" className="studyField" type="text" placeholder="Field of Study" />
				<input {...register("institution",{required:"Institution is Required"})} id="institution" className="institution" type="text" placeholder="Institution" />
				<input {...register("city")} id="city" className="city" type="text" placeholder="City"/>
				<input {...register("state",{required:"State is Required"})} id="state" className="state" type="text" placeholder="State" />
				<input {...register("country",{required:"Country is Required"})} id="country" className="country" type="text" placeholder="Country" />
				<input {...register("start_date",{required:"Start Date is Required"})} id="start_date" className="date" type="date" placeholder="Start Date" />
				<input {...register("end_date",{required:"End Date is Required"})} id="end_date" className="date" type="date" placeholder="End Date"/><br/>
				<button type="submit" id="submit" className="submitButton">Add</button>
			</form>
			<button className="closeButton" onClick={closeEducation}>X</button>
		</Modal>
		);
	}

	function ExperienceForm() {
		return(
			<Modal className="formContainer"
			       isOpen={experienceIsOpen}
			       onRequestClose={closeExperience}
			       contentLabel="Add your Experience"
			       shouldCloseOnOverlayClick={false}
			>
				<form className="loginForm" onSubmit={expHandleSubmit(submitExperienceForm)}>
					<div className="title">Add an Experience</div>
					<input {...expRegister("title",{required:"Job title is Required"})} id="title" className="title" type="text" placeholder="Job Title"/>
					<input {...expRegister("company",{required:"Organization is Required"})} id="company" className="company" type="text" placeholder="Organization" />
					<input {...expRegister("description",{required:"Description is Required"})} id="description" className="description" type="textarea" placeholder="Role description" />
					<input {...expRegister("city")} id="city" className="city" type="text" placeholder="City"/>
					<input {...expRegister("state",{required:"State is Required"})} id="state" className="state" type="text" placeholder="State" />
					<input {...expRegister("country",{required:"Country is Required"})} id="country" className="country" type="text" placeholder="Country" />
					<input {...expRegister("start_date",{required:"Start Date is Required"})} id="start_date" className="date" type="date" placeholder="Start Date" />
					<input {...expRegister("end_date",{required:"End Date is Required"})} id="end_date" className="date" type="date" placeholder="End Date"/><br/>
					<button type="submit" id="submit" className="submitButton">Add</button>
				</form>
				<button className="closeButton" onClick={closeExperience}>X</button>
			</Modal>
		);
	}

	function connectToOutlook(){
		axios.get("http://localhost:8000/ms_graph/get_graph_auth_api",{headers:{'Authorization':`Token ${authUser.authToken}`}}
		).then(res => {
			window.open(res.data.OauthUrl, "_blank");
		}).catch(err => {
			console.log(err);
		});

	}

	let educationBlock = null, experienceBlock = null;
	if (educations) {
		educationBlock = educations.map((education) => (
			<Education key={education.id} education={education} reloadProfile={reloadProfile}/>
		));
	}
	if (experiences) {
		experienceBlock = experiences.map((experience) => (
			<Experience key={experience.id} experience={experience} reloadProfile={reloadProfile}/>
		));
	}

	return (
		<>
			<h2>Profile</h2>
			{authUser ? (
			<div className="profileContainer">
				<div className="profilePictureContainer">
					<img src="../images/van-gogh.jpg" className="profilePicture" alt="profile picture"/>
				</div>
				<div className="profileDetails">
					<div>{authUser.firstName} {authUser.lastName}</div>
					<div>{authUser.email}</div>
				</div>
			</div>) : null}
			<h3>Education</h3>
			<div className="educationContainer">
				{educationBlock}
			</div>
			<button className="addButton" onClick={openEducation}>Add Education</button>
			<h3>Experience</h3>
			<div className="experienceContainer">
				{experienceBlock}
			</div>
			<button className="addButton" onClick={openExperience}>Add Experience</button>
			<div  className="outlookConnect" onClick={connectToOutlook}>
				<img className="outlook" src="../icons/outlook.svg" /><span className="outlook">Connect</span>
			</div>
			<EducationForm />
			<ExperienceForm />
		</>
	);
}
