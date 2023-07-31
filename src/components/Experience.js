import axios from 'axios';
import {useAuth} from "../contexts/AuthContext";


export default function Experience({experience,reloadProfile}){
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();

	function deleteExperience(id){
		if(id) {
			axios.delete("http://localhost:8000/user/del_exp/" + id + "/",{headers:{
					'Authorization': `Token ${authUser.authToken}`
				}}).then(res => {
				reloadProfile();
			});
		}
	}

	return(
		<div className="card mb-2 card-course" id="course_{{ course.id }}">
			<div className="card-body card-course-body">
				<div className="row justify-content-between">
					<div className="col-sm">
						<h5 className="card-title">{experience.title}</h5>
					</div>
				</div>
				<span className="fw-light fs-6">{experience.company}</span>
				<div className="mb-2">
					<span>{experience.city}, </span>
					<span>{experience.state}, </span>
					<span>{experience.country}</span>n
					<p>{experience.description}</p>
					<div>
						<span> From: {experience.start_date}</span>
					</div>
					<div>
						<span> To: {experience.end_date}</span>
					</div>
				</div>
			</div>
			<div className="card-footer ">

				<div className="row justify-content-end">
					<div className="col-auto">
						<button id={"delete_experience"+experience.id} data-bs-toggle="tooltip" data-bs-title="Delete experience" className="btn btn-sm btn-outline-danger" onClick={()=>{deleteExperience(experience.id)}}><i className="bi-trash3"></i></button>
					</div>
				</div>
			</div>
		</div>
	);

}