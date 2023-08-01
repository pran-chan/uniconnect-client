import "../styles/navbar.css"
import "../styles/global.css"
import {useEffect} from "react";
import {useAuth} from "../contexts/AuthContext";
import {Link} from "react-router-dom";

export default function NavBar() {
	const {authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useAuth();

	return (

		<nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top p-0">
			<div className="container-fluid bg-warning">
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse"
				        data-bs-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false"
				        aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarToggler">
					<ul className="navbar-nav w-100 mb-2 mb-lg-0 justify-content-between ">
						<li key="home_link" className="nav-item col-auto">
							<Link to="/" className="nav-link">
								<i className="fs-3 bi-house-door-fill"></i>
							</Link>
						</li>
						<li key="nav_brand" className="col-auto">
							<div className="navbar-brand px-2 brand">
								<img src="/icons/logo-horizontal.png"  alt="UniConnect Logo" height="50px"/>
							</div>
						</li>
						<li key="account_link" className="col-auto">
							{isLoggedIn ?
								<div className="row">
									<div className="col">
										<Link to="/messages" className="nav-link me-2">
											<i className="bi-chat-dots fs-3"></i>
										</Link>
									</div>
									<div className="col">
										<Link to="/account" className="nav-link me-2">
											<i className="bi-person-fill fs-3"></i>
										</Link>
									</div>
								</div>
								: <Link className="nav-link me-2" to="/login">
									<i className="bi-arrow-in-right fs-3"></i>
								</Link>
							}
						</li>
					</ul>
				</div>
			</div>
		</nav>

	);
}