const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
const prefix = '!@';
const help = 'Hey my friend, Commands I have for now:\n!@isthebest <name>\n!@number <your number>\n!@match <name1> <age1> <or any other attributes> <name2> <age2> <or any other attributes>\n!@happy-birthday <name>\nThanks to Artur,Aman(they are real sweet hearts)\nv0.01\nhttps://github.com/ar2rworld/ArturBot/blob/master/index.js\n\n\nArtur DELETE THE SERVER SO it does not have all the functionality\nupdated functionality:\n!@changeAva\n';
client.on('message', msg => {
  const inp = msg.content.toLowerCase();
  if(inp.startsWith(prefix)){
    if(inp.indexOf('help')>0){
      msg.reply(help);
    }else if(inp.indexOf('changeava')>0){
      client.user.setAvatar('https://random-d.uk/api/randomimg').then(msg.reply('Image is set, my friend, it is always good to have something dynemic =)')).catch(console.error);
    }
  }
  if(inp.indexOf('arturbot')>=0 && !msg.client.user.equals(client.user)){
    msg.reply(help);
  }
});
client.login(config.token);
//nodemon --inspect index.js
