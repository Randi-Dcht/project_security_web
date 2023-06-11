import React from 'react';
import { Button } from 'react-bootstrap';

const ErrorPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Erreur 404/403</h1>
      <p>La page que vous recherchez n'existe pas ou la ressource demandée n'est pas accéssible.</p>
      <Button href="/">Retour à l'accueil</Button>
    </div>
  );
};

export default ErrorPage;
