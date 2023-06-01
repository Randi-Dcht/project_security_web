import React, { useState } from 'react';
import '../../styles/DoctorPage.css';

const DoctorPage = () => {
  const [patients, setPatients] = useState(['Patient 1', 'Patient 2', 'Patient 3']);
  const [selectedFile, setSelectedFile] = useState(null);

    const handleDoctorUpdate = () => {
        // TODO : logique pour modifier les informations de l'utilisateur
    };
    const handleSecurityUpdate = () => {
        // TODO : logique pour modifier les informations lié à la sécurité de l'utilisateur
    };

  const handlePatientAdd = () => {
    // TODO : logique pour ajouter un patient
  };
  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Envoyer le fichier au serveur
    console.log(selectedFile);
  };

  return (
    <div className="doctor-page">
      <h1>Page du médecin</h1>
        <section>
          <h2>Mes informations</h2>
          <br />
          <button onClick={handleDoctorUpdate}>Modifier mes informations</button>
          <br />
          <button className="red_btn" onClick={handleSecurityUpdate}>Modifier la sécurité</button>
        </section>
        <section>
          <h2>Mes patients</h2>
          <ul>
            {patients.map((patient, index) => (
              <li key={index}>
                {patient} <button>Voir le dossier médical</button> <button>Supprimer</button>
              </li>
            ))}
          </ul>
          <br />
          <button onClick={handlePatientAdd}>Ajouter un patient</button>
        </section>
        <section>

      <h2>Ajouter un fichier à un dossier médical</h2>
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileUpload} />
            <button type="submit">Upload</button>
          </form>
        </section>
    </div>
  );
};

export default DoctorPage;
