import axios from 'axios';
import {useAuth} from "../contexts/AuthContext";


export default function Education({education,reloadProfile,minimal}){
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();

	function deleteEducation(id){
		if(id) {
			axios.delete("http://localhost:8000/user/del_edu/" + id + "/",{headers:{
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
						<h5 className="card-title">{education.degree}</h5>
					</div>
				</div>
				<span className="fw-light fs-6">{education.field_of_study}</span>
				<div className="mb-2">
					<span>{education.city}, </span>
					<span>{education.state}, </span>
					<span>{education.country}</span>
					<div>
						<span> From: {education.start_date}</span>
					</div>
					<div>
						<span> To: {education.end_date}</span>
					</div>
				</div>
			</div>
			{!minimal ? (
				<div className="card-footer ">
					<div className="row justify-content-end">
						<div className="col-auto">
							<button id={"delete_education"+education.id} className="btn btn-sm btn-outline-danger" onClick={()=>{deleteEducation(education.id)}}><i className="bi-trash3"></i></button>
						</div>
					</div>
				</div>)
				: <></>
			}

		</div>
	);

}