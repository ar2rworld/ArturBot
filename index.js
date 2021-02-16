const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
//const fs = require('fs'); //readFile function 
//var StringBuilder = require('stringbuilder');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//Notes:
//Issue 2: promise request from any website, some attempts in readFileStuff.js 
//


/*Used methods:*/
const getASCIIsum = (s) =>{
  return s.toLowerCase().split('').reduce( (t, c) => t + c.charCodeAt(0),0);
}

/*Main functionality*/
//number game variables:
let gameStatus = false;
let number = 0;
let attempts = 0;

//bot vars
const prefix = '!@';
let help = "Hey my friend, Commands I have for now:\n!@changeAva\n!@isTheBest <name>\n!@number //Guess my number in range of [0, 99]\n->!@number <your number> //replies you if number is bigger or smaller\n->!@number new //new game\n!@match <name1> <name2> [any optinal args]\n!@happy-birthday <name>\nv0.02\n\nThanks to Artur,Aman(they are real sweet hearts)\nhttps://github.com/ar2rworld/ArturBot/blob/master/index.js\n\n\n";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(help);
  client.user.setActivity("!@help", {type : "PLAYING"}).then(p => console.log("Activity set to " + p.activities[0].name));
  //console.log(client.guilds.cache.get("736262572076040322").members);
});


client.on('message', msg => { 
  const inp = msg.content.toLowerCase();
  if(inp.startsWith(prefix)){ 
    if(inp.indexOf('help')>0){
      msg.reply(help);
    }else if(inp.indexOf('changeava')>0){
      client.user.setAvatar('https://random-d.uk/api/randomimg').then(msg.reply('Image is set, my friend, it is always good to have something dynemic =)')).catch(console.error);
    }else if(inp.indexOf('isthebest')>0){
      const tempInp = inp.split(' ');
      if(tempInp.length === 2){
        const val = getASCIIsum(tempInp[1]) % 101;
        let ext = "";
        ext = "I'm so sorry, my friend, but you suck 	(͡ ° ͜ʖ ͡ °) ."; 
        msg.reply("Hmmm, My reseach showed that you are on " + val + "% best" + (val > 10 ? val === 100? ".OMG, you are an absolute king" : ". Congrats!": ext));
      }else{
        msg.reply("My dear, can you please use exactly one argument for this command? Check out help: "+ prefix + "help");
      }
    }else if(inp.indexOf("number")>0){
      const tempArgs = inp.split(' ');
      if(gameStatus){
        if(tempArgs.length === 2){
          const guess = tempArgs[1].replace(/[a-zA-Z\W_]+/gi,"");
          const gNumber = Number(guess);
          if(guess.length){
            attempts +=1;
            if(number > gNumber){
              msg.reply("hmmmm, too small, just like your brain, mzf");		 
            }else if(number < gNumber){
              msg.reply('Your number is as big as my D');
            }else{
              msg.reply("Correct! You took " + attempts + " attempts to find my pseudorandom number, " + (attempts <= 7 ? "My cyberBird!" : "My dear."));
              attempts = 0;
              gameStatus = false;
            }
          }else if(tempArgs[1] === "new"){
            number = parseInt(Math.random() * 100 * getASCIIsum(Date())) % 100;
            attempts = 0;
            gameStatus = true;
            msg.reply("Oh, no worries, you will take it next time[use binary search], enter !@number <your number>\nI will say if it is bigger or smaller\nrange(0, 99)");
          }else{
            msg.reply("I feel like you trying to play with me but giving me invalid input");
          }
          }else{
            msg.reply("Please give me one argument to play with, honey");
          }
      }else{
        number = parseInt(Math.random() * 100 * getASCIIsum(Date())) % 100;
        attempts = 0;
        gameStatus = true;
        msg.reply("Game started, enter !@number <your number>\nI will say if it is bigger or smaller\nrange(0, 99)");
      }
    }else if(inp.indexOf("match")>0){
      if(inp.split(" ").length > 2){
        const val = getASCIIsum(inp.split(" ").slice(1).join("")) % 100;
        msg.reply((val > 35?"OH, You guys have a chance of " + val + "%." : "Sorry, you chances as low as " + val + "% but never give up!")); 
      }else{
        msg.reply("Oh brother/sister/both, can you please provide me at least two arguments: !@match <name1> <name2> ...");
      }
    }else if(inp.indexOf("happy-birthday")>0){
      //https://www.youtube.com/watch?v=ORCqbKG4Z0M
      const temp = inp.split(" ");
      if(temp.length === 2){
        msg.reply("I would like to say HAPPY BIRTHDAY TO " + temp[1] + "\nAnd wish him/her all the best, \"You don't have to be ruled ty fate. You can choose freedom.\" @Castiel supernatural.\nThis song is for you:\nhttps://www.youtube.com/watch?v=ORCqbKG4Z0M");
      }else{
        msg.reply("Invalid input: !@happy-birthday <name>");
      }
    }//next command
    
  }
  //console.log("msg.cont" + msg.content + "  " + msg.client.user.id  + " " +  client.user.id);
  if(msg.channel.type === "text" && !msg.author.equals(client.user)){
    //console.log(msg.author.id + " " + msg.author.discriminator + " "); 
    const mentionedIDs = msg.mentions.members.array();
    let out = "Sorry, but user" + (mentionedIDs.length==1 ? "" : "s") + ": ";
    for(let i=0; i < mentionedIDs.length; i+=1){
      const tPresence = mentionedIDs[i].user.presence;
      out += mentionedIDs[i].user.username + " is "+ (tPresence.activities.length ? tPresence.activities[0].type + " " + tPresence.activities[0].name : tPresence.status) + (i==mentionedIDs.length-1 ? "" : "; ");
      //console.log(tPresence.activities.length? tPresence.activities[0].name: "" );
      //console.log("n activities: " + tPresence.activities.length);
    }
    //console.log(out)
    out += "\nTry to contact " + (mentionedIDs.length == 1 ? "hem/her" : "them") + " later, my friend";
    if(mentionedIDs.length){
      //console.log(mentionedIDs.length);
      msg.reply(out);
    }
  }

  if(inp.indexOf('arturbot')>=0 && !msg.author.equals(client.user)){
    msg.reply(help);
  }
});
client.login(config.token);
//nodemon --inspect index.js
