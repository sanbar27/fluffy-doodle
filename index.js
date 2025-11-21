require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');

// ------------------
// Database file
// ------------------
const dbPath = './vouches.json';
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));

// ------------------
// Create bot
// ------------------
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ------------------
// Fancy text function
// ------------------
function fancyText(text) {
    const fancyMap = {
        A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚',
        H: '𝗛', I: '𝗜', J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡',
        O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧', U: '𝗨',
        V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',
        a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴',
        h: '𝗵', i: '𝗶', j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻',
        o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', u: '𝘂',
        v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇',
        '0':'𝟬','1':'𝟭','2':'𝟮','3':'𝟯','4':'𝟰','5':'𝟱','6':'𝟲','7':'𝟳','8':'𝟴','9':'𝟵'
    };
    return text.split('').map(c => fancyMap[c] || c).join('');
}

// ------------------
// PREFIX COMMANDS (hidden with ?)
// ------------------
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const prefix = '?';
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Load DB
    let db = {};
    try { db = JSON.parse(fs.readFileSync(dbPath)); } catch (err) { console.error(err); }

    // --------- ?vouch ---------
    if (command === 'vouch') {
        const user = message.mentions.users.first();
        if (!user) return message.reply('❌ You must mention a user!');
        if (user.id === message.author.id) return message.reply("❌ You can't vouch yourself!");

        db[user.id] = (db[user.id] || 0) + 1;
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        const embed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle('💎 OFFICIAL VOUCH SYSTEM 💎')
            .setDescription(`A new vouch has been officially recorded!`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: '👤 User', value: `> **${user.tag}**`, inline: true },
                { name: '🏆 Total Vouches', value: `> **${db[user.id]}**`, inline: true }
            )
            .setFooter({ text: '✨ Trust & Reputation System ✨' })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }

    // --------- ?vouchcount ---------
    if (command === 'vouchcount') {
        const user = message.mentions.users.first();
        if (!user) return message.reply('❌ You must mention a user!');

        const count = db[user.id] || 0;
        const embed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle('📜 VOUCH STATUS REPORT 📜')
            .setDescription(`Official record of vouches:`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: '👤 User', value: `> **${user.tag}**`, inline: true },
                { name: '🏆 Total Vouches', value: `> **${count}**`, inline: true },
                { name: '⭐ Reputation', value: `> **${
                    count > 500 ? "💎 Legendary Trusted Member" :
                    count > 100 ? "🌟 Highly Trusted" :
                    count > 10 ? "✅ Trusted Member" :
                    "🆕 New / Unverified"
                }**`, inline: true }
            )
            .setFooter({ text: '⚡ Official Reputation System ⚡' })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }

    // --------- ?addvouch ---------
    if (command === 'addvouch') {
        const user = message.mentions.users.first();
        const amount = parseInt(args[0]);
        if (!user) return message.reply('❌ You must mention a user!');
        if (!amount || amount <= 0) return message.reply('❌ Amount must be a positive number!');

        db[user.id] = (db[user.id] || 0) + amount;
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        const embed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle('💎 OFFICIAL VOUCH SYSTEM 💎')
            .setDescription(`**${amount} vouches** have been officially added to **${user.tag}**!`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: '👤 User', value: `> **${user.tag}**`, inline: true },
                { name: '🏆 Total Vouches', value: `> **${db[user.id]}**`, inline: true }
            )
            .setFooter({ text: '✨ Trust & Reputation System ✨' })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }

    // --------- ?removevouch ---------
    if (command === 'removevouch') {
        const user = message.mentions.users.first();
        const amount = parseInt(args[0]);
        if (!user) return message.reply('❌ You must mention a user!');
        if (!amount || amount <= 0) return message.reply('❌ Amount must be a positive number!');

        db[user.id] = Math.max((db[user.id] || 0) - amount, 0);
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        const embed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle('💎 OFFICIAL VOUCH SYSTEM 💎')
            .setDescription(`**${amount} vouches** have been removed from **${user.tag}**!`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: '👤 User', value: `> **${user.tag}**`, inline: true },
                { name: '🏆 Total Vouches', value: `> **${db[user.id]}**`, inline: true }
            )
            .setFooter({ text: '✨ Trust & Reputation System ✨' })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }

    // --------- ?leaderboard ---------
    if (command === 'leaderboard') {
        const sorted = Object.entries(db)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);

        if (sorted.length === 0) return message.reply('No vouches yet!');

        const leaderboard = await Promise.all(sorted.map(async ([userId, count], index) => {
            let medal = '';
            if (index === 0) medal = '🥇';
            else if (index === 1) medal = '🥈';
            else if (index === 2) medal = '🥉';

            try {
                const userObj = await client.users.fetch(userId);
                return `${medal} **${userObj.tag}** - ${count} vouches`;
            } catch {
                return `${medal} **Unknown User** - ${count} vouches`;
            }
        }));

        const embed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle('🏆 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗩𝗢𝗨𝗖𝗛 𝗟𝗘𝗔𝗗𝗘𝗥𝗕𝗢𝗔𝗥𝗗 🏆')
            .setDescription(leaderboard.map(line => fancyText(line)).join('\n'))
            .setThumbnail('https://cdn.pixabay.com/photo/2017/01/31/13/14/trophy-2023288_1280.png')
            .setImage('https://cdn.pixabay.com/photo/2016/03/31/19/31/medal-1295101_1280.png')
            .setFooter({ text: '✨ Top Vouched Members ✨', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
});

// ------------------
// LOGIN BOT
// ------------------
client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// Only this login is needed
client.login(process.env.TOKEN);