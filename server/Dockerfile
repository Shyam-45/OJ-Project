FROM node:20-alpine

WORKDIR /app

RUN apk update && apk add --no-cache g++ python3 && ln -sf python3 /usr/bin/python

COPY . /app

RUN npm install

EXPOSE 5000

CMD ["node", "server.js"]