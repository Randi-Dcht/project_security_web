# cybersecurity project

## Name and UMONS ID of each group members

As discussed in class, this repository own the projects for 5 students (3 presentation groups)
due to 11/6 (submit via git)

### Group 1
- Alessandro Spinosi [200215]

### Group 2
- Guillaume Kerckhofs [191963]
- Samain Clément [200512]

### Group 3
- Randy Dochot [190134]
- Alix Declerck [192774]

## How to build the project :
(we recommend here to either provide a makefile,
or a shell script to install missing dependencies, compile the project and run relevant
scripts)

## How to use the project :

### Frontend :

>  The frontend part is available using `cd frontend` from the root of this archive.
> 
> To install `Node Package Manager` : 
>
> 1. please visit the distribution repo : https://github.com/nodesource/distributions/tree/master/deb
> 
>   and type `sudo apt install nodejs` on debian like linux distributions
>
> 2. please run : 
> 
>   `npm install` to install npm
> 
>   `npm install --save react-bootstrap-validation` to install bootstrap
> 
>   `npm install --save vite-plugin-mkcert` to install https certificate support
> 
>   `npm run dev` to run npm
>

### Backend :

>  The backend part is available using `cd backend` from the root of this archive.
> 
> 1. Please install docker :
> 
>   https://docs.docker.com/engine/install/
> 
> 2. Please launch the server using :
> 
>   `docker compose up -d`
>   
>   If you can't connect to the Docker daemon socket, please run :
> 
>   `sudo setfacl --modify user:[your_username]:rw /var/run/docker.sock`
> 
>   By default, docker will use :
> 
>   - port 1026 for php symphony (symfony_dockerized-php-1)
>   - port 3306 for mariadb (symfony_dockerized-db-1)
> 
>   please verify using `sudo netstat -nlpt` if those ports are free, 
> 
>   if not you can use `sudo service [service using a needed port] stop` to free port 3306
> 
> _ps. You can follow the instruction in the readme there (you can use Podman or Docker)_

### Init db :

>  php bin/console doctrine:database:create 
>
update
>  php bin/console make:migration 
>
>  php bin/console doctrine:migrations:migrate


### for check security in backend:

> symfony check:security

### TODO list :

## Patient :

- [x] Inscription
- [x] Un patient peut ajouter un médecin à sa liste de médecins nommés
- [x] Un patient peut supprimer un médecin de sa liste de médecins nommés
- [x] Les patients peuvent consulter leurs propres dossiers médicaux
- [x] Les patients peuvent consulter les médecins qui leur sont nommés
- [ ] Personne d'autre n'a accès à ces dossiers médicaux
- [x] Un patient peut soumettre un fichier au serveur pour qu'il fasse partie de son dossier médical
- [x] Un patient peut supprimer un fichier de son dossier médical

## Doctor :

Inscription :
- [x] Inscription en tant qu'utilisateur
- [ ] Validation par l'administrateur

Ajout patient :
- [x] Le médecin peut ajouter un patient à sa liste de patients nommés
- [ ] Le patient doit valider la demande d'ajout

Suppression patient :
- [x] Le médecin peut supprimer un patient de sa liste de patients nommés
- [ ] Le patient doit valider la demande de suppression

Ajout fichier dans dossier médical d'un patient :
- [ ] Le médecin peut ajouter un fichier au dossier médical d'un patient
- [ ] Le patient doit valider la demande d'ajout

Suppression fichier d'un dossier médical d'un patient :
- [ ] Le médecin peut supprimer un fichier du dossier médical d'un patient
- [ ] Le patient doit valider la demande de suppression

## Admin :

Inscription :
- [x] Inscription en tant qu'utilisateur
- [ ] Validation par l'administrateur
- [x] Les administrateurs peuvent également supprimer les utilisateurs.

## System :

- [x] Fournir un mécanisme pour le transférer "en toute sécurité" et vérifier sa propriété. (OK avec les certificats serveurs et utilisateurs)
- [x] Les utilisateurs ont des attributs spécifiques pour leur communication sécurisée avec le serveur, tels que des clés. (OK, clé asymétrique pour le client, clé privée stockée localement, clé publique stockée sur le serveur)
- [x] Un utilisateur peut vérifier l'authenticité du serveur (OK avec le certificat du site). Des informations d'identification doivent être générées pour l'utilisateur (certificat généré à partir de l'adresse e-mail, qui sert d'authentificateur combiné avec la clé privée générée).
- [x] L'utilisateur peut se connecter au système en fournissant ses informations d'identification (OK, il fournit le certificat implicitement)
- [ ] Un utilisateur peut, à tout moment, modifier ses informations d'identification et toute information qu'il utilise pour communiquer en toute sécurité avec le serveur (terminer la page changeInfo)
- [x] Les utilisateurs peuvent se connecter à partir de différents appareils (OK, il suffit de partager le certificat sur les autres appareils)


