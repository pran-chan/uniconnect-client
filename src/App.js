import NavBar from "./components/NavBar";
import Login from "./components/LoginForm";
import SignUp from "./components/SignUpForm";
import Account from "./components/Account";
import HomePage from "./components/Home"
import Chat from "./components/Chat"
import Community from "./components/Community"
import {AuthProvider} from "./contexts/AuthContext";
import { Routes, Route} from 'react-router-dom';
import {useState} from "react";
import {ProtectedRoute} from "./components/ProtectedRoute";

function App() {
    const [isFormShown, setIsFormShown] = useState(false);
    return (
        <>
            <AuthProvider>
                <NavBar />
                <Routes>
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/account' element={<ProtectedRoute><Account /></ProtectedRoute>} />
                    <Route path='/community/:universityID' element={<ProtectedRoute><Community /></ProtectedRoute>} />
                    <Route path='/chat' element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                    <Route path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                </Routes>
            </AuthProvider>
        </>
  );
}

export default App;
