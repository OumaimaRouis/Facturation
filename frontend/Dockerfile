# Utiliser l’image de base node:lts-alpine
FROM node:lts-alpine as build

# Définir le répertoire de travail dans le conteneur
WORKDIR /src

# Copier les fichiers package*.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du client
COPY . .

# Construire l’application React
RUN npm run build


# Installer un serveur HTTP léger (serve)
RUN npm install -g serve


# Exposer le port 3000
EXPOSE 3001

# Démarrer le serveur pour servir les fichiers de build
CMD ["serve", "-s", "build", "-l", "3001"]
