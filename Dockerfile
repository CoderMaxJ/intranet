FROM node:22.13-bookworm-slim

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install 
#--include=dev
# ENV NODE_ENV=production

COPY . .

RUN npm run build

EXPOSE 3000


CMD ["npm","run", "start"]
