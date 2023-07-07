import './App.css';
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import Account from "./components/Account";
import HomePage from "./components/Home"
import {AuthProvider} from "./contexts/AuthContext";
import { Routes, Route} from 'react-router-dom';
import {useState} from "react";

function App() {
    const [isFormShown, setIsFormShown] = useState(false)
    return (
        <>
            <AuthProvider>
                <NavBar />
            </AuthProvider>
            <Routes>
                <Route path='/login' element={<LoginForm />} />
                <Route path='/account' element={<Account />} />
                <Route path='/' element={<HomePage />} />
            </Routes>
            {/* LoginForm is enclosed in formContainer div */}

        </>
  );
}

export default App;
