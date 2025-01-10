# Utiliser l'image de base officielle Node.js avec Alpine Linux
FROM node:lts-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /src

# Copier les fichiers package.json et package-lock.json (si présent)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du serveur dans le conteneur
COPY . .

# Exposer le port 9000 pour accéder à l'application
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
