FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --quiet
#cpier 
COPY . .

# Variables d'environnement
ENV NODE_ENV=development
ENV PORT=3000
EXPOSE 3000

USER node

CMD ["node", "app.js"]
