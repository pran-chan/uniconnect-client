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
		<div className="experience">
			<div>
				<span className="title">{experience.title}</span>
			</div>
			<div>
				<span className="company">{experience.company}</span>
			</div>
			<div>
				<span className="city">{experience.city}, </span>
				<span className="state">{experience.state}, </span>
				<span className="country">{experience.country}</span>
			</div>
			<div>
				<span className="description">{experience.description}</span>
			</div>
			<div>
				<span className="startDate"> From: {experience.start_date}</span>
			</div>
			<div>
				<span className="endDate"> To: {experience.end_date}</span>
			</div>
			<button className="editButton" onClick={()=>{deleteExperience(experience.id)}}></button>
		</div>
	);

}