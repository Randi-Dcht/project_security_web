# cybersecurity project

## Name and UMONS ID of each group members

As discussed in class, this repository own the projects for 5 students (3 presentation groups)
due to 11/6 (submit via git)

## How to build the project :
(we recommend here to either provide a makefile,
or a shell script to install missing dependencies, compile the project and run relevant
scripts)

## Report

> The report is available using `cd report` from the root of this archive.
> Find there the security_project.pdf and the related type script source
> Thanks

## How to use the project :

### Frontend :

>  The frontend part is available using `cd frontend` from the root of this archive.
> 
>  
>
> 1. Install [Node Package Manager](https://www.npmjs.com/) 
>
> 2. Run the frontend: 
> 
>   `npm install` 
>
>   `npm run dev` 
>

### Backend :

>  The backend part is available using `cd backend` from the root of this archive.
> 
> 1. Install docker or podman :
> 
>   https://docs.docker.com/
>   https://podman.io/
> 
> 2. Launch the backend :
> 
>   `docker compose up -d`
>   
>   In the php container run `./setup.sh`
> 
>   In the nginx container run ` /usr/local/bin/nginxReloader.sh`
>   
> 3. Troubleshooting
>
>   If you can't connect to the Docker daemon socket, run :
> 
>   `sudo setfacl --modify user:[your_username]:rw /var/run/docker.sock`
> 
>   By default, docker will use :
> 
>   - port 1026 for php symphony (symfony_dockerized-php-1)
>   - port 3306 for mariadb (symfony_dockerized-db-1)
> 
>   verify using `sudo netstat -nlpt` if those ports are free, 
> 
>   if not you can use `sudo service [service using a needed port] stop` to free port 3306
