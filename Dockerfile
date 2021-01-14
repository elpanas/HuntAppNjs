FROM node:12.18-alpine

ENV NODE_ENV=production \
    MONGODB_URI="mongodb://admin:password@mongodb:27017"

RUN mkdir -p /home/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install

COPY . /home/app

EXPOSE 3000

CMD ["node", "/home/app/server.js"]