import React, { useState } from 'react';

const Connexion = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleConnexionClick = () => {
        // Vérification du format de l'adresse e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Veuillez entrer une adresse e-mail valide.\n \
            Format attendu : exemple@exemple.exe\n \
            Format reçu : ' + email);
            return;
        }

        // Vérification du format du mot de passe
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
            alert(
                'Veuillez entrer un mot de passe d\'au moins 8 caractères, comprenant au moins une lettre minuscule, une lettre majuscule et un chiffre.'
            );
            return;
        }

        // TODO : envoyer les données au serveur
        console.log('Email:', email);
        console.log('Mot de passe:', password);


    };

    return (
        <div>
            <h2 className="title is-2">Connexion :</h2>

            <div className="field">
                <label className="label">Email</label>
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
                <label className="label">Mot de passe</label>
                <div className="control">
                    <input
                        className="input form-field"
                        type="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <button onClick={handleConnexionClick}>Connexion</button>
        </div>
    );
};

export default Connexion;
