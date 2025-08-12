
FROM node:18.20.4

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install 

COPY . .


EXPOSE 3000


CMD ["npm","run","dev"]
