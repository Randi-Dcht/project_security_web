import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import forge from 'node-forge';

const Connexion = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleConnexionClick = () => {

        const { publicKey, privateKey } = forge.pki.rsa.generateKeyPair(2048);

        const message = email;

        const encrypted = publicKey.encrypt(message, 'RSA-OAEP');

        console.log(encrypted);
        //change the input field text to the encrypted text

        document.getElementById('input').value = encrypted;

        const decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP');

        console.log(decrypted);

        document.getElementById('output').value = decrypted;
    };

    return (
        <div>
            <h2 className="title is-2">Connexion :</h2>

            <div className="field">
                <label className="label">Message</label>
                <div className="control">
                    <input
                        className="input form-field"
                        type="email"
                        placeholder="e.g. alexsmith@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div className="field">
                <label className="label">Chiffre</label>
                <div className="control">
                    <input
                        className="input form-field"
                        type="email"
                        id="input"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <div className="field">
                <label className="label">Dechiffre</label>
                <div className="control">
                    <input
                        className="input form-field"
                        type="email"
                        id="output"
                    />
                </div>
            </div>


            <button onClick={handleConnexionClick}>Connexion</button>
        </div>
    );
};

export default Connexion;
