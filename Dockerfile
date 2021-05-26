# stage 1
FROM node:latest as node



# stage 2
FROM node:alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 4200

CMD /app/node_modules/.bin/ng serve --prod --host 0.0.0.0 --disableHostCheck
