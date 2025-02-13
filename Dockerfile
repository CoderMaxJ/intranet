FROM node:22.13-bookworm-slim


WORKDIR /app

RUN  mkdir -p src public

COPY package*.json ./


RUN npm install


COPY . .


EXPOSE 3000


CMD ["npm", "run", "dev"]
