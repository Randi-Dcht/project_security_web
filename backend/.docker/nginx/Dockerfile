FROM nginx:1.25.0-alpine

COPY nginx.conf  /etc/nginx/
COPY templates /etc/nginx/templates/
RUN echo "upstream php-upstream { server php:9000; }" > /etc/nginx/conf.d/upstream.conf

#EXPOSE 80
EXPOSE 443

RUN apk add inotify-tools

COPY ./nginxReloader.sh /usr/local/bin/nginxReloader.sh

RUN chmod +x /usr/local/bin/nginxReloader.sh
