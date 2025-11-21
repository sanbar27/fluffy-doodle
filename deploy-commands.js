const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const { token, clientId } = require('./config.json');

const commands = [
    new SlashCommandBuilder()
        .setName('vouch')
        .setDescription('Give a vouch to a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User you want to vouch for')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('vouchcount')
        .setDescription('Check how many vouches a user has.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to check')
                .setRequired(true)
        )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('🔄 Registering global commands...');
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );
        console.log('✅ Global slash commands registered!');
    } catch (error) {
        console.error(error);
    }
})();C