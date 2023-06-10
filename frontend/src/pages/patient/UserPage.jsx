import React, { useState } from "react";
import CryptoJS from 'crypto-js';
import '../../styles/UserPage.css'; // un fichier CSS pour styliser notre composant

const UserPage = () => {
  const [doctors, setDoctors] = useState(["Dr. Smith", "Dr. Johnson"]);
  const [records, setRecords] = useState(["Record 1", "Record 2"]);
  const [file, setFile] = useState(null);
  const [cryptFile, setCryptFile] = useState(null);

  function CryptJsWordArrayToUint8Array(wordArray) {
    const l = wordArray.sigBytes;
    const words = wordArray.words;
    const result = new Uint8Array(l);
    var i=0 /*dst*/, j=0 /*src*/;
    while(true) {
      // here i is a multiple of 4
      if (i==l)
        break;
      var w = words[j++];
      result[i++] = (w & 0xff000000) >>> 24;
      if (i==l)
        break;
      result[i++] = (w & 0x00ff0000) >>> 16;
      if (i==l)
        break;
      result[i++] = (w & 0x0000ff00) >>> 8;
      if (i==l)
        break;
      result[i++] = (w & 0x000000ff);
    }
    return result;
  }

  const characters ='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  function randomString() {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < 20; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  const encryptText = (text, secretKey) => {
    const encryptedText = CryptoJS.AES.encrypt(text, secretKey).toString();
    return encryptedText;
  }

  const decryptText = (encryptedText, secretKey) => {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  }

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

    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const passphrase = randomString();
    const key = CryptoJS.PBKDF2(passphrase, salt, {
      keySize: 128 / 32
    });

    const reader = new FileReader();
    reader.onload = () => {

      const wordArray = CryptoJS.lib.WordArray.create(reader.result);           // Convert: ArrayBuffer -> WordArray
      const encrypted = CryptoJS.AES.encrypt(wordArray, key.toString()).toString();        // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)

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

    const cryptFileName = encryptText(file.name.substr(0,file.name.length - 4),key.toString());

    localStorage.setItem("key", key.toString());
  };

  const handleDecryptSubmit = (event) =>{
    setCryptFile(event.target.files[0]);
  }

  const handleDecryptFile = () =>{
    const key = localStorage.getItem("key");
    const reader = new FileReader();
    reader.onload = () => {

      const decrypted = CryptoJS.AES.decrypt(reader.result, key);               // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
      const typedArray = CryptJsWordArrayToUint8Array(decrypted);               // Convert: WordArray -> typed array

      const fileDec = new Blob([typedArray]);                                   // Create blob from typed array

      const a = document.createElement("a");
      const url = window.URL.createObjectURL(fileDec);
      const filename = file.name.substr(0, file.name.length - 4) + ".pdf";
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    };
    reader.readAsText(document.getElementById('file2').files[0]);

  }

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
      <section>
        <h2>Décrypter</h2>
        <input type="file" id={"file2"} onChange={handleDecryptSubmit} />
        {cryptFile && <p>{cryptFile.name}</p>}
        <button onClick={handleDecryptFile}>Déchiffrer</button>
      </section>

    </div>
  );
};

export default UserPage;
