import React, {useEffect,  useState } from 'react';
import '../../styles/DoctorPage.css';

const DoctorPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:1026/doctor/patientsList', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
  
        console.log(data);
  
        if (data) {
          setPatients(data);
        }
  
      } catch (error) {
        console.error('Erreur lors de la requête HTTPS:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleDoctorUpdate = () => {
      const mailInput = prompt('Entrez l\'adresse mail : (laissez vide pour ne pas modifier)');
      const nameInput = prompt('Entrez le nom : (laissez vide pour ne pas modifier)');
      const surnameInput = prompt('Entrez le prénom : (laissez vide pour ne pas modifier)');
      const nameRegex = /^[a-zA-Z\s]*$/;

      //verifier si le mail est vide
      if (mailInput === null) {
        if (nameInput === null) {
          if (surnameInput === null) {
            console.log('Aucune modification.');
            return;
          }
          else {
            if (!nameRegex.test(surnameInput)) {
              console.log('Veuillez entrer des valeurs valides pour le prénom (lettres et espaces uniquement).');
              return;
            }
            //TODO : logique pour modifier le prénom
          }
        }
        else {
          if (surnameInput === null) {
            if (!nameRegex.test(nameInput)) {
              console.log('Veuillez entrer des valeurs valides pour le nom (lettres et espaces uniquement).');
              return;
            }
            //TODO : logique pour modifier le nom
          }
          else {
            if (!nameRegex.test(nameInput) || !nameRegex.test(surnameInput)) {
              console.log('Veuillez entrer des valeurs valides pour le nom et le prénom (lettres et espaces uniquement).');
              return;
            }
            //TODO : logique pour modifier le nom et le prénom
          }

        }
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(mailInput)) {
            console.log('Veuillez entrer une adresse e-mail valide.');
            return;
        }
      const verif = prompt('Entrez votre de nouveau votre adresse mail :');
      if (verif !== mailInput) {
        console.log('Les adresses mail ne correspondent pas.');
        return;
      }

      // TODO : logique pour modifier l'adresse mail et le certificat
    };

  const handlePatientAdd = async (user) => {
    const userInput = prompt('Entrez l\'adresse mail :');
    const response = await fetch('https://localhost:1026/requests/patient/' + userInput, {
            method: 'POST',
            credentials: 'include'
        });
  };

  const handleFileUpload = (event) => {
    // Afficher le fichier d'un patient
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Envoyer la demande au patient de modifier un fichier
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
        </section>
        <section>
          <h2>Mes patients</h2>
          <ul>
            {patients.map((patient, index) => (
              <li key={index}>
                {patient.name} <button>Voir le dossier médical</button> <button>Supprimer</button>
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
