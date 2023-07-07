import "../styles/loginform.css"

export default function SignUpForm() {
	return (
		<div className="formContainer" id="formContainer">
			<form className="loginForm">
				<span className="logo-container"><img className="logo" src="../images/logo-name.png" alt="UniConnect Logo"/></span>
				<div className="text">Let's get you connected!</div>
				<input id="first_name" className="name" type="text" placeholder="First Name" required/>
				<input id="last_name" className="name" type="text" placeholder="Last Name" />
				<input id="email" className="email" type="email" placeholder="Email" required/>
				<input id="phone" className="phone" type="tel" placeholder="Phone" required/>
				<input id="password" className="password" type="password" placeholder="Password" required/>
				<input id="confirm_pass" className="password" type="password" placeholder="Retype Password" required/>
				<button id="submit" className="submitButton">Log In</button>
			</form>
		</div>

	);
}

function LoginForm() {
	return (
		<div className="formContainer">
			<form className="loginForm">
				<span className="logo-container"><img className="logo" src="../images/logo-name.png" alt="UniConnect Logo"/></span>
				<div className="text">Let's get you connected!</div>
				<input id="first_name" className="name" type="text" placeholder="First Name" required/>
				<input id="last_name" className="name" type="text" placeholder="Last Name" />
				<input id="email" className="email" type="email" placeholder="Email" required/>
				<input id="phone" className="phone" type="tel" placeholder="Phone" required/>
				<input id="password" className="password" type="password" placeholder="Password" required/>
				<input id="confirm_pass" className="password" type="password" placeholder="Retype Password" required/>
				<button id="submit" className="submitButton">Log In</button>
			</form>
		</div>
	);
}