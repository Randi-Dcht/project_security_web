import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './styles/App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from './pages/Home';
import Connexion from "./pages/Connexion.jsx";
import Signup from "./pages/patient/Signup.jsx";
import Profil from './pages/patient/Profil';
import Admin from "./pages/Admin.jsx";
import Users from "./pages/Users.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/connexion" element={<Connexion/>}/>
                <Route exact path="/signup" element={<Signup/>}/>
                <Route exact path='/profil' element={<Profil/>}/>
                <Route exact path="/admin" element={<Admin/>}/>
                <Route exact path="/user" element={<Users/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
