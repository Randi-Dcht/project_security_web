import React, { useState } from 'react';

const DoctorPage = () => {
  const [patients, setPatients] = useState(['Patient 1', 'Patient 2', 'Patient 3']);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Envoyer le fichier au serveur
    console.log(selectedFile);
  };

  return (
    <div>
      <h1>Page du médecin</h1>

      <h2>Mes patients</h2>
      <ul>
        {patients.map((patient, index) => (
          <li key={index}>
            {patient} <button>Voir le dossier médical</button> <button>Supprimer</button>
          </li>
        ))}
      </ul>

      <h2>Ajouter un fichier à un dossier médical</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileUpload} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default DoctorPage;
