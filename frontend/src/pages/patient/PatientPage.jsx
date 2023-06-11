import React, {useEffect, useState} from "react";
import CryptoJS from 'crypto-js';
import '../../styles/PatientPage.css'; // un fichier CSS pour styliser notre composant
import {useNavigate} from "react-router-dom";
import forge from "node-forge";
import {CryptJsWordArrayToUint8Array, encryptText, randomString} from "../../Utils.js";

const PatientPage = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [records, setRecords] = useState([]);
    const [file, setFile] = useState(null);
    const [folders, setFolders] = useState([]);
    const [requests, setRequests] = useState([]);
    const [privateKey, setPrivateKey] = useState(null);
    const [publicKey, setPublicKey] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:1026/patient/doctorList', {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();


                if (data) {
                    setDoctors(data);
                }

                const response_me = await fetch('https://localhost:1026/me/', {
                    method: 'GET',
                    credentials: 'include'
                });

                const data_me = await response_me.json();

                if (data_me) {
                    setFolders(data_me.filesInfo);
                    setRequests(data_me.incomingRequests)
                    const publicKey = forge.pki.publicKeyFromPem(data_me.publicKey);
                    setPublicKey(publicKey)
                }

            } catch (error) {
                console.error('Erreur lors de la requête HTTPS:', error);
                navigate("/error");
            }
        };

        fetchData();
    }, []);




    const handlePatientUpdate = () => {
        navigate("/changeInfo")
    };
    const handleDoctorAdd = async () => {
        const doctorToAdd = prompt("Entrez l'adresse mail du médecin à ajouter :");
        const mailRegex = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$");
        if (!mailRegex.test(doctorToAdd)) {
            alert("L'adresse mail entrée n'est pas valide.");
            return;
        }
        const response = await fetch('https://localhost:1026/patient/addDoctor/' + doctorToAdd, {
            method: 'POST',
            credentials: 'include'
        });
        if (!response.ok) {
            alert("L'adresse mail entrée n'est pas valide.");
            return;
        }
        window.location.reload();
    };

    const handleDoctorDelete = async (doctor) => {
        const response = await fetch('https://localhost:1026/patient/removeDoctor/' + doctor.uuid, {
            method: 'DELETE',
            credentials: 'include'
        });
        window.location.reload();
    };

    const handleSendKey = async (doctor) => {
        let key = localStorage.getItem("key");
        if (!key || !privateKey){
            return;
        } else {
            key = privateKey.decrypt(key,'RSA-OAEP');
        }

        const response = await fetch('https://localhost:1026/patient/doctorPublic/' + doctor.uuid, {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            let doctor_key = await response.text();
            const publicKey = forge.pki.publicKeyFromPem(doctor_key);
            const encrypted = publicKey.encrypt(key,'RSA-OAEP');

            let a  = await fetch('https://localhost:1026/requests/sendKey/' + doctor.uuid, {
                method: 'POST',
                credentials: 'include',
                body:encrypted,
            });

        }
    };

    const handleRecordAccess = async (folder) => {
        let key = localStorage.getItem("key");
        if (!key || !privateKey) {
            console.log(privateKey)
            return;
        } else {
            key = privateKey.decrypt(key, 'RSA-OAEP');
        }

        const response = await fetch('https://localhost:1026/files/' + folder.name, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.text();

        const decrypted = CryptoJS.AES.decrypt(data, key);               // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
        const typedArray = CryptJsWordArrayToUint8Array(decrypted);               // Convert: WordArray -> typed array

        const fileDec = new Blob([typedArray]);                                   // Create blob from typed array

        const a = document.createElement("a");
        const url = window.URL.createObjectURL(fileDec);
        //const filename = cryptFile.name.substr(0, cryptFile.name.length - 4) + ".pdf";
        a.href = url;
        a.download = "ad.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
    };
    const handleRecordDelete = async (data) => {
        const response = await fetch('https://localhost:1026/files/' + data.name, {
            method: 'DELETE',
            credentials: 'include'
        });
        window.location.reload();
    }

    const handleRequestAccept = async (data) => {
        const response = await fetch('https://localhost:1026/requests/accept/' + data.id, {
            method: 'POST',
            credentials: 'include'
        });
        window.location.reload();
    };
    const handleRequestRefuse = async (data) => {
        const response = await fetch('https://localhost:1026/requests/refuse/' + data.id, {
            method: 'POST',
            credentials: 'include'
        });
        window.location.reload();
    };

    const handleFileUpload = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileSubmit = () => {

        let key = localStorage.getItem("key");
        if (!key){
            const salt = CryptoJS.lib.WordArray.random(128 / 8);
            const passphrase = randomString();
            const key = CryptoJS.PBKDF2(passphrase, salt, {
                keySize: 128 / 32
            });
            let encrypted_key = publicKey.encrypt(key.toString(),"RSA-OAEP")
            localStorage.setItem("key", encrypted_key);
        } else {
            if (!privateKey){
                return;
            }
            key = privateKey.decrypt(key,'RSA-OAEP');
        }


        const reader = new FileReader();
        reader.onload = async () => {

            const wordArray = CryptoJS.lib.WordArray.create(reader.result);           // Convert: ArrayBuffer -> WordArray
            const encrypted = CryptoJS.AES.encrypt(wordArray, key.toString()).toString();        // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)

            const fileEnc = new Blob([encrypted]);                                    // Create blob from string

            const a = document.createElement("a");
            const url = window.URL.createObjectURL(fileEnc);
            const filename = "a" + ".enc";
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);

            const cryptFileName = encryptText(file.name.substr(0, file.name.length - 4), key.toString());
            const formData = new FormData();
            formData.append("file", new File([fileEnc], cryptFileName));

            try {
                const response = await fetch('https://localhost:1026/files/upload/', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-type': 'multipart/form-data',
                    },
                    file: formData,
                    name: cryptFileName,
                });

                if (response.ok) {
                    alert("Fichier uploadé avec succès !");
                } else {
                    console.error('Erreur lors de l envoi du fichier : ', response.statusText);
                }

            } catch (error) {
                console.error('Erreur lors de la requête HTTPS:', error);
                window.location.href = '/error';
            }
        };
        reader.readAsArrayBuffer(document.getElementById('file').files[0]);


    };


    const handleKeyChange= () => {
        const reader = new FileReader();
        reader.onload = () => {

            const p12b64 = btoa(reader.result)
            // decode p12 from base64
            const p12Der = forge.util.decode64(p12b64);
            // get p12 as ASN.1 object
            const p12Asn1 = forge.asn1.fromDer(p12Der);

            // decrypt p12 using an "empty" password (eg: OpenSSL with no password input)
            const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, true,'');

            const keyBags = p12.getBags({bagType: forge.pki.oids.pkcs8ShroudedKeyBag});
            const bag = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0];
            setPrivateKey(bag.key) ;


        };

        reader.readAsBinaryString(document.getElementById('file_p12').files[0]);
    }

    return (
        <div className="patient-page">
            <section>
                <h2>Mes informations</h2>
                <br/>
                <button onClick={handlePatientUpdate}>Modifier mes informations</button>
            </section>
            <section>
                <h2>Médecins</h2>
                <ul>
                    {doctors.map((doctor, index) => (
                        <li key={index}>
                            {doctor.name}
                            <button onClick={() => handleDoctorDelete(doctor)}>Supprimer</button>
                            <button onClick={() => handleSendKey(doctor)}>Renvoyer accès</button>
                        </li>
                    ))}
                </ul>
                <br/>
                <button onClick={handleDoctorAdd}>Ajouter un médecin</button>
            </section>

            <section>
                <h2>Dossiers</h2>
                <ul>
                    {folders.map((folder, index) => (
                        <li key={index}>
                            {folder.originalName}
                            <button onClick={() => handleRecordAccess(folder)}>Consulter</button>
                            <button onClick={() => handleRecordDelete(folder)}>Supprimer</button>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Requests</h2>
                <ul>
                    {requests.map((request, index) => (
                        <li key={index}>
                            {request.type + " venant de " + request.originName}
                            <button onClick={() => handleRequestAccept(request)}>Accepter</button>
                            <button onClick={() => handleRequestRefuse(request)}>Refuser</button>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>private Key</h2>
                <input id={"file_p12"} type="file" onChange={handleKeyChange} />
                {file && <p>{file.name}</p>}
            </section>
            <section>
                <h2>Upload</h2>
                <input id="file" type="file" onChange={handleFileUpload}/>
                {file && <p>{file.name}</p>}
                <button onClick={handleFileSubmit}>Soumettre</button>
            </section>

        </div>
    );
};

export default PatientPage;
