import "../styles/global.css"
import "../styles/account.css"
import {useAuth} from "../contexts/AuthContext";
import {useEffect, useState} from "react";
import Education from "./Education"
import Experience from "./Experience";
import axios from "axios";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {Button, FloatingLabel, Form} from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';


export default function Account() {
	const { register: eduRegister, handleSubmit: eduHandleSubmit, formState:{errors:eduErrors} } = useForm();
	const { register:expRegister, handleSubmit:expHandleSubmit, formState:{errors: expErrors} } = useForm();
	const { register:picRegister, handleSubmit:picHandleSubmit, formState:{errors: picErrors} } = useForm();
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	const [educations, setEducations] = useState(null);
	const [profilePicture, setProfilePicture] = useState(null);
	const [experiences, setExperiences] = useState(null);
	const navigate = useNavigate();

	const [showEducation, setShowEducation] = useState(false);

	const handleCloseEducation = () => setShowEducation(false);
	const handleShowEducation = () => setShowEducation(true);

	const [showPicture, setShowPicture] = useState(false);
	const handleClosePicture = () => setShowPicture(false);
	const handleShowPicture = () => setShowPicture(true);

	const [showExperience, setShowExperience] = useState(false);

	const handleCloseExperience = () => setShowExperience(false);
	const handleShowExperience = () => setShowExperience(true);

	function reloadProfile(){
		axios.get("http://localhost:8000/user/profile/", {
			headers: {
				'Authorization': `Token ${authUser.authToken}`
			}
		}).then(resp => {
			if (resp.data) {
				setProfilePicture(resp.data.profile_picture)
				setEducations(resp.data.educations);
				setExperiences(resp.data.experiences);
			}
		}).catch(err=>{
			if(err.response && err.response.data){
				if(err.response.data.detail === "Invalid token."){
					logOut();
				}
			}
		});
	}

	const logOut = () => {
		localStorage.removeItem('userData');
		setIsLoggedIn(false);
		setAuthUser(null);
		navigate("/login");
	}

	useEffect(() => {
		if(!authUser) return;
		reloadProfile()
	}, [authUser]);


	function submitPictureForm(data){
		console.log(data);
		var formData = new FormData();
		formData.append("image", data.profile_pic[0]);
		axios.patch('http://localhost:8000/user/upload_pic/', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'Authorization':`Token ${authUser.authToken}`
			}
		})
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
			handleCloseEducation();
			reloadProfile();
		}).catch(err => {
			console.log(err);
		});
	}

	function submitExperienceForm(data){
		console.log(data);
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
			handleCloseExperience();
			reloadProfile();
		}).catch(err => {
			console.log(err);
		});
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
			<div key={education.id} className="col">
				<Education key={education.id} education={education} reloadProfile={reloadProfile}/>
			</div>
		));
	}
	if (experiences) {
		experienceBlock = experiences.map((experience) => (
			<div key={experience.id} >
				<Experience key={experience.id} experience={experience} reloadProfile={reloadProfile}/>
			</div>
		));
	}

	function handleEditUsername(){
		console.log("Edit Username")
	}

	function EducationForm() {
		return (

			<Modal show={showEducation} onHide={handleCloseEducation}>
				<Modal.Header closeButton>
					<Modal.Title>Add Education</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form id="educationForm" onSubmit={eduHandleSubmit(submitEducationForm)}>
						<FloatingLabel controlId="floatingInput" label="Degree" className="mb-3">
							<input {...eduRegister("degree",{required:"Degree is Required"})} id="education_degree" type="text" placeholder="Degree" className="form-control" autoFocus/>
						</FloatingLabel>
						<FloatingLabel controlId="floatingInput" label="Field of Study" className="mb-3">
							<input {...eduRegister("study_field",{required:"Field of Study is Required"})} id="education_study_field" className="form-control" type="text" placeholder="Field of Study" />
						</FloatingLabel>
						<FloatingLabel controlId="floatingInput" label="Institution" className="mb-3">
							<input {...eduRegister("institution",{required:"Institution is Required"})} id="education_institution" className="form-control" type="text" placeholder="Institution" />
						</FloatingLabel>
						<FloatingLabel controlId="floatingInput" label="Country" className="mb-3">
							<input {...eduRegister("country",{required:"Country is Required"})} id="education_country" className="form-control" type="text" placeholder="Country" />
						</FloatingLabel>
						<FloatingLabel controlId="floatingInput" label="State" className="mb-3">
							<input {...eduRegister("state",{required:"State is Required"})} id="education_state" className="form-control" type="text" placeholder="State" />
						</FloatingLabel>
						<FloatingLabel controlId="floatingInput" label="City" className="mb-3">
							<input {...eduRegister("city")} id="education_city" className="form-control" type="text" placeholder="City"/>
						</FloatingLabel>
						<FloatingLabel controlId="floatingInput" label="Start Date" className="mb-3">
							<input {...eduRegister("start_date",{required:"Start Date is Required"})} id="education_start_date" className="form-control" type="date" placeholder="Start Date" />
						</FloatingLabel>
						<FloatingLabel controlId="floatingInput" label="End Date">
							<input {...eduRegister("end_date",{required:"End Date is Required"})} id="education_end_date" className="form-control" type="date" placeholder="End Date"/><br/>
						</FloatingLabel>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" form="educationForm" type="submit">Add</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	function ProfilePicForm() {
		return (
			<Modal show={showPicture} onHide={handleClosePicture}>
				<Modal.Header closeButton>
					<Modal.Title>Upload profile picture</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form id="profilePicForm" onSubmit={picHandleSubmit(submitPictureForm)}>
						<FloatingLabel controlId="floatingInput" label="Profile Picture" className="mb-3">
							<input {...picRegister("profile_pic",{required:"Profile picture is required"})} id="profile_pic" type="file" placeholder="Profile Pic" className="form-control"/>
						</FloatingLabel>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" form="profilePicForm" type="submit">Add</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	function ExperienceForm() {
		return (
			<Modal show={showExperience} onHide={handleCloseExperience}>
				<Modal.Header closeButton>
					<Modal.Title>Add Experience</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form id="experienceForm" onSubmit={expHandleSubmit(submitExperienceForm)}>
						<FloatingLabel controlId="floatingInput" label="Title" className="mb-3">
							<input {...expRegister("title",{required:"Title is Required"})} id="degree" type="text" placeholder="Title" className="form-control" autoFocus/>
						</FloatingLabel>
						<FloatingLabel controlId="floatingInput" label="Organization" className="mb-3">
							<input {...expRegister("company",{required:"Organization is Required"})} id="company" className="form-control" type="text" placeholder="Organization" />
						</FloatingLabel>
						<FloatingLabel controlId="floatingInput" label="Description" className="mb-3">
							<input {...expRegister("description",{required:"Description is Required"})} id="description" className="form-control" type="text" placeholder="Description" />
						</FloatingLabel>
						<FloatingLabel controlId="floatingInput" label="Country" className="mb-3">
							<input {...expRegister("country",{required:"Country is Required"})} id="country" className="form-control" type="text" placeholder="Country" />
						</FloatingLabel>
						<FloatingLabel controlId="floatingInput" label="State" className="mb-3">
							<input {...expRegister("state",{required:"State is Required"})} id="state" className="form-control" type="text" placeholder="State" />
						</FloatingLabel>
						<FloatingLabel controlId="floatingInput" label="City" className="mb-3">
							<input {...expRegister("city")} id="city" className="form-control" type="text" placeholder="City"/>
						</FloatingLabel>
						<FloatingLabel controlId="floatingInput" label="Start Date" className="mb-3">
							<input {...expRegister("start_date",{required:"Start Date is Required"})} id="start_date" className="form-control" type="date" placeholder="Start Date" />
						</FloatingLabel>
						<FloatingLabel controlId="floatingInput" label="End Date">
							<input {...expRegister("end_date",{required:"End Date is Required"})} id="end_date" className="form-control" type="date" placeholder="End Date"/><br/>
						</FloatingLabel>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" form="experienceForm" type="submit">Add</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	return (
		<div className="container-fluid bg-white p-0">
			<div className="mb-2 p-4">
				<div className="fs-2 fw-bold">Profile</div>
				{ authUser ? (
					<div className="row">
						<div className="col-1">
								<img src={profilePicture} onClick={handleShowPicture} className="rounded-circle img-thumbnail w-100" alt="profile pic"/>
						</div>
						<div className="my-auto col-auto fs-4">
							<div>{authUser.firstName} {authUser.lastName}</div>
							<span id="username" className="fw-light fs-5">@{authUser.username}</span><a className="ms-3 pointer-event pe-auto" onClick={handleEditUsername} href="#"><i className="bi bi-pencil fs-5"></i></a>
							<div className="fw-light fs-5">{authUser.email}</div>
						</div>
						<div className="col-auto">
							<button className="btn btn-danger fs-5 fw-bold mt-3 w-auto ms-3" onClick={logOut}>Log Out</button>
						</div>
					</div>) : null
				}
			</div>
			<div className="bg-warning-subtle p-4">
				<div className="fs-2 fw-bold">Education</div>
				<div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 p-3">
					{educationBlock}
				</div>
				<button className="btn btn-outline-primary fs-5 fw-bold mt-3 w-auto ms-3" onClick={handleShowEducation} >Add Education</button>
			</div>

			<div className="p-4">
				<div className="fs-2 fw-bold">Experience</div>
				<div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 p-3">
					{experienceBlock}
				</div>
				<button className="btn btn-outline-primary fs-5 fw-bold mt-3 w-auto ms-3" onClick={handleShowExperience} >Add Experience</button>
			</div>

			<div className="p-4 bg-warning-subtle">
				<div className="fs-2 fw-bold">Integration</div>
				<button  className="btn btn-outline-primary fs-5 fw-bold ms-3" onClick={connectToOutlook}>
					<i className="bi bi-microsoft"></i> Outlook
				</button>
			</div>
			<ExperienceForm />
			<EducationForm />
			<ProfilePicForm />
		</div>
	);
}
