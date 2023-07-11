import "../styles/global.css"
import "../styles/home.css"
import {useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import {Navigate} from "react-router-dom";
import Select from 'react-select';

export default function HomePage(){
	const [selectedCountry, setSelectedCountry] = useState('USA');
	const [selectedInstitution, setSelectedInstitution] = useState();
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();


	const countryData = [{'label':'Canada','value':'CA'}, {'label':'USA','value':'USA'}]



	const institutionData = {
		'CA':[
			{'label':'University of Windsor'},
			{'label':'University of Toronto'}
		],
		'USA':[
			{'labe':'USC'},
			{'universityName':'UMichigan'}
		]
	}

	if(isLoggedIn){
		return (
			<>
				Welcome to UniConnect!
				<h2>Home Page</h2>
				<div className="search">
					<span>Search for Programs</span>
					<Select options={countryData} placeholder="Select Country" value={selectedCountry}/>

					<select className="selectDrop" name="country" value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
						{countryData.map((country,index) => (
							<option value={country.value}>{country.name}</option>
						))}
					</select>
					{selectedCountry ?
						(<select className="selectDrop" name="institution" value={selectedInstitution}>
						{institutionData[selectedCountry].map((institution,index) => (
							<option value={institution.universityName}>{institution.universityName}</option>
						))}
					</select>) : <></>}
				</div>
			</>
		);
	}
	else{
		return <Navigate to="/login" />
	}


}