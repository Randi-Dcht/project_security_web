#!/bin/sh
###########

while true
do
 inotifywait -e create -e modify -e delete -e move /var/www/symfony/cert/crl/crl.pem
 nginx -t
 if [ $? -eq 0 ]
 then
   echo "reload nginx"
  nginx -s reload
 fi
done