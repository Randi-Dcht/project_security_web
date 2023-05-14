import React, { useState } from 'react';

const AdminPage = () => {
  const [users, setUsers] = useState(['User 1', 'User 2', 'User 3']);

  const handleApproveUser = (user) => {
    // Approuver l'utilisateur
    console.log(`Approuver ${user}`);
  };

  const handleDeleteUser = (user) => {
    // Supprimer l'utilisateur
    console.log(`Supprimer ${user}`);
  };

  return (
    <div>
      <h1>Page de l'Admin</h1>

      <h2>Tous les utilisateurs</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user} <button onClick={() => handleApproveUser(user)}>Approuver</button> <button onClick={() => handleDeleteUser(user)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
