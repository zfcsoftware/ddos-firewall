FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g pm2
COPY . .
EXPOSE 80
CMD ["pm2-runtime", "ecosystem.config.js"]