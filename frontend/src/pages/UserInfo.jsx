import React, { useEffect, useState } from 'react';
import '../styles/DoctorPage.css';

const DoctorPage = () => {
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
  
        console.log(data);
  
        if (data) {
          setName(data.name);
          setLastName(data.lastName);
          setMail(data.email);
        }
  
      } catch (error) {
        console.error('Erreur lors de la requête HTTPS:', error);
        window.location.href = '/error';
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
    if (name !== oldName ) {
      //TODO changer le nom
    }
    if (lastName !== oldLastName) {
      //TODO changer le prenom
    }
    setIsEditing(false);
  };

  return (
    <div className="doctor-page">
      {isEditing ? (
        <div>
          <p>Modification des informations (laisser vide pour ne pas modifier)</p>
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
