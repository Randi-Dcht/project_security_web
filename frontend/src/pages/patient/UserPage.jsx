import React, { useState } from "react";
import '../../styles/UserPage.css'; // un fichier CSS pour styliser notre composant

const UserPage = () => {
  const [doctors, setDoctors] = useState(["Dr. Smith", "Dr. Johnson"]);
  const [records, setRecords] = useState(["Record 1", "Record 2"]);
  const [file, setFile] = useState(null);

  const handleDoctorAdd = () => {
    // TODO : logique pour ajouter un médecin
  };

  const handleDoctorDelete = () => {
    // TODO : logique pour supprimer un médecin
  };

  const handleRecordAccess = () => {
    // TODO : logique pour accéder à un dossier
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileSubmit = () => {
    // TODO : logique pour soumettre le fichier
  };

  return (
    <div className="user-page">
      <section>
        <h2>Médecins</h2>
        <ul>
          {doctors.map((doctor, index) => (
            <li key={index}>
              {doctor}
              <button onClick={handleDoctorDelete}>Supprimer</button>
            </li>
          ))}
        </ul>
        <button onClick={handleDoctorAdd}>Ajouter un médecin</button>
      </section>

      <section>
        <h2>Dossiers</h2>
        <ul>
          {records.map((record, index) => (
            <li key={index}>
              {record}
              <button onClick={handleRecordAccess}>Consulter</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Upload</h2>
        <input type="file" onChange={handleFileUpload} />
        {file && <p>{file.name}</p>}
        <button onClick={handleFileSubmit}>Soumettre</button>
      </section>
    </div>
  );
};

export default UserPage;
