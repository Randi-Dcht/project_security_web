import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './styles/App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Connexion from "./pages/Connexion.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Connexion/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
