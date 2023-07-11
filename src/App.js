import NavBar from "./components/NavBar";
import Login from "./components/LoginForm";
import SignUp from "./components/SignUpForm";
import Account from "./components/Account";
import HomePage from "./components/Home"
import {AuthProvider} from "./contexts/AuthContext";
import { Routes, Route} from 'react-router-dom';
import {useState} from "react";

function App() {
    const [isFormShown, setIsFormShown] = useState(false);
    return (
        <>
            <AuthProvider>
                <NavBar />
                <Routes>
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/account' element={<Account />} />
                    <Route path='/' element={<HomePage />} />
                </Routes>
            </AuthProvider>
        </>
  );
}

export default App;
