require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Pour que le bot fonctionne dans les serveurs
        GatewayIntentBits.GuildMessages, // Pour lire les messages
        GatewayIntentBits.MessageContent // Pour accéder au contenu des messages (NÉCESSAIRE)
    ]
});

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = "ton-utilisateur/chatops-demo"; // Remplace par ton repo GitHub

client.once('ready', () => {
    console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith("!rerun")) {
        const args = message.content.split(" ");
        const workflowName = args[1] || "notify-discord.yml"; // Par défaut, on relance ce workflow

        const url = `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${workflowName}/dispatches`;

        try {
            const response = await axios.post(url, { ref: "main" }, {
                headers: {
                    "Authorization": `Bearer ${GITHUB_TOKEN}`,
                    "Accept": "application/vnd.github.v3+json"
                }
            });

            if (response.status === 204) {
                message.channel.send(`✅ Le workflow \`${workflowName}\` a été relancé.`);
            }
        } catch (error) {
            message.channel.send(`❌ Erreur : ${error.response ? error.response.data.message : error.message}`);
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
