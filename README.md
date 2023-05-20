# cybersecurity project

## Name and UMONS ID of each group members

As discussed in class, this repository own the projects for 5 students (3 presentation groups)
due to 11/6 (submit via git)

### Group 1
- Alessandro

### Group 2
- Guillaume [191963]
- Samain Clément [200512]

### Group 3
- Randy Dochot
- Alix Declerck [192774]

## How to build the project :
(we recommend here to either provide a makefile,
or a shell script to install missing dependencies, compile the project and run relevant
scripts)

## How to use the project :

### Frontend :

>  The frontend part is available using `cd frontend` from the root of this archive.
> 
> To install `Node Package Manager` please run : `npm install`
> 
>  When installed, the command to run npm is : `npm run dev`

### Backend :

>  The backend part is available using `cd backend` from the root of this archive.
> 
>  You can download and install `symphony` here : https://symfony.com/download
> 
>  To install `composer` you have to run : `composer install`
> 
>  To run the server : `symfony server:start`

### Init db :

> php bin/console doctrine:database:create
> php bin/console make:migration
> php bin/console doctrine:migrations:migrate

### for check security in backend:

> symfony check:security
