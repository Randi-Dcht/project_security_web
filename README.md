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