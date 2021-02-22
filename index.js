const Discord = require('discord.js');
const client = new Discord.Client();
const { MessageAttachment } = require('discord.js');
const config = require('./config.json');
const fs = require('fs'); //readFile function 
//const ytdl = require('ytdl-core-discord');
const ytdl = require("discord-ytdl-core");
//var StringBuilder = require('stringbuilder');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const request = require('request')

//Notes:
//

/*Used methods:*/
const getASCIIsum = (s) =>{
  return s.toLowerCase().split('').reduce( (t, c) => t + c.charCodeAt(0),0);
}
const download = (url, path, callback) => {
  //https://flaviocopes.com/node-download-image/
  try{
    request.head(url, (err, res, body) => {
      request(url)
        .pipe(fs.createWriteStream(path))
        .on('close', callback).on('error', err => console.log(err))
    })
  }catch(err){
    console.log(err);
  }
}
/*Main functionality*/
//number game variables:
let gameStatus = false;
let number = 0;
let attempts = 0;

//bot vars
const prefix = '!@';
let help = "Hey my friend, Commands I have for now:\n!@changeAva\n!@isTheBest <name>\n!@number //Guess my number in range of [0, 99]\n->!@number <your number> //replies you if number is bigger or smaller\n->!@number new //new game\n!@match <name1> <name2> [any optinal args]\n!@happy-birthday <name>\n!@autoreply //everytime anyone mentions your in the message, bot replies with default message \n->!@autoreply <on/off> //changes your autoreply status\n->!@autoreply <on/off> <your message> //updates autoreply status and sets messages to provided\n->!@autoreply <your message> //changes your autoreply message and sets status to \"on\"\n!@meme //sends a meme from local storage\n->!@meme //if picture is attached to the message it will be saved to the local storage\n->!@meme <direct link to an image> //donwloads image from web into the storage, supports many links separated by single SPACE\nv0.02\n\nThanks to Artur,Aman(they are real sweet hearts)\nhttps://github.com/ar2rworld/ArturBot/blob/master/index.js\n";
let autoreplyFileExists = false;
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(help);
  client.user.setActivity("!@help", {type : "PLAYING"}).then(p => console.log("Activity set to " + p.activities[0].name));
  //console.log(client.guilds.cache.get("736262572076040322").members);
  //
  //autoreply.json file exists check
  var f = "autoreply.json";
  if(fs.existsSync("./" + f)){
    console.log(f+ " file does exist");
    autoreplyFileExists = true; 
  }else{
    console.log(f+ " file does not exist");
    var data = {"users" : {}};
    fs.writeFile(f, JSON.stringify(data), function(err){
          if(err){
            console.log(err);
          }else{
            console.log(f + " file created");
            autoreplyFileExists = true; 
          }
        });
  }
  //memes directory check:
  fs.access("memes", err => {
      if(err){
        fs.mkdirSync("memes");
        console.log("memes folder created");
      }});

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
    }else if(inp.indexOf("play")>0){
        //console.log(msg.author.client.channels);
        //console.log(client.channels.cache.filter(c => c.type === "voice").array()[0].id);
        const v0 = client.channels.cache.filter(c => c.type === "voice").array();
        const channel1 = v0.filter(c => c.name === "bot-testing")[0];
        
        //check for permission
        //https://github.com/iCrawl/discord-music-bot
        const { channel } = msg.member.voice;
    		if (!channel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		    const permissions = channel.permissionsFor(msg.client.user);
		    if (!permissions.has('CONNECT')) return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		    if (!permissions.has('SPEAK')) return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');

        if (!channel1) return console.error("The channel does not exist!");
          channel.join().then(connection => {
          // Yay, it worked!
          console.log("Successfully connected.");
          const broadcast = client.voice.createBroadcast();
          broadcast.play("./ded_maxim.mp3");
          //connection.play(broadcast);
          connection.play(ytdl('https://www.youtube.com/watch?v=ZlAU_w7-Xp8', {
filter: "audioonly",
opusEndcoded: true
                }), { type: 'opus' });
          connection.on("debug" , m =>{
                console.log("d " + m);
                });
          connection.on("error" , m =>{
                console.log("er " + m);
                });
        }).catch(e => {
          // Oh no, it errored! Let's log it to console :)
          console.error(e);
        });

     
    }else if(inp.indexOf("autoreply")>0){
      console.log(msg.author.id + " " + msg.author.username);
      if(autoreplyFileExists){
        let rawdata = fs.readFileSync('autoreply.json');
        let ARusers = JSON.parse(rawdata);
        const temp = inp.split(" ");
        //console.log(ARusers);
        if(ARusers.users.hasOwnProperty(msg.author.id)){
          if(temp.length === 1){
            msg.reply("I see your command and your id in my log, please check the !@help");
          }else if(temp.length === 2){
            if(temp[1] === "on" || temp[1] === "off"){
              ARusers.users[msg.author.id].status = temp[1];
              msg.reply("You autoreply status updated");
            }else{
              ARusers.users[msg.author.id].status = "on";
              ARusers.users[msg.author.id].message = msg.content.split(" ")[1];
              msg.reply("Your autoreply status is on and message updated");
            }
          }else{
            if(temp[1] === "on" || temp[1] === "off"){
              ARusers.users[msg.author.id].status = temp[1];
              ARusers.users[msg.author.id].message = msg.content.split(" ").slice(2).join(" ");
              msg.reply("You autoreply status updated and is working now with your custom message");
            }else{
              ARusers.users[msg.author.id].status = "on";
              ARusers.users[msg.author.id].message = msg.content.split(" ").slice(1).join(" ");
              msg.reply("You autoreply status is on and is working now with your custom message");
            }
          }
        }else{
          ARusers.users[msg.author.id] = {
            "status" : "on",
            "message" : (temp.length === 1 ? "Hello, this is a default autoreply message, have a nice day!": msg.content.split(" ").slice(1).join(" "))
          }
          msg.reply("You autoreply created and is working now");
        }
        var out = "";
        fs.writeFile("autoreply.json", JSON.stringify(ARusers), function(err){
              if(err){
                console.log(err);
                out = err;
              }
            });
        if(out){
          msg.reply("Errors occured while writing .json to file:\n" + out);
        }
      }else{
        msg.reply("autoreply function is not available, as file does not exist");
      }
    }else if(inp.indexOf("meme")>0){
      if(msg.attachments.array().length>0 || inp.split(" ").length > 1){
      const atts = msg.attachments.array();
      if(atts.length > 0){
        //console.log(atts);
        for(let i=0; i<atts.length; i+=1){
          //console.log(atts[i].name + " -> " +  atts[i].attachment);
          let url = atts[i].proxyURL;
          download(url, config.memes+postfix+atts[i].name, () => {//config.memes+postfix+atts[i].name, 
            msg.channel.send("GOt it");
          });
        }
      }else{
        msg.channel.send("No imgs attached =(");
      }
      const links = msg.content.split(" ").slice(1);
      for(let i=0; i<links.length; i+=1){
          let url = links[i];
          let urlParts = url.split('/');
          download(url, config.memes  +urlParts[urlParts.length-1] , () => {//config.memes+postfix+atts[i].name, 
            msg.channel.send("GOt it from link in the message");
          });
      }
      }else{
        //console.log(msg.attachments.array()[0].attachment);
        fs.readdir(config.memes, (err, files) => {
            if(err){
              console.log(err);
              msg.channel.send("Error while dir reading");
            }else{
              if(files.length > 0){
                const att = new MessageAttachment(config.memes + files[Math.floor(Math.random() * files.length)]);
                msg.channel.send(att);
              }else{
                msg.channel.send("No files found in dir");
              }
            }
            });
      }
      //console.log(msg.attachments.array());
      //node -e 'const fs = require("fs");fs.writeFile("1.jpg", "https://media.discordapp.net/attachments/812960123265089538/813263670058024970/d.jpg", err => {console.log(err)});'
    }//next command
    
  }
  //console.log("msg.cont: " + msg.content + "  " + msg.client.user.id  + " " +  client.user.id);


  if(msg.channel.type === "text" && !msg.author.equals(client.user) && msg.mentions.members.array().length > 0){
    //console.log(msg.author.id + " " + msg.author.discriminator + " "); 
    const mentionedIDs = msg.mentions.members.array();
    let rawdata = fs.readFileSync('autoreply.json');
    let ARusers = JSON.parse(rawdata);
    for(let i=0; i < mentionedIDs.length; i+=1){
      const userID = mentionedIDs[i].user.id;
      //console.log(userID+ " in the log? " + ARusers.users.hasOwnProperty(userID));
      if(ARusers.users.hasOwnProperty(userID)){
        if(ARusers.users[userID].status === "on"){
           msg.reply("Autoreply from " + mentionedIDs[i].user.username + ":\n" + ARusers.users[userID].message); 
        }
      }
    }
  }

  if(inp.indexOf('arturbot')>=0 && !msg.author.equals(client.user)){
    msg.reply(help);
  }
  if( msg.mentions.members.array().length > 0 && !msg.author.equals(client.user)){
    const mentionedIDs = msg.mentions.members.array();
    var out = 0;
    for(let i=0; i < mentionedIDs.length; i+=1){
      const userID = mentionedIDs[i].user.id;
      if(userID === client.user.id){
        out = 1;
        break;
      }
    }
    if(out){
      msg.reply("Sup dude? Come check my docs out !@help");
    }
  }
});
client.login(config.token);
//nodemon --inspect index.js
