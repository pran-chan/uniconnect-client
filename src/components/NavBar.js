import "../styles/navbar.css"
import "../styles/global.css"
import {useEffect, useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import {Link,useNavigate} from "react-router-dom";

export default function NavBar() {
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	const [isNavExpanded, setIsNavExpanded] = useState(false);
	const navigate = useNavigate();
	useEffect(()=>{
		console.log("Inside UseEffect");
		if(authUser==null) {
			const userData = JSON.parse(localStorage.getItem('userData'));
			console.log(userData);
			if (userData) {
				setIsLoggedIn(true);
				setAuthUser(userData);
			}
			console.log("Inside AuthUserNull");
		}
	});
	const logOut = (e) => {
		console.log(e);
		e.preventDefault();
		localStorage.removeItem('userData');
		setIsLoggedIn(false);
		setAuthUser(null);
		navigate("/login");
	}
	return (
		<nav className="navigation">
			<Link to="/"><div className="logo">
				<img src="/icons/logo-horizontal.png"  alt="UniConnect Logo"/>
			</div></Link>
			<span>User is currently: {isLoggedIn ? 'Logged In' : 'Logged Out'}</span>
			{isLoggedIn ? (<span>User name: {authUser.username}</span>) : null}

			<button className="hamburger"
			        onClick={() => {
				        setIsNavExpanded(!isNavExpanded);
			        }}>
			</button>
			<div
				className={
					isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
				}>
				<ul>
					{isLoggedIn ? <li><Link to="/account">Account</Link></li>: <></>}
					<li> {isLoggedIn ? <><span onClick={logOut}>Log Out</span></> : <Link to="/login">Login</Link>}</li>
				</ul>
			</div>
		</nav>
	);
}