# Utiliser une image Node.js légère
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers du projet
COPY package*.json ./

# Installer les dépendances
RUN npm install --only=production

# Copier le reste du code
COPY . .

# Exposer un port (pas nécessaire ici, mais utile si on ajoute une API)
EXPOSE 3000

# Lancer le bot
CMD ["node", "src/bot.js"]
