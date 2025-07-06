require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('./commands')
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'remind') {
    const hours = interaction.options.getInteger('hours');
    const minutes = interaction.options.getInteger('minutes');
    const message = interaction.options.getString('message') || 'This Is The Default Reminder Bot Message For Reminding';
    const originalDate = new Date();
    const updatedDate = addTime(originalDate, hours, minutes);
    const symbols = '``'
    interaction.reply({ content: `${symbols}Your remind message will be Sent In ${getLocalOriginalDateFunc(updatedDate)}, Be Patient ${symbols}`, ephemeral: true })
    const totalMs = (hours * 60 + minutes) * 60 * 1000;
    setTimeout(() => {
        saveUserRemindData(interaction.user.id, interaction.guild.id, message);
    }, totalMs);
  }
});

async function saveUserRemindData(userid, guildid, message) {
    const guild = client.guilds.cache.get(guildid);
    if(guild) {
        const user = await guild.members.fetch(userid);
        if(user) {
            try {
                const embed = new EmbedBuilder()
                    .setTitle('Remind Alert')
                    .setColor('Blue')
                    .setAuthor({
                        name: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setThumbnail(user.displayAvatarURL())
                    .setImage('https://media.discordapp.net/attachments/1391405825540624444/1391409650313986078/wall-clock-logo-icon_414847-367-removebg-preview.png?ex=686bcab7&is=686a7937&hm=7a0ae966b87f8282aed8e4d18552b89d0456beea8102f3affd3407cfb9428ee3&=&format=webp&quality=lossless')
                    .setDescription(`You setted up this remind alert to remind you now\nRemind Message: ${message}`)
                    .setTimestamp();
                await user.send({ embeds: [embed] });
            } catch(error) {
                console.log(error);
            }
        }
    }
}

function getLocalOriginalDateFunc(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
}

function addTime(date, hoursToAdd, minutesToAdd) {
    const newDate = new Date(date.getTime());
    newDate.setHours(newDate.getHours() + hoursToAdd);
    newDate.setMinutes(newDate.getMinutes() + minutesToAdd);
    return newDate;
}

client.login(process.env.TOKEN);
