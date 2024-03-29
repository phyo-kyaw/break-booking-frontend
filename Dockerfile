# stage 1
FROM node:16-alpine as node
WORKDIR /app

COPY package.json .
RUN rm -rf node_modules package-lock.json
RUN npm install --quiet
COPY . .
RUN npm run build
RUN ls -l ./
RUN pwd

# stage 2
FROM nginx:alpine
## Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY --from=node /app/dist/agl-calendar /usr/share/nginx/html

#COPY ./ssl/ /etc/nginx/ssl/

RUN mkdir /etc/nginx/ssl

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY ./run.sh /run.sh

VOLUME /tmp

ENTRYPOINT ["sh", "run.sh"]
