import React, { useState } from "react";
import CryptoJS from 'crypto-js';
import '../../styles/UserPage.css'; // un fichier CSS pour styliser notre composant

const UserPage = () => {
  const [doctors, setDoctors] = useState(["Dr. Smith", "Dr. Johnson"]);
  const [records, setRecords] = useState(["Record 1", "Record 2"]);
  const [file, setFile] = useState(null);

  const handleUserUpdate = () => {
    // TODO : logique pour modifier les informations de l'utilisateur
  };
  const handleSecurityUpdate = () => {
      // TODO : logique pour modifier les informations lié à la sécurité de l'utilisateur
  };
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

    const reader = new FileReader();
    reader.onload = () => {
      const key = "testkey0123";
      const wordArray = CryptoJS.lib.WordArray.create(reader.result);           // Convert: ArrayBuffer -> WordArray
      const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();        // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)

      const fileEnc = new Blob([encrypted]);                                    // Create blob from string

      const a = document.createElement("a");
      const url = window.URL.createObjectURL(fileEnc);
      const filename = "a" + ".enc";
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    };
    reader.readAsArrayBuffer(document.querySelector('input').files[0]);

  };

  return (
    <div className="user-page">
      <section>
        <h2>Mes informations</h2>
        <br />
        <button onClick={handleUserUpdate}>Modifier mes informations</button>
        <button className="red_btn" onClick={handleSecurityUpdate}>Modifier la sécurité</button>
      </section>
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
        <br />
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
