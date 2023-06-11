import React, {useEffect, useState} from 'react';
import '../../styles/AdminPage.css';
import {useNavigate} from "react-router-dom";

const AdminPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:1026/users/list', {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();

                console.log(data);

                if (data) {
                    let tempUsers = [];
                    let tempAdmins = [];
                    let tempDoctors = [];
                    let tempPatients = [];

                    for (let i = 0; i < data.length; i++) {
                        if (data[i].roles.includes('ROLE_PATIENT')) {
                            tempPatients.push(data[i]);
                        } else if (data[i].roles.includes('ROLE_ADMIN')) {
                            tempAdmins.push(data[i]);
                        } else if (data[i].roles.includes('ROLE_DOCTOR')) {
                            tempDoctors.push(data[i]);
                        } else {
                            tempUsers.push(data[i]);
                        }
                    }

                    setUsers(tempUsers);
                    setAdmins(tempAdmins);
                    setDoctors(tempDoctors);
                    setPatients(tempPatients);
                }

            } catch (error) {
                console.error('Erreur lors de la requête HTTPS:', error);
                navigate("/error")
            }
        };

        fetchData();
    }, []);

    const handleApproveAdmin = async (user) => {
        // Approuver l'admin
        const response = await fetch('https://localhost:1026/users/makeAdmin/' + user.uuid, {
            method: 'POST',
            credentials: 'include'
        });
        console.log(`Approuver en tant qu'admin ${user.name}`);
        window.location.reload();
    };

    const handleRemoveDoctorRole = async (user) => {
        // suppimer le rôle de docteur à l'utilisateur
        const response = await fetch('https://localhost:1026/users/unmakeDoctor/' + user.uuid, {
            method: 'DELETE',
            credentials: 'include'
        });
        console.log(`Supprimer le rôle de docteur à ${user.name}`);
        window.location.reload();
    };

    const handleGiveDoctorRole = async (user) => {
        // donner le rôle de docteur à l'utilisateur
        const response = await fetch('https://localhost:1026/users/makeDoctor/' + user.uuid, {
            method: 'POST',
            credentials: 'include'
        });
        console.log(`Donner le rôle de docteur à ${user.name}`);
        window.location.reload();
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
        <div className="admin-page">
            <h1>Page de l'Admin</h1>
            <section>
                <h2>Utilisateurs à valider</h2>
                <ul>
                    {users.map((user, index) => (
                        <li key={user.uuid}>
                            {user.name}
                            <button onClick={() => handleDeleteUser(user)}>Supprimer</button>
                            <button onClick={() => handleGiveDoctorRole(user)}>Donner le rôle de docteur</button>
                            <button onClick={() => handleApproveAdmin(user)}>Donner le rôle administrateur</button>
                        </li>
                    ))}
                </ul>
                <hr/>
                <h2>Tous les patients</h2>
                <ul>
                    {patients.map((user, index) => (
                        <li key={user.uuid}>
                            {user.name}
                            <button onClick={() => handleDeleteUser(user)}>Supprimer</button>
                        </li>
                    ))}
                </ul>
                <hr/>
                <h2>Tous les admins</h2>
                <ul>
                    {admins.map((user, index) => (
                        <li key={user.uuid}>
                            {user.name}
                            <button onClick={() => handleDeleteUser(user)}>Supprimer</button>
                        </li>
                    ))}
                </ul>
                <hr/>
                <h2>Tous les docteurs</h2>
                <ul>
                    {doctors.map((user, index) => (
                        <li key={user.uuid}>
                            {user.name}
                            <button onClick={() => handleDeleteUser(user)}>Supprimer</button>
                            <button onClick={() => handleRemoveDoctorRole(user)}>Supprimer le rôle de docteur</button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default AdminPage;
