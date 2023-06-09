import React, {useEffect, useState } from 'react';
import '../../styles/DoctorPage.css';


const AdminPage = () => {
  const [users, setUsers] = useState(['User 1', 'User 2', 'User 3']);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:1026/users/list', {
            method: 'GET',
            credentials: 'include'
        });

        setData(response.data);
        console.log(await response.text());
      } catch (error) {
        console.error('Erreur lors de la requête HTTPS:', error);
      }
    };

    fetchData();
  }, []);


  const handleSecurityUpdate = () => {
      // TODO : logique pour modifier les informations lié à la sécurité de l'utilisateur
  };
  const handleApproveUser = (user) => {
    // Approuver l'utilisateur
    console.log(`Approuver ${user}`);
  };

  const handleDeleteUser = (user) => {
    // Supprimer l'utilisateur
    console.log(`Supprimer ${user}`);
  };

  return (
    <div className="doctor-page">
      <h1>Page de l'Admin</h1>
        <button className="red_btn" onClick={handleSecurityUpdate}>Modifier la sécurité</button>
        <section>
          <h2>Tous les utilisateurs</h2>
          <ul>
            {users.map((user, index) => (
              <li key={index}>
                {user} <button onClick={() => handleApproveUser(user)}>Approuver</button> <button onClick={() => handleDeleteUser(user)}>Supprimer</button>
              </li>
            ))}
          </ul>
        </section>
    </div>
  );
};

export default AdminPage;
