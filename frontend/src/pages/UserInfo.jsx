import React, { useEffect, useState } from 'react';
import '../styles/DoctorPage.css';

const DoctorPage = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mail, setMail] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = () => {
    // Ici, vous pouvez faire une requête API pour mettre à jour les informations sur le serveur.
    console.log(name, lastName, mail);
    setIsEditing(false);
  };

  return (
    <div className="doctor-page">
      {isEditing ? (
        <div>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nom"/>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Prénom"/>
          <input type="text" value={mail} onChange={e => setMail(e.target.value)} placeholder="Email"/>
          <button onClick={handleSubmit}>Soumettre</button>
        </div>
      ) : (
        <div>
          <p>Nom: {name}</p>
          <p>Prénom: {lastName}</p>
          <p>Email: {mail}</p>
          <button onClick={handleEdit}>Modifier</button>
        </div>
      )}
    </div>
  );
};

export default DoctorPage;
