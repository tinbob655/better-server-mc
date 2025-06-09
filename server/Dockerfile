# server/Dockerfile
FROM node:18
WORKDIR /app
COPY . .
COPY .env .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]
