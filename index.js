const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
const prefix = '!@';
const help = "Hey my friend, Commands I have for now:\n!@isthebest <name>\n!@number <your number>\n!@match <name1> <age1> <or any other attributes> <name2> <age2> <or any other attributes>\n!@happy-birthday <name>\nThanks to Artur,Aman(they are real sweet hearts)\nv0.01\nhttps://github.com/ar2rworld/ArturBot/blob/master/index.js\n\n\nArtur DELETE THE SERVER SO it does not have all the functionality";
client.on('message', msg => {
  const inp = msg.content.toLowerCase();
  if(inp.startsWith(prefix)){
    if(inp.indexOf('help')>0){
      msg.reply(help);
    }
  }
  if (inp.indexOf('arturbot')>=0){
    msg.reply(help);
  }
});
client.login(config.token);
