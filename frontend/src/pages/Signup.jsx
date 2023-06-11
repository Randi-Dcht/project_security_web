import React, {useState} from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Signup.css';
import {requestCert} from "../Utils.js";

const Signup = () => {

    const [email, setEmail] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [role, setRole] = useState('patient');

    const registerClick = async () => {
        // Vérification du format de l'adresse e-mail

        let url = 'https://localhost:1026/registerP';
        if (role !== "patient") {
            url = 'https://localhost:1026/registerAD'
        }

        await requestCert(url,email,firstName,lastName,false);
    };


    return (
        <div className="signup-container">
            <h2 className="title is-2">Inscription :</h2>

            <div className="field">
                <label className="label">Email</label>
                <div className="control">
                    <input className="input form-field" type="email" placeholder="e.g. alexsmith@gmail.com"
                           onChange={(event) => setEmail(event.target.value)}/>
                </div>
            </div>

            <div className="field">
                <label className="label">Nom</label>
                <div className="control">
                    <input className="input form-field" type="text" placeholder="e.g. Smith"
                           onChange={(event) => setLastName(event.target.value)}/>
                </div>
            </div>

            <div className="field">
                <label className="label">Prénom</label>
                <div className="control">
                    <input className="input form-field" type="text" placeholder="e.g. Alex"
                           onChange={(event) => setFirstName(event.target.value)}/>
                </div>
            </div>

            <div className="field">
                <label className="label">
                    Votre rôle
                </label>
                <div className='select'>
                    <select onChange={(e) => setRole(e.target.value)}>
                        <option value="patient">Patient</option>
                        <option value="doctor">Docteur</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            <button onClick={registerClick}>Inscription</button>
        </div>
    )
}

export default Signup;
