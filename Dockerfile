FROM node:12.18-alpine
ENV NODE_ENV production
RUN mkdir -p /home/app
RUN apt-get update && apt-get -y install curl && apt-get install -y libgif7
WORKDIR /home/app
COPY package*.json ./
RUN npm ci --only=production
COPY . /home/app
EXPOSE 3000
CMD ["node", "/home/app/server.js"]
USER node