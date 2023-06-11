import React, {useEffect, useState} from 'react';
import '../../styles/DoctorPage.css';
import {useNavigate} from "react-router-dom";
import {all} from "axios";
import {encode64} from "node-forge/lib/util.js";
import forge from "node-forge";
import CryptoJS from "crypto-js";

const DoctorPage = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [allFile, setAllFile] = useState(null);
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:1026/doctor/patientsList', {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();

                if (data) {
                    setPatients(data);
                }

                const response_file = await fetch('https://localhost:1026/files/', {
                    method: 'GET',
                    credentials: 'include'
                });

                const file_data = await response_file.json();

                console.log(file_data);

                if (file_data) {
                    setAllFile(file_data);
                }

            } catch (error) {
                console.error('Erreur lors de la requête HTTPS:', error);
                navigate("/error")
            }
        };

        fetchData();
    }, []);

    const handleDoctorUpdate = () => {
        navigate("/changeInfo");
    };

    const handlePatientAdd = async (user) => {
        const userInput = prompt('Entrez l\'adresse mail :');
        const response = await fetch('https://localhost:1026/requests/patient/' + userInput, {
            method: 'POST',
            credentials: 'include'
        });
    };

    const handlePatientDelete = async (user) => {
        const response = await fetch('https://localhost:1026/requests/patient/' + user.uuid, {
            method: 'DELETE',
            credentials: 'include'
        });
    };

    const handleRecordAccess = async (folder) => {
        const response = await fetch('https://localhost:1026/files/' + folder.name, {
            method: 'GET',
            credentials: 'include'
        });

        const data =  await response.text();

        // create download link
        const link = document.createElement('a');
        const test = 'data:application/pdf;base64,' +  encode64(data) ;

        link.setAttribute('href', test);
        link.setAttribute("download", "a.pdf");

        // Append to html link element page
        document.body.appendChild(link);
        // Start download
        link.click();
        // Clean up and remove the link
        link.parentNode.removeChild(link);
    };

    const handleFolderList = (user) => {
        const filtered = allFile.filter((file) => file.owner === user.uuid);
        setFolders(filtered);
    };

    const handleFileUpload = (event) => {
        // Afficher le fichier d'un patient
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        const reader = new FileReader();
        reader.onload = async () => {

            // const wordArray = CryptoJS.lib.WordArray.create(reader.result);           // Convert: ArrayBuffer -> WordArray
            // const encrypted = CryptoJS.AES.encrypt(wordArray, key.toString()).toString();        // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)

            const fileEnc = new Blob([reader.result]);                                    // Create blob from string

            // const cryptFileName = encryptText(file.name.substr(0, file.name.length - 4), key.toString());
            const formData = new FormData();
            formData.append("file", new File([fileEnc], "a"));

            try {
                const response = await fetch('https://localhost:1026/files/upload', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-type': 'multipart/form-data',
                    },
                    file: formData,
                    name: "a",
                });

                if (response.ok) {
                    alert("Fichier uploadé avec succès !");
                } else {
                    console.error('Erreur lors de l envoi du fichier : ', response.statusText);
                }

            } catch (error) {
                console.error('Erreur lors de la requête HTTPS:', error);
                navigate('/error');
            }
        };

        reader.readAsBinaryString(document.getElementById('file').files[0]);
    };



    return (
        <div className="doctor-page">
            <h1>Page du médecin</h1>
            <section>
                <h2>Mes informations</h2>
                <br/>
                <button onClick={handleDoctorUpdate}>Modifier mes informations</button>
                <br/>
            </section>
            <section>
                <h2>Mes patients</h2>
                <ul>
                    {patients.map((patient, index) => (
                        <li key={index}>
                            {patient.name}
                            <button onClick={()=> handleFolderList(patient)}>Voir le dossier médical</button>
                            <button onClick={()=>handlePatientDelete(patient)}>Supprimer</button>
                        </li>
                    ))}
                </ul>
                <br/>
                <button onClick={handlePatientAdd}>Ajouter un patient</button>
            </section>
            <section>
                <h2>Dossiers</h2>
                <ul>
                    {folders.map((folder, index) => (
                        <li key={index}>
                            {folder.originalName}
                            <button onClick={() => handleRecordAccess(folder)}>Consulter</button>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>Ajouter un fichier à un dossier médical</h2>
                <form onSubmit={handleSubmit}>
                    <input id="file" type="file" onChange={handleFileUpload}/>
                    <button type="submit">Upload</button>
                </form>
            </section>
        </div>
    );
};

export default DoctorPage;
