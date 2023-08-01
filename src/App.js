import NavBar from "./components/NavBar";
import Login from "./components/LoginForm";
import SignUp from "./components/SignUpForm";
import Account from "./components/Account";
import HomePage from "./components/Home"
import Community from "./components/Community"
import UserProfile from "./components/UserProfile"
import {AuthProvider} from "./contexts/AuthContext";
import { Routes, Route} from 'react-router-dom';
import {useState} from "react";
import {ProtectedRoute} from "./components/ProtectedRoute";
import ChatRoom from "./components/ChatRoom";
import Messages from "./components/Messages";

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
                    <Route path='/community/:universityID/chat' element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
                    <Route path='/messages' element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                    <Route path='/user/:userID' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                    <Route path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                </Routes>
            </AuthProvider>
        </>
  );
}

export default App;
