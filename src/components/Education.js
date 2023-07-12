import axios from 'axios';
import {useAuth} from "../contexts/AuthContext";


export default function Education({education,reloadProfile}){
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
		<div className="education">
			<div>
				<span className="degree">{education.degree}</span><span className="studyField"> ({education.field_of_study})</span>
			</div>
			<div>
				<span className="institution">{education.institution}</span>
			</div>
			<div>
				<span className="city">{education.city}, </span>
				<span className="state">{education.state}, </span>
				<span className="country">{education.country}</span>
			</div>
			<div>
				<span className="startDate"> From: {education.start_date}</span>
			</div>
			<div>
				<span className="endDate"> To: {education.end_date}</span>
			</div>
			<button className="editButton" onClick={()=>{deleteEducation(education.id)}}></button>
		</div>
	);

}