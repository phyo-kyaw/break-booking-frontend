# stage 1
FROM node:14-alpine as node
WORKDIR /app

COPY package.json .
RUN rm -rf node_modules package-lock.json
RUN npm install --silent
COPY . .
RUN npm run build

# stage 2
FROM nginx:alpine
## Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY --from=node /app/dist/agl-calendar /usr/share/nginx/html

#COPY ./ssl/ /etc/nginx/ssl/

#RUN ls -laR /etc/nginx/ssl/*

COPY ./nginx_local.conf /etc/nginx/conf.d/default.conf

COPY ./run.sh /run.sh

VOLUME /tmp

ENTRYPOINT ["sh", "run.sh"]
