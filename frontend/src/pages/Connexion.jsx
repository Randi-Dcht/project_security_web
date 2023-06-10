import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import forge from 'node-forge';

const Connexion = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState(null);
    const [privateKey, setPrivateKey] = useState(null);

    const handleConnexionClick = async () => {


        //const {publicKey, privateKey} = forge.pki.rsa.generateKeyPair(2048);

        const response = await fetch('https://localhost:1026/me', {
            method: 'GET',
            credentials: 'include'

        });


        if (response.ok && privateKey && message) {

            const resp = await response.json();
            //console.log(resp)
            const pem = resp.publicKey;
            console.log(pem)
            const publicKey = forge.pki.publicKeyFromPem(pem);

            const encrypted = publicKey.encrypt(message, 'RSA-OAEP');

            console.log(encrypted);
            //change the input field text to the encrypted text

            document.getElementById('input').value = encrypted;

            const decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP');

            console.log(decrypted);

            document.getElementById('output').value = decrypted;
        }





    };

    const handleKeyTest= () => {
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

            // console.log(privateKey.decrypt(encryptedSecretKey, 'RSA-OAEP',
            //     //{md: forge.md.sha256.create(),}
            // ))

        };

        reader.readAsBinaryString(document.getElementById('file_p12').files[0]);
    }

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
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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

            <section>
                <h2>key test</h2>
                <input id={"file_p12"} type="file" onChange={handleKeyTest} />
                {file && <p>{file.name}</p>}
                <button onClick={handleKeyTest}>Soumettre</button>
            </section>

            <button onClick={handleConnexionClick}>Connexion</button>
        </div>
    );
};

export default Connexion;
