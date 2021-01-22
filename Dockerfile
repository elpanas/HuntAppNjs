FROM node:latest

ENV NODE_ENV production \
    DB_URI "mongodb+srv://huntluke:game1983@cluster0.ngn3c.mongodb.net/test?authSource=admin&replicaSet=atlas-oqjc10-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"

RUN mkdir -p /home/app

RUN apt-get update && apt-get -y install curl && apt-get install -y libgif7

WORKDIR /home/app

COPY package*.json ./

RUN npm ci --only=production

COPY . /home/app

EXPOSE 3000

CMD ["node", "/home/app/server.js"]