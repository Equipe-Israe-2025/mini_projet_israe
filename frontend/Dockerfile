# syntax=docker/dockerfile:1
FROM --platform=$BUILDPLATFORM node:18-alpine AS client-builder
WORKDIR /app

#copier les fichier de dependances pour optimiser le mise en cache
COPY package.json package-lock.json ./
RUN npm ci

#copier le reste du code 
COPY . .

#construire l'application vue.js
RUN npm run build

#Etape de production avec un serveur web léger
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
#copier les fichier de build depuis l'étape précédente
COPY --from=client-builder /app/dist .

#Exposer la porte 80
EXPOSE 80

#démarer Nginx
CMD ["nginx", "-g", "daemon off;"]


