import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './styles/App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from './pages/Home';
import Connexion from "./pages/Connexion.jsx";
import Signup from "./pages/Signup.jsx";
import UserPage from './pages/patient/UserPage.jsx';
import DoctorPage from './pages/doctor/DoctorPage.jsx';
import AdminPage from './pages/admin/AdminPage.jsx';
import UserInfo from './pages/UserInfo.jsx';
import Error from './pages/Error.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/connexion" element={<Connexion/>}/>
                <Route exact path="/signup" element={<Signup/>}/>
                <Route exact path="/admin" element={<AdminPage/>}/>
                <Route exact path="/user" element={<UserPage/>}/>
                <Route exact path="/doctor" element={<DoctorPage/>}/>
                <Route exact path="/changeInfo" element={<UserInfo/>}/>
                <Route exact path="/Error" element={<Error/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
