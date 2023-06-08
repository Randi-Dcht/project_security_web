import React, { useState, useRef } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Field.css';
import forge from 'node-forge';

const Signup = () =>
{
    const [selectedDate, setSelectedDate] = useState('');
    const [registerNumber, setRegisterNumber] = useState('');
    const registerNumberRef = useRef('');

    const registerClick = async () => {
        // Vérification du format de l'adresse e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Veuillez entrer une adresse e-mail valide.');
            return;
        }
    
        // Vérification du format du mot de passe
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
            console.log(
                'Veuillez entrer un mot de passe d\'au moins 8 caractères, comprenant au moins une lettre minuscule, une lettre majuscule et un chiffre.'
            );
            return;
        }
    
        // Vérification de la confirmation du mot de passe
        if (confirmPassword !== password) {
            console.log('La confirmation du mot de passe ne correspond pas.');
            return;
        }
    
        // Vérification du format du nom
        const nameRegex = /^[a-zA-Z\s]*$/;
        if (!nameRegex.test(lastName) || !nameRegex.test(firstName)) {
            console.log('Veuillez entrer des valeurs valides pour le nom et le prénom (lettres et espaces uniquement).');
            return;
        }
    
        // Vérification de la date de naissance
        if (!selectedDate) {
            console.log('Veuillez sélectionner une date de naissance.');
            return;
        }
    
        // Vérification du format du numéro de registre national
        const registerNumberRegex = /^\d{2}\.\d{2}\.\d{2}-\d{3}\.\d{2}$/;
        if (!registerNumberRegex.test(registerNumber)) {
            console.log('Veuillez entrer un numéro de registre national valide (ex: 00.00.00-000.00).');
            return;
        }
    
        // TODO : hash du mot de passe ??

        // Générer une paire de clés
        const keys = forge.pki.rsa.generateKeyPair(2048);

        // Créer le certificat X.509
        const cert = forge.pki.createCertificate();
        cert.publicKey = keys.publicKey;
        cert.serialNumber = '01';
        cert.validity.notBefore = new Date();
        cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
        const attrs = [{
            name: 'commonMail',
            value: email
        }, {
            name: 'commonName',
            value: lastName
        }];
        cert.setSubject(attrs);
        cert.setIssuer(attrs);

        // Signer le certificat
        cert.sign(keys.privateKey);

        // Convertir le certificat en format PEM
        const certPem = forge.pki.certificateToPem(cert);

        // Convertir le certificat PEM en ArrayBuffer
        const certArrayBuffer = new TextEncoder().encode(certPem);

        // Préparez le corps de la requête (vu que le serveur attend un fichier)
        const body = new FormData();
        body.append('file', new Blob([certArrayBuffer]), 'client.csr');

        // Envoyer le certificat au serveur
        const response = await fetch('https://localhost:1026/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream'
            },
            body: body
        });

        if (response.ok) {
            console.log('Inscription réussie !');
        } else {
            console.error('Erreur lors de l\'inscription:', response.statusText);
        }
    };
    

    const handleRegisterNumberChange = (event) => {
        const input = event.target.value;
        const cleanedInput = input.replace(/\D/g, '');
        
        // Formatter l'entrée pour correspondre au format XX.XX.XX-XXX.XX
        let formattedInput = cleanedInput.slice(0, 2);
        if (cleanedInput.length > 2) {
            formattedInput += '.' + cleanedInput.slice(2, 4);
        }
        if (cleanedInput.length > 4) {
            formattedInput += '.' + cleanedInput.slice(4, 6);
        }
        if (cleanedInput.length > 6) {
            formattedInput += '-' + cleanedInput.slice(6, 9);
        }
        if (cleanedInput.length > 9) {
            formattedInput += '.' + cleanedInput.slice(9, 11);
        }

        // Changer la date de naissance en fonction du numéro de registre national
        console.log(cleanedInput.length);
        if (cleanedInput.length === 6) {
            // Récupérer l'année sous la forme YYYY (ex: 90 => 1990)
            const year = cleanedInput.substr(0, 2);
            // Récupérer le mois (ex: 01 => 1)
            const month = cleanedInput.substr(2, 2).replace(/^0+/, '');
            // Récupérer le jour (ex: 01 => 1)
            const day = cleanedInput.substr(4, 2).replace(/^0+/, '');
            // Vérifier que le mois et le jour sont valides
            if (month < 1 || month > 12 || day < 1 || day > 31) {
                return;
            }
            const date = new Date(2000 + parseInt(year), month - 1, day);
            // Vérifier que la date est valide (antérieur à aujourd'hui)
            if (date > new Date()) {
                return;
            }
            setSelectedDate(date);
        }
        setRegisterNumber(formattedInput);
    };
    
    
      
      
      

      const handleDateChange = (date) => {
        setSelectedDate(date);
        
        // Modifier le numéro de registre national en fonction de la date de naissance
        if (date) {
            // Récupérer l'année sous la forme YY (ex: 1990 => 90)
            const year = date.getFullYear().toString().substr(-2);
            // Récupérer le mois (ex: 1 => 01)
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            // Récupérer le jour (ex: 1 => 01)
            const day = date.getDate().toString().padStart(2, '0');
            const registerNumber = `${day}.${month}.${year}`;
            setRegisterNumber(registerNumber);
        }
    };

    const handleRegisterNumberClick = () => {
        // Vérifier que la date de naissance est bien définie
        if (!selectedDate) {
            return;
        }
        // Positionner le curseur après le jour, le mois et l'année
        if (registerNumberRef.current) {
            // Chercher le premier 0 après le jour, le mois et l'année
            const rest = registerNumberRef.current.value.substr(9);
            const position = rest.search(/0/);
            // Positionner le curseur après le jour, le mois et l'année
            registerNumberRef.current.setSelectionRange(position + 9, position + 9);
        }
      };
      

    return(
        <div>
            <h2 className="title is-2">Inscription :</h2>

            <div className="field">
                <label className="label">Email</label>
                <div className="control">
                    <input className="input form-field" type="email" placeholder="e.g. alexsmith@gmail.com"/>
                </div>
            </div>

            <div className="field">
                <label className="label">Mot de passe</label>
                <div className="control">
                    <input className="input form-field" type="password" placeholder="********"/>
                </div>
            </div>

            <div className="field">
                <label className="label">Confirmer le mot de passe</label>
                <div className="control">
                    <input className="input form-field" type="password" placeholder="********"/>
                </div>
            </div>

            <div className="field">
                <label className="label">Nom</label>
                <div className="control">
                    <input className="input form-field" type="text" placeholder="e.g. Smith"/>
                </div>
            </div>

            <div className="field">
                <label className="label">Prénom</label>
                <div className="control">
                    <input className="input form-field" type="text" placeholder="e.g. Alex"/>
                </div>
            </div>

            <label htmlFor="datePicker" className="label"> Date de naissance</label>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                className="form-field"
            />


            <div className="field">
                <label className="label">Numéro de registre national</label>
                <div className="control">
                <input
                    className="input form-field"
                    type="text"
                    placeholder="e.g. 00.00.00-000.00"
                    value={registerNumber}
                    onChange={handleRegisterNumberChange}
                    ref={registerNumberRef}
                    onClick={handleRegisterNumberClick}
                    maxLength="14" // Limiter la longueur de l'entrée à 14 caractères (11 chiffres + 3 séparateurs)
                />
                </div>
            </div>

            <div className="field">
                <label className="label">
                    Votre rôle
                </label>
                <div className='select'>
                    <select>
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