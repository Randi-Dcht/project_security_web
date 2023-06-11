import React, {useState} from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Field.css';
import forge from 'node-forge';

const Signup = () => {

    const [email, setEmail] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [role, setRole] = useState('patient');

    const registerClick = async () => {
        // Vérification du format de l'adresse e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Veuillez entrer une adresse e-mail valide.');
            return;
        }


        // Vérification du format du nom
        const nameRegex = /^[a-zA-Z\s]*$/;
        if (!nameRegex.test(lastName) || !nameRegex.test(firstName)) {
            console.log('Veuillez entrer des valeurs valides pour le nom et le prénom (lettres et espaces uniquement).');
            return;
        }

        // Générer une paire de clés
        const keys = forge.pki.rsa.generateKeyPair(2048);

        // Créer le certificat X.509
        const csr = forge.pki.createCertificationRequest();
        csr.publicKey = keys.publicKey;
        csr.setSubject([{
            name: 'emailAddress',
            value: email
        }, {
            name: 'commonName',
            value: lastName + firstName
        }]);

        // Signer le certificat
        csr.sign(keys.privateKey);

        // verify certification request
        try {
            if (csr.verify()) {
                console.log('Certification request (CSR) verified.');
            } else {
                throw new Error('Signature not verified.');
            }
        } catch (err) {
            console.log('Certification request (CSR) verification failure: ' +
                JSON.stringify(err, null, 2));
        }

        // convert certification request to PEM-format
        const pem = forge.pki.certificationRequestToPem(csr);
        console.log(pem);

        // Préparez le corps de la requête (vu que le serveur attend un fichier)
        // const body = new FormData();
        // body.append('file', new Blob([csr]), 'client.csr');

        let url = 'https://localhost:1026/registerP';
        if (role !== "patient") {
            url = 'https://localhost:1026/registerAD'
        }
        // Envoyer le certificat au serveur
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
            },
            body: pem
        });

        if (response.ok) {
            console.log('Inscription réussie !');
            let crt = await response.text();
            console.log(crt);

            // generate a p12 that can be imported by Chrome/Firefox/iOS
            // (requires the use of Triple DES instead of AES)
            const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
                keys.privateKey, crt, '',
                //{algorithm: '3des'}
            );

            // base64-encode p12
            const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
            const p12b64 = forge.util.encode64(p12Der);


            // create download link for p12
            const link = document.createElement('a');
            link.setAttribute('href', 'data:application/x-pkcs12;base64,' + p12b64);
            link.setAttribute("download", "your_identity.p12");
            // Append to html link element page
            document.body.appendChild(link);
            // Start download
            link.click();
            // Clean up and remove the link
            link.parentNode.removeChild(link);

        } else {
            console.error('Erreur lors de l\'inscription:', response.statusText);
        }
    };


    return (
        <div>
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

// const handleRegisterNumberChange = (event) => {
//     const input = event.target.value;
//     const cleanedInput = input.replace(/\D/g, '');
//
//     // Formatter l'entrée pour correspondre au format XX.XX.XX-XXX.XX
//     let formattedInput = cleanedInput.slice(0, 2);
//     if (cleanedInput.length > 2) {
//         formattedInput += '.' + cleanedInput.slice(2, 4);
//     }
//     if (cleanedInput.length > 4) {
//         formattedInput += '.' + cleanedInput.slice(4, 6);
//     }
//     if (cleanedInput.length > 6) {
//         formattedInput += '-' + cleanedInput.slice(6, 9);
//     }
//     if (cleanedInput.length > 9) {
//         formattedInput += '.' + cleanedInput.slice(9, 11);
//     }
//
//     // Changer la date de naissance en fonction du numéro de registre national
//     console.log(cleanedInput.length);
//     if (cleanedInput.length === 6) {
//         // Récupérer l'année sous la forme YYYY (ex: 90 => 1990)
//         const year = cleanedInput.substr(0, 2);
//         // Récupérer le mois (ex: 01 => 1)
//         const month = cleanedInput.substr(2, 2).replace(/^0+/, '');
//         // Récupérer le jour (ex: 01 => 1)
//         const day = cleanedInput.substr(4, 2).replace(/^0+/, '');
//         // Vérifier que le mois et le jour sont valides
//         if (month < 1 || month > 12 || day < 1 || day > 31) {
//             return;
//         }
//         const date = new Date(2000 + parseInt(year), month - 1, day);
//         // Vérifier que la date est valide (antérieur à aujourd'hui)
//         if (date > new Date()) {
//             return;
//         }
//         setSelectedDate(date);
//     }
//     setRegisterNumber(formattedInput);
// };
//
//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//
//     // Modifier le numéro de registre national en fonction de la date de naissance
//     if (date) {
//         // Récupérer l'année sous la forme YY (ex: 1990 => 90)
//         const year = date.getFullYear().toString().substr(-2);
//         // Récupérer le mois (ex: 1 => 01)
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         // Récupérer le jour (ex: 1 => 01)
//         const day = date.getDate().toString().padStart(2, '0');
//         const registerNumber = `${day}.${month}.${year}`;
//         setRegisterNumber(registerNumber);
//     }
// };
//
// const handleRegisterNumberClick = () => {
//     // Vérifier que la date de naissance est bien définie
//     if (!selectedDate) {
//         return;
//     }
//     // Positionner le curseur après le jour, le mois et l'année
//     if (registerNumberRef.current) {
//         // Chercher le premier 0 après le jour, le mois et l'année
//         const rest = registerNumberRef.current.value.substr(9);
//         const position = rest.search(/0/);
//         // Positionner le curseur après le jour, le mois et l'année
//         registerNumberRef.current.setSelectionRange(position + 9, position + 9);
//     }
//   };


export default Signup;