require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

if (!process.env.TOKEN) {
    console.log("❌ No TOKEN detected!");
} else {
    console.log("✅ TOKEN detected!");
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);