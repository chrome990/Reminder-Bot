require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

const commands = [
  new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Select the remind message time')
   .addIntegerOption(option =>
      option
        .setName('hours')
        .setDescription('Put How Many Hours (default = 0)')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('minutes')
        .setDescription('Put How Many Minutes (default = 0)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('The Remind Message')
        .setRequired(false)
    )
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Refreshing !!!');

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );

    console.log('Loaded / Commands By CHROME XD');
  } catch (error) {
    console.error(error);
  }
})();
