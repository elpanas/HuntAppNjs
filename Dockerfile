FROM node:12.18-alpine
ENV NODE_ENV=production DB_LOC_URI="mongodb://host.docker.internal:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
