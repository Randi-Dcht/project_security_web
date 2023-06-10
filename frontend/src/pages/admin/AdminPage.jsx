import React, { useEffect, useState } from 'react';
import '../../styles/DoctorPage.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:1026/users/list', {
          method: 'GET',
          credentials: 'include'
        });
        
        const data = await response.json();

        if (data) {
          setUsers(data);
        }

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
    console.log(`Approuver ${user.name}`);
  };

  const handleDeleteUser = async (user) => {
    const response = await fetch('https://localhost:1026/users/delete/' + user.uuid, {
            method: 'DELETE',
            credentials: 'include'
        });
    console.log(`Supprimer ${user.name}`);
    window.location.reload();
  };

  return (
    <div className="doctor-page">
      <h1>Page de l'Admin</h1>
      <button className="red_btn" onClick={handleSecurityUpdate}>Modifier la sécurité</button>
      <section>
        <h2>Tous les utilisateurs</h2>
        <ul>
          {users.map((user, index) => (
            <li key={user.uuid}>
              {user.name} <button onClick={() => handleDeleteUser(user)}>Supprimer</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPage;
