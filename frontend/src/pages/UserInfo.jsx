import React, {useEffect, useState} from 'react';
import '../styles/UserInfo.css';
import {useNavigate} from "react-router-dom";
import {requestCert} from "../Utils.js";

const DoctorPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mail, setMail] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [oldName, setOldName] = useState('');
    const [oldLastName, setOldLastName] = useState('');
    const [oldMail, setOldMail] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:1026/me', {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();
                if (! data.roles.includes("ROLE_USER")){
                    navigate("/error");
                }
                console.log(data);

                if (data) {
                    setName(data.name);
                    setLastName("");
                    setMail(data.email);
                }

            } catch (error) {
                console.error('Erreur lors de la requête HTTPS:', error);
                navigate("/error");
            }
        };

        fetchData();
    }, []);

    const handleEdit = () => {
        setOldLastName(lastName);
        setOldName(name);
        setOldMail(mail);
        setIsEditing(!isEditing);
    };

    const handleSubmit = async () => {

        const url = "https://localhost:1026/changeInfo";
        await requestCert(url,mail,name,lastName,true);
        setIsEditing(false);
    };

    const handleRequest = async () => {
        const url = "https://localhost:1026/changeInfo";
        await requestCert(url,mail,name,lastName,true);
    }

    return (
        <div className="doctor-page">
            {isEditing ? (
                <div>
                    <p>Modification des informations (laisser vide pour ne pas modifier)</p>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nom"/>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                           placeholder="Prénom"/>
                    <input type="text" value={mail} onChange={e => setMail(e.target.value)} placeholder="Email"/>
                    <button onClick={handleSubmit}>Soumettre</button>
                </div>
            ) : (
                <div>
                    <p>Nom: {name}</p>
                    <p>Prénom: {lastName}</p>
                    <p>Email: {mail}</p>
                    <button onClick={handleEdit}>Modifier</button>
                    <p><button onClick={handleRequest}>Demander un nouveau certificat</button></p>

                </div>
            )}
        </div>
    );
};

export default DoctorPage;
