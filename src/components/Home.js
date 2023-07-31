import "../styles/global.css"
import "../styles/home.css"
import {useEffect, useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import {Navigate} from "react-router-dom";
import Select from 'react-select';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import UniversityCard from "./UniversityCard"

export default function HomePage(){
	const [selectedCountry, setSelectedCountry] = useState(null);
	const [selectedUni, setSelectedUni] = useState(null);
	const [selectedProgram, setSelectedProgram] = useState(null);
	const [selectedYear, setSelectedYear] = useState(null);
	const [selectedIntake, setSelectedIntake] = useState(null);
	const [favourites,setFavourites] = useState(null);
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	const [countryData,setCountryData] = useState();
	const [uniData,setUniData] = useState();
	const [programData,setProgramData] = useState([]);
	const [isProgramLoading, setIsProgramLoading] = useState(false);
	const navigate = useNavigate();


	const yearData = [{value:'2023',label:'2023'},{value:'2024',label:'2024'},{value:'2025',label:'2025'},{value:'2026',label:'2026'},{value:'2027',label:'2027'}]
	const intakeData = [{value:'Winter',label:'Winter (Jan-Apr)'},{value:'Summer',label:'Summer (May-Aug)'},{value:'Fall',label:'Fall (Sep-Dec)'}]

	function loadCountries(){
		axios.get("http://localhost:8000/universities/countries/",{
			headers:{
				'Authorization': `Token ${authUser.authToken}`
			}
		}).then(response => {
			setCountryData(response.data);
		}).catch(err=>{
			console.log(err);
		});
	}

	function loadFavourites() {
		axios.get("http://localhost:8000/user/favourites/",{
			headers:{
				'Authorization': `Token ${authUser.authToken}`
			}
		}).then(response => {
			setFavourites(response.data);
		});
	}

	useEffect(() => {
		if(!authUser) return;
		loadCountries()
		loadFavourites();
	}, [authUser]);

	useEffect(()=>{
		setSelectedUni(null);
		if(selectedCountry){
			axios.get("http://localhost:8000/universities/?country="+selectedCountry.value,{
				headers:{
					'Authorization': `Token ${authUser.authToken}`
				}
			}).then(response => {
				setUniData(response.data);

			});
		}
	},[selectedCountry])

	useEffect(()=>{
		setSelectedProgram(null);
		if(selectedUni){
			axios.get("http://localhost:8000/universities/programs/"+selectedUni.value+"/",{
				headers:{
					'Authorization': `Token ${authUser.authToken}`
				}
			}).then(response => {
				setProgramData(response.data);
			});
		}
	},[selectedUni])

	useEffect(()=>{
		setSelectedYear(null);
		setSelectedIntake(null);
	},[selectedProgram]);


	const handleCreateProgram = (inputValue) => {
		setIsProgramLoading(true);

		axios.post("http://localhost:8000/universities/program/"+selectedUni.value+"/",{
				name:inputValue
			},
			{headers:{
					'Authorization': `Token ${authUser.authToken}`
				}
			}).then(response => {
			const newOption = response.data;
			setProgramData((prev) => [...prev, newOption]);
			setSelectedProgram(newOption);
			setIsProgramLoading(false);
		});

	};

	const addToFavorites = () => {
		const inputData = {
			program_id: selectedProgram.value,
			intake_name: selectedIntake.value + " " + selectedYear.value
		}
		axios.post("http://localhost:8000/user/add_favourite/", inputData,
			{headers:{
					'Authorization': `Token ${authUser.authToken}`
				}
			}).then(response => {
			setSelectedYear(null);
			setSelectedIntake(null);
			loadFavourites();
		}).catch((err)=>{
			console.log(err);
		});
	}


	return (
		<div className="shadow container-fluid bg-white p-0 text-center user-select-none">
			<div className="container p-3">
				<h1 className="fw-bold my-4">Welcome to UniConnect!</h1>
			</div>
			<div className="mx-3">
				<div className="w-75 form-control mx-auto">
					<div className="fs-4 my-3">Search for Programs</div>
					<div className="row">
						<div className="col-5">
							<Select className="mb-3 mx-auto" options={countryData} placeholder="Select Country" onChange={setSelectedCountry} isClearable/>
						</div>
						<div className="col-7">
							<Select className="mb-3 mx-auto" options={uniData} placeholder="Select Institution" onChange={setSelectedUni} isDisabled={!selectedCountry} value={selectedUni} isClearable/>
						</div>
					</div>
					<div className="row mb-3">
						<div className="col-7">
							<CreatableSelect className="mb-3 mx-auto" options={programData} placeholder="Select Program" isLoading={isProgramLoading} isClearable onCreateOption={handleCreateProgram} onChange={setSelectedProgram} isDisabled={!selectedUni} value={selectedProgram}/>
						</div>
						<div className="col-2">
							<Select className="mb-3 mx-auto" options={yearData} placeholder="Select Year" onChange={setSelectedYear} isDisabled={!selectedProgram} isClearable value={selectedYear}/>
						</div>
						<div className="col-3">
							<Select className="mx-auto" options={intakeData} placeholder="Select Intake" onChange={setSelectedIntake} isDisabled={!selectedYear} isClearable value={selectedIntake}/>
						</div>
					</div>
					<button className="btn btn-primary mx-3 fs-5 mb-3" onClick={addToFavorites}>Add to Favourites</button>
				</div>
			</div>
			{(favourites && favourites.length) ? (
				<div className="m-3">
					<div className="form-control p-3">
						<div className="fs-4 mb-3">Interested Programs</div>
						<div className="row row-cols-2">
							{favourites.map((university, index) => (
								<div className="col" key={university.id} id={university.id}>
									<UniversityCard university={university}/>
								</div>
							))}
						</div>
					</div>
				</div>
			) : <></>
			}

		</div>
	);

}