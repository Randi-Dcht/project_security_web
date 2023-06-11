import React, {useEffect, useState} from 'react';
import '../styles/DoctorPage.css';
import {useNavigate} from "react-router-dom";

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
                    setLastName(data.lastName);
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

    const handleSubmit = () => {
        const nameRegex = /^[a-zA-Z\s]*$/;

        //verifier si le mail est vide
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(mail)) {
            console.log('Veuillez entrer une adresse e-mail valide.');
            return;
        }

        if (name === '') {
            setName(oldName);
        }
        if (lastName === '') {
            setLastName(oldLastName);
        }
        if (mail === '') {
            setMail(oldMail);
        }
        if (name === '' && lastName === '' && mail === '') {
            return;
        }
        if (mail !== oldMail) {
            //TODO changer le mail et le p12
        }
        if (name !== oldName) {
            //TODO changer le nom
        }
        if (lastName !== oldLastName) {
            //TODO changer le prenom
        }
        setIsEditing(false);
    };

    const handleRequest = () => {

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
