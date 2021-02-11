const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login('ODA4MDc1MDE5NzgyNTg2NDY4.YCBQgg.QP6akorKwhWq7Eo_MnL7QoGuHnQ');
