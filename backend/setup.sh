#! /bin/sh

cd /var/www/symfony || exit
COMPOSER_ALLOW_SUPERUSER=1  composer install
php bin/console doctrine:database:create
php bin/console make:migration
php bin/console doctrine:migrations:migrate
