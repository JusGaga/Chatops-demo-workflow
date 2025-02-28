require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Initialisation du bot avec les intents nécessaires
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Pour fonctionner dans les serveurs
        GatewayIntentBits.GuildMessages, // Pour lire les messages
        GatewayIntentBits.MessageContent // Pour accéder au contenu des messages
    ]
});

// Récupération des variables d'environnement
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = "jusgaga/chatops-demo-workflow"; // Remplace par ton repo exact

// Mapping des noms de workflows vers leurs IDs GitHub
const workflowIds = {
    "build-and-test.yml": "146922353", // ID récupéré via l'API GitHub
};

// Fonction de log pour mieux déboguer
const logError = (message, error) => {
    console.error(`❌ ${message}`, error.response ? error.response.data : error.message);
};

// Événement déclenché quand le bot est prêt
client.once('ready', () => {
    console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
});

// Gestion des commandes Discord
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith("!rerun")) {
        const args = message.content.split(" ");
        const workflowName = args[1] || "build-and-test.yml"; // Nom par défaut si aucun n'est donné

        const workflowId = workflowIds[workflowName] || workflowName; // Si on a un ID, on l'utilise

        const url = `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${workflowId}/dispatches`;

        console.log(`🔄 Tentative de relance du workflow : ${workflowName} (ID: ${workflowId})`);
        console.log(`📡 URL de l'API : ${url}`);

        try {
            const response = await axios.post(url, { ref: "main" }, {
                headers: {
                    "Authorization": `Bearer ${GITHUB_TOKEN}`,
                    "Accept": "application/vnd.github.v3+json"
                }
            });

            if (response.status === 204) {
                message.channel.send(`✅ Workflow \`${workflowName}\` (ID: ${workflowId}) relancé avec succès !`);
            } else {
                console.log("⚠ Réponse inattendue :", response.data);
                message.channel.send(`❌ Erreur : Réponse inattendue.`);
            }
        } catch (error) {
            logError("Erreur lors de l'appel API :", error);
            message.channel.send(`❌ Erreur : ${error.response ? error.response.data.message : error.message}`);
        }
    }
});

// Connexion du bot à Discord
client.login(process.env.DISCORD_BOT_TOKEN);
