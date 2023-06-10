#! /bin/sh

cd /var/www/symfony || exit
chown -R root:www-data /var/www/symfony
chmod g+w -R /var/www/symfony
rm migrations/*.php
COMPOSER_ALLOW_SUPERUSER=1  composer install
php bin/console doctrine:database:create
php bin/console make:migration
php bin/console doctrine:migrations:migrate
