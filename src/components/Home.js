import "../styles/global.css"
import "../styles/home.css"
import React, {useEffect, useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import {Link, Navigate} from "react-router-dom";
import Select from 'react-select';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import UniversityCard from "./UniversityCard"
import {
	Button,
	ButtonGroup,
	Col,
	Form,
	OverlayTrigger,
	Row,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip
} from "react-bootstrap";
import {useForm} from "react-hook-form";

export default function HomePage(){
	const [selectedCountry, setSelectedCountry] = useState(null);
	const [selectedUni, setSelectedUni] = useState(null);
	const [selectedProgram, setSelectedProgram] = useState(null);
	const [selectedYear, setSelectedYear] = useState(null);
	const [selectedIntake, setSelectedIntake] = useState(null);
	const [favourites,setFavourites] = useState(null);
	const [profile,setProfile] = useState(null);
	const [circle,setCircle] = useState(null);
	const [searchQuery,setSearchQuery] = useState(null);
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	const [countryData,setCountryData] = useState();
	const [uniData,setUniData] = useState();
	const [programData,setProgramData] = useState([]);
	const [filter,setFilter] = useState('ip');
	const [isProgramLoading, setIsProgramLoading] = useState(false);
	const { register, handleSubmit,reset } = useForm();
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
		axios.get("http://localhost:8000/user/"+authUser.id+"/favourites/",{
			headers:{
				'Authorization': `Token ${authUser.authToken}`
			}
		}).then(response => {
			setFavourites(response.data);
		});
	}

	function loadProfile(){
		axios.get("http://localhost:8000/user/profile/", {
			headers: {
				'Authorization': `Token ${authUser.authToken}`
			}
		}).then(response => {
			if (response.data) {
				setProfile(response.data);
			}
		}).catch(err => {
			console.log(err);
		});
	}

	useEffect(() => {
		if(!authUser) return;
		loadProfile()
		loadCountries()
		loadFavourites()
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

	useEffect(() => {
		reset();
		loadCircle();
	}, [filter]);


	const loadCircle = () => {
		let query = "";
		if(filter && filter==='contacts'){
			query = "?filter_by_contacts=true";
		}
		if(filter && filter==='ip'){
			query = "?filter_by_ip=true"
		}
		if(searchQuery){
			if(query.length)
				query +="&search="+searchQuery
			else
				query ="&search="+searchQuery
		}
		axios.get("http://localhost:8000/user/profile_list/"+query,{
			headers:{
				'Authorization': `Token ${authUser.authToken}`
			}
		}).then(response => {
			setCircle(response.data);
		});
	}
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

	function searchUsers(data){
		if(data.searchTerm) {
			setSearchQuery(data.searchTerm);
		}
		loadCircle();
	}

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

	const onFilterChange = e => {
		setFilter(e.target.value)
	}


	return (
		<div className="text-center user-select-none bg-white">
			<div className="blur-container p-0">
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
								<CreatableSelect noOptionsMessage={()=>{return "No courses. Type to add one"}} formatCreateLabel={(input)=>{return `Click here to create '${input}'`}} className="mb-3 mx-auto" options={programData} placeholder="Select Program" isLoading={isProgramLoading} isClearable onCreateOption={handleCreateProgram} onChange={setSelectedProgram} isDisabled={!selectedUni} value={selectedProgram}/>
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
				{profile ?(
						<div className="m-3">
							<div className="row">
								<div className="col">
									{favourites && (favourites.length) ? (
										<div className="border rounded p-3 bg-white">
											<div className="fs-4 mb-3">Interested Programs</div>
											<div className="row row-cols-2">
												{favourites.map((university, index) => (
													<div className="col mb-4" key={university.id} id={university.id}>
														<UniversityCard university={university}/>
													</div>
												))}
											</div>
										</div>
									): <></>}
								</div>
								<div className="col-4 position-sticky top-0">
									<div className="py-3 border rounded bg-white">
										<div className="mb-3 row px-3 justify-content-between">
											<div className="fs-4 col-auto">UniConnect Circle</div>
											<div className="col-auto">
												<ToggleButtonGroup size="sm" type="radio" name="filter" defaultValue='ip'>

													<ToggleButton variant="outline-primary" id="filter-ip" value='ip' onChange={onFilterChange} checked={filter === "ip"}>
														<OverlayTrigger
															placement="top"
															overlay={
																<Tooltip id={`button-tooltip-chat`}>Common Interests</Tooltip>
															}>
															<i className="fs-6 bi bi-intersect"></i>
														</OverlayTrigger>
													</ToggleButton>


													<ToggleButton variant={profile.con_connected ? ("outline-primary"): ("outline-secondary disabled")} id="filter-contact" value='contacts' onChange={onFilterChange} checked={filter === "contacts"}>
														<OverlayTrigger
															placement="top"
															overlay={
																<Tooltip id={`button-tooltip-chat`}>Contacts</Tooltip>
															}>
															<i className="fs-6 bi bi-person-vcard-fill"></i>
														</OverlayTrigger>
													</ToggleButton>
													<ToggleButton variant="outline-primary" id="filter-all" value='all' onChange={onFilterChange} checked={filter === "all"}>
														<OverlayTrigger
															placement="top"
															overlay={
																<Tooltip id={`button-tooltip-chat`}>All</Tooltip>
															}>
															<i className="fs-6 bi bi-people-fill"></i>
														</OverlayTrigger>
													</ToggleButton>
												</ToggleButtonGroup>
											</div>
										</div>
										{circle ?
											<>
												<Form onSubmit={handleSubmit(searchUsers)}>
													<Row className="mx-1 my-2">
														<Col className="w-100">
															<Form.Control autoComplete="off" { ...register("searchTerm")} id="searchTerm" type="text" placeholder="Type any search query"/>
														</Col>
														<Col className="col-auto">
															<Button id="search-submit" type="submit" variant="primary" ><i className="bi-search me-1"></i>Send</Button>
														</Col>
													</Row>
												</Form>
												<div className="list-group list-group-flush overflow-scroll" style={{'maxHeight':'40vh'}}>
													{circle.map((user)=>{
														return (
															<div key={`user_${user.id}`} id={`user_${user.id}`} className="list-group-item list-group-item-action" aria-current="true">
																<Link to={`/user/${user.id}`}>
																	<div className="d-flex w-100">
															<span className="text-black fw-normal fs-5">
																{user.profile_picture ? (
																		<img src={user.profile_picture} style={{'width':'40px','height':'100%'}} className="rounded-circle me-2" alt="profile pic"/>
																	)
																	: <span className="border container h-100 bg-secondary-subtle me-2 fs-4 fw-lighter text-capitalize" style={{'width':'30px','height':'30px','borderRadius':'25px'}}>{user.first_name[0]}</span>
																}
																{user.username}
															</span>
																	</div>
																</Link>
															</div>
														)})}
												</div>
											</>
											:<div className="w-100 mt-5 text-center"><span className=" fs-5 text-secondary">No matching users</span></div>
										}
									</div>
								</div>
							</div>
						</div>):
					<></>}
			</div>
		</div>
	);

}