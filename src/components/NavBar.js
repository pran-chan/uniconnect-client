import "../styles/navbar.css"
import {useState} from "react";
import {useAuth} from "../contexts/AuthContext";
import {BrowserRouter, Link} from "react-router-dom";

export default function NavBar() {
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();
	const [isNavExpanded, setIsNavExpanded] = useState(false);

	const logIn = (e) => {
		e.preventDefault();
		setIsLoggedIn(true);
		setAuthUser({
			"Name":"Pranesh"
		})
	}

	const logOut = (e) => {
		e.preventDefault();
		setIsLoggedIn(false);
		setAuthUser(null)
	}
	return (
		<nav className="navigation">
			<Link to="/"><div className="logo">
				<img src="/icons/logo-horizontal.png"  alt="UniConnect Logo"/>
			</div></Link>
			<span>User is currently: {isLoggedIn ? 'Logged In' : 'Logged Out'}</span>
			{isLoggedIn ? (<span>User name: {authUser.Name}</span>) : null}

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
					<li>
						{isLoggedIn ? <Link to="/account">Account</Link> : <Link to="/login">Login</Link>}
					</li>
				</ul>
			</div>
		</nav>
	);
}