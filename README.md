# cybersecurity project

## Run project :

### Frontend :

> cd frontend
> 
> npm install
> 
> npm run dev

### Backend :

> cd backend/
> composer install
> symfony server:start

### Init db :

> php bin/console doctrine:database:create
> php bin/console make:migration
> php bin/console doctrine:migrations:migrate


### for check security in backend:

> symfony check:security

