FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
EXPOSE 3002
CMD ["npm","start"]