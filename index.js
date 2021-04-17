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
//811122416754622514 - 2Astana
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
const updateMana = member =>{
  var tempMana = (member.mana + (Date.now() - member.time)/(1000*config.manaRegen));
  if(tempMana > config.manaPool)
    tempMana = config.manaPool;
  return tempMana;
}
const checkMemberMagic = (msg, spell, targetID) =>{
    //console.log(magicMembers);
    const id = msg.author.id;
    const member = magicMembers[id];
    if(spell === config.memberVoiceKick){
      if(magicMembers.hasOwnProperty(id)===false){
        //console.log("1heckMemberMagic functio");
        return "You don't have a magic license";
      }
      if(magicMembers[id].status==="off"){
        return "You magic status is off, you probably wanna turn it on, check out " +prefix+ "help";
      }
      if(magicMembers.hasOwnProperty(targetID)===false){
        //console.log("4heckMemberMagic functio");
        return "Your target is not a wizard, so just let him/her go... Or motivate him/her to get a license";
      }
      if(magicMembers[targetID].status==="off"){
        return "The target's status is off, wait for your chance...";
      }
      var tempMana = updateMana(member); 
      if(tempMana >= 100){
        tempMana = 100;
      }
      if(tempMana <= config.costMemberVoiceKick){
        //console.log("2heckMemberMagic functio");
        //console.log(tempMana);
        return "Not enough mana";
      }
      var cd = Date.now() - magicMembers[id][config.memberVoiceKick];
      //console.log("CD: " + cd + ` Date.now(): ${Date.now()} - lastUsed: ${magicMembers[id][config.memberVoiceKick]}`);
      if(cd < config.CDmemberVoiceKick){
        //console.log("3heckMemberMagic functio");
        return `CD(${config.CDmemberVoiceKick - cd}), not ready yet`;
      }
      
      magicMembers[id].mana = tempMana;
      magicMembers[id].mana -= config.costMemberVoiceKick;
      magicMembers[id][config.memberVoiceKick] = Date.now();
      magicMembers[id].time = Date.now();
      return "";
    }else if(spell === config.memberVoiceMute){
      if(magicMembers.hasOwnProperty(id)===false){
        //console.log("1heckMemberMagic functio");
        return "You don't have a magic license";
      }
      if(magicMembers[id].status==="off"){
        return "You magic status is off, you probably wanna turn it on, check out " +prefix+ "help";
      }
      if(magicMembers.hasOwnProperty(targetID)===false){
        //console.log("4heckMemberMagic functio");
        return "Your target is not a wizard, so just let him/her go... Or motivate him/her to get a license";
      }
      if(magicMembers[targetID].status==="off"){
        return "The target's status is off, wait for your chance...";
      }
      var tempMana = updateMana(member); 
      if(tempMana >= 100){
        tempMana = 100;
      }
      if(tempMana <= config.costMemberVoiceMute){
        console.log("2heckMemberMagic functio");
        console.log(tempMana);
        return "Not enough mana";
      }
      var cd = Date.now() - magicMembers[id][config.memberVoiceMute];
      //console.log("CD: " + cd + ` Date.now(): ${Date.now()} - lastUsed: ${magicMembers[id][config.memberVoiceMute]}`);
      if(cd < config.CDmemberVoiceMute){
        //console.log("3heckMemberMagic functio");
        return `CD(${config.CDmemberVoiceMute - cd}), not ready yet`;
      }
      magicMembers[id].mana = tempMana;
      magicMembers[id].mana -= config.costMemberVoiceMute;
      magicMembers[id][config.memberVoiceMute] = Date.now();
      magicMembers[id].time = Date.now();
      return "";
    }else if(spell === config.memberVoiceUnmute){
      if(magicMembers.hasOwnProperty(id)===false){
        //console.log("1heckMemberMagic functio");
        return "You don't have a magic license";
      }
      var tempMana = updateMana(member); 
      if(tempMana >= 100){
        tempMana = 100;
      }
      if(tempMana <= config.costMemberVoiceUnmute){
        //console.log("2heckMemberMagic functio");
        //console.log(tempMana);
        return "Not enough mana";
      }
      var cd = Date.now() - magicMembers[id][config.memberVoiceUnmute];
      ////console.log("CD: " + cd + ` Date.now(): ${Date.now()} - lastUsed: ${magicMembers[id][config.memberVoiceMute]}`);
      if(cd < config.CDmemberVoiceMute){
        ////console.log("3heckMemberMagic functio");
        return `CD(${config.CDmemberVoiceUnmute - cd}), not ready yet`;
      }
      if(magicMembers.hasOwnProperty(targetID)===false){
        ////console.log("4heckMemberMagic functio");
        return "Your target is not a wizard, so just let him/her go... Or motivate him/her to get a license";
      }
      magicMembers[id].mana = tempMana;
      magicMembers[id].mana -= config.costMemberVoiceUnmute;
      magicMembers[id][config.memberVoiceUnmute] = Date.now();
      magicMembers[id].time = Date.now();
      return "";
    }
}
const writeToJSON = (f,j) => {
  var out = "";
  fs.writeFileSync(f, JSON.stringify(j), function(err){
    if(err){
      console.log(err);
      out = err;
    }
  });
  return out;
}
/*Main functionality*/
//number game variables:
let gameStatus = false;
let number = 0;
let attempts = 0;
let magicMembers = {};
//bot vars
const prefix = config.prefix;
let help = "Hey my friend, Commands I have for now:\n!@changeAva\n!@isTheBest <name>\n!@number //Guess my number in range of [0, 99]\n->!@number <your number> //replies you if number is bigger or smaller\n->!@number new //new game\n!@match <name1> <name2> [any optinal args]\n!@happy-birthday <name>\n!@autoreply //everytime anyone mentions your in the message, bot replies with default message \n->!@autoreply <on/off> //changes your autoreply status\n->!@autoreply <on/off> <your message> //updates autoreply status and sets messages to provided\n->!@autoreply <your message> //changes your autoreply message and sets status to \"on\"\n!@meme //sends a meme from local storage\n->!@meme //if picture is attached to the message it will be saved to the local storage\n->!@meme <direct link to an image> //donwloads image from web into the storage, supports many links separated by single SPACE\n" + prefix + "love //returns how much love u need\n//Now you can server mute and kick another user from the voice channel...Magic\nThere is 5 conditions you need to keep in mind:\n1)Server is magic enabled\n2)You have a magic licence\n3)You have enough mana\n4)Skill you using is not in CD\n5)User which is your target has a magic licence as well\n//Magic commands\n" + prefix + "magic <on/off> <Your magic name> //to get a licence\n" + prefix+ config.memberVoiceKick + " <tag user/users> //to kick user/users from the voice channel\n" + prefix + config.memberVoiceMute+ " <tag user/users> //to server mute user\n" + prefix + config.memberVoiceUnmute + " <tag user/users> //to unmute user\n" + prefix+"clean //cleans 1-100 last messages not older than two weeks\n" +prefix+ "room_for_user <name of the voice channel> //when user enters this channel bot creates a separate voice channel, moves him/her to the new room, if room ends on \"s room\" and has no users in it bot deletes the room\n" +prefix+"alarms <number of hours> <number of minutes> [you message(optional)] \nv0.03\n\nThanks to Artur,Aman(they are real sweet hearts)\nhttps://github.com/ar2rworld/ArturBot\n";
////use it in direct messages, bot sends you in DM your custom message or default message every <number of minutes> during some <number of hours> you mentioned
let autoreplyFileExists = false;
let magicEnabledServer = false;
let alarmsMembers={};
let tempVoiceChannelIDs=[];
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(help);
  client.user.setActivity("!@help", {type : "PLAYING"}).then(p => console.log("Activity set to " + p.activities[0].name));
  //console.log(client.guilds.cache.get("736262572076040322").members);
  //magic
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
  //alarmsMembers file check
  if(fs.existsSync("./" + config.alarmsMembersFile)){
    console.log(config.alarmsMembersFile+ " file does exist");
    let rawdata = fs.readFileSync(config.alarmsMembersFile);
    timerMembers = JSON.parse(rawdata);
  }else{
    console.log(config.alarmsMembersFile+ " file does not exist");
    var data = {};
    fs.writeFile(config.alarmsMembersFile, JSON.stringify(data), function(err){
          if(err){
            console.log(err);
          }else{
            console.log(config.alarmsMembersFile + " file created");
            autoreplyFileExists = true; 
          }
        });
  }

  var fm = config.magicFile;
  if(fs.existsSync("./" + fm)){
    console.log(fm+ " file does exist");
    let rawdata = fs.readFileSync(fm);
    magicMembers = JSON.parse(rawdata);
  }else{
    console.log(fm+ " file does not exist");
    var data = {};
    magicMembers = data; 
    fs.writeFile(fm, JSON.stringify(data), function(err){
          if(err){
            console.log(err);
          }else{
            console.log(fm + " file created");
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

  //alarm sending
  //alarmsMembers[id]={"times": Math.floor(hours*60/often), "minBeforeSignal":often};
  client.setInterval(()=>{
    for(k in alarmsMembers){
      alarmsMembers[k].minBeforeSignal-=1;
      if(alarmsMembers[k].minBeforeSignal<=0){
        alarmsMembers[k].minBeforeSignal=alarmsMembers[k].often;
        alarmsMembers[k].times-=1;
        var last=false;
        var times=alarmsMembers[k].times;
        var often=alarmsMembers[k].often;
        var minBefore=alarmsMembers[k].minBeforeSignal;
        var message=alarmsMembers[k].message;
        if(alarmsMembers[k].times<=0){
          delete alarmsMembers[k];
          last=true;
        }
        client.users.fetch(k).then(user =>{
          user.send(`${(last?"Last message":("Messages left:"+String((times-1*often + Number(minBefore)))))} ${message}`);
        })
        
      }
    }
    //console.log(alarmsMembers);
  }, 60000);
  /*console.log(client.users.fetch('811122416754622514').then(i=>{
    console.log(i);
  }));*/
  //console.log(client.channels.cache.array().filter(ch => ch.type==="voice" && ch.name==="general"));
  //console.log(client.guilds.cache.array()[1].members.cache.array());
  //var p = new Discord.Permissions("MOVE_MEMBERS");
  //console.log(p);
  //console.log(client.guilds.cache.array()[1].channels.cache.array()[1]); 
});

//check member joining specific voice channel to create a new room
//https://discord.js.org/#/docs/main/stable/typedef/GuildMemberEditData
client.on('voiceStateUpdate', (oldS, newS) =>{
  //console.log( newS.channelID);
  if( newS.channelID === config.create_roomVoiceChannel){
    //console.log("Got it!");
    newS.channel.clone({"name":(newS.member.nickname?newS.member.nickname:newS.member.user.username) + "'s room"}).then(guildCh =>{
      ////console.log(guildCh);
      tempVoiceChannelIDs.push(guildCh.id);
      guildCh.overwritePermissions([{id:newS.member.user.id, allow: ["MOVE_MEMBERS","KICK_MEMBERS", "ADMINISTRATOR", "MANAGE_CHANNELS"]}]);
      newS.member.edit({"channel":guildCh.id});
      //console.log(newS.member.user.id);
      //newS.channel.createOverwrite(newS.member.user, {ADMINISTRATOR:true}, "Channel owner permissions").then(console.log);
    });
  }
  if(oldS.channel!=null&&tempVoiceChannelIDs.includes(oldS.channel.id) && oldS.channel.members.array().length === 0){
    oldS.channel.delete("cleaning up...(No users in the channel)").then(console.log(oldS.channel.name + " deleted.")).catch(err=>{oldS.guild.systemChannel.send("Error occured while deleting the channel:\n"+err)});
    tempVoiceChannelIDs.pop(oldS.channel.id);
  }
  console.log(tempVoiceChannelIDs);

});

client.on('message',async msg => { 
  magicEnabledServer = msg.channel.type==="text"?config.magicEnabledServers.includes(msg.guild.id):0;
  const inp = msg.content.toLowerCase();
  if(inp.startsWith(prefix)){ 
    var tokens = inp.split(" ");
    if(tokens[0] === prefix+"help"){
      msg.reply(help);
    }else if(tokens[0] === prefix+"changeava"){
      client.user.setAvatar('https://random-d.uk/api/randomimg').then(msg.reply('Image is set, my friend, it is always good to have something dynemic =)')).catch(console.error);
    }else if(tokens[0] === prefix+"isthebest"){
      const tempInp = inp.split(' ');
      if(tempInp.length === 2){
        const val = getASCIIsum(tempInp[1]) % 101;
        let ext = "";
        ext = "I'm so sorry, my friend, but you suck 	(͡ ° ͜ʖ ͡ °) ."; 
        msg.reply("Hmmm, My reseach showed that you are on " + val + "% best" + (val > 10 ? val === 100? ".OMG, you are an absolute king" : ". Congrats!": ext));
      }else{
        msg.reply("My dear, can you please use exactly one argument for this command? Check out help: "+ prefix + "help");
      }
    }else if(tokens[0] === prefix+"number"){
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
    }else if(tokens[0] === prefix+"match"){
      if(tokens.length > 2){
        const val = getASCIIsum(tokens.slice(1).join("")) % 100;
        msg.reply((val > 35?"OH, You guys have a chance of " + val + "%." : "Sorry, you chances as low as " + val + "% but never give up!")); 
      }else{
        msg.reply("Oh brother/sister/both, can you please provide me at least two arguments: !@match <name1> <name2> ...");
      }
    }else if(tokens[0] === prefix+"happy-birthday"){
      //https://www.youtube.com/watch?v=ORCqbKG4Z0M
      const temp = tokens;
      if(temp.length === 2){
        msg.reply("I would like to say HAPPY BIRTHDAY TO " + temp[1] + "\nAnd wish him/her all the best, \"You don't have to be ruled ty fate. You can choose freedom.\" @Castiel supernatural.\nThis song is for you:\nhttps://www.youtube.com/watch?v=ORCqbKG4Z0M");
      }else{
        msg.reply("Invalid input: !@happy-birthday <name>");
      }
    }else if(tokens[0] === prefix+"play"){
        ////console.log(msg.author.client.channels);
        ////console.log(client.channels.cache.filter(c => c.type === "voice").array()[0].id);
        
        //check for permission
        //https://github.com/iCrawl/discord-music-bot
        const { channel } = msg.member.voice;
    		if (!channel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		    const permissions = channel.permissionsFor(msg.client.user);
		    if (!permissions.has('CONNECT')) return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		    if (!permissions.has('SPEAK')) return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');

        try{
          var connection = await channel.join();
        }catch(e){
          return msg.channel.send("ERROR:\n" + e);
        }
        const dispatcher = connection.play('/ded_maxim.mp3')//ytdl("https://www.youtube.com/watch?v=fCQG9oujWEQ"))
          .on('finish',() => {
              //console.log("finished");
              //channel.leave();
              })
          .on("error", error =>{
            msg.channel.send("Dispatcher error:\n" + error);
          });
        dispatcher.setVolumeLogarithmic(5/5);

          /*connection.on("debug" , m =>{
                //console.log("d " + m);
                });
          connection.on("error" , m =>{
                //console.log("er " + m);
                });*/
    }else if(tokens[0] === prefix+"dis"){
      var cons = client.voice.connections.array();
      if(cons.length>0){
        for(let i=0; i<cons.length; i+=1){
          cons[i].disconnect();
        }
      }
    }else if(tokens[0] === prefix+"autoreply"){
      console.log(msg.author.id + " " + msg.author.username);
      if(autoreplyFileExists){
        let rawdata = fs.readFileSync('autoreply.json');
        let ARusers = JSON.parse(rawdata);
        const temp = tokens;
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
    }else if(tokens[0] === prefix+"meme"){
      if(msg.attachments.array().length>0 || tokens.length > 1){
      const atts = msg.attachments.array();
      if(atts.length > 0){
        for(let i=0; i<atts.length; i+=1){
          let url = atts[i].proxyURL;
          download(url, config.memes+atts[i].name, () => {//config.memes+postfix+atts[i].name, 
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
    }else if(tokens[0] === prefix+"rip"){
      msg.channel.send("Death is worth living, and love is worth the wait!\n@V. Tsoy");
    }
    else if(tokens[0] === prefix+config.memberVoiceKick && magicEnabledServer){
      var members = msg.mentions.members.array();
      if(members.length>0){
        for(let i=0; i<members.length; i+=1){
          console.log(members[i].voice.channelID+"\n" +  msg.member.voice.channelID);
          if(members[i].voice.channelID!=null && msg.member.voice.channelID!=null){
            if(members[i].voice.channelID === msg.member.voice.channelID && members[i].voice.channel.equals(msg.member.voice.channel)){//&& members[i].voice.channel.equals(msg.member.voice.channel)){
              const check = checkMemberMagic(msg,config.memberVoiceKick, members[i].id);
              if(!check){
                console.log("->" + members[i].user.username + " kicked out");
                members[i].voice.kick();
              }else{
                msg.channel.send(check);
              }
            }else{
              msg.channel.send(`${members[i].user.username} is not in the voice channel with you`);
            }
          }else{
            msg.channel.send(`${members[i].user.username} or you is not in the voice channel`);
          }
        }
      }
    }
    else if(tokens[0] === prefix+config.memberVoiceMute && magicEnabledServer){
      var members = msg.mentions.members.array();
      if(members.length>0){
        for(let i=0; i<members.length; i+=1){
          console.log(members[i].voice.channelID+"\n" +  msg.member.voice.channelID);
          if(members[i].voice.channelID!=null && msg.member.voice.channelID!=null){
            if(members[i].voice.channelID === msg.member.voice.channelID && members[i].voice.channel.equals(msg.member.voice.channel)){//&& members[i].voice.channel.equals(msg.member.voice.channel)){
              const check = checkMemberMagic(msg,config.memberVoiceMute, members[i].id);
              if(!check){
                console.log("->" + members[i].user.username + " muted");
                members[i].voice.setMute(true);
              }else{
                msg.channel.send(check);
              }
            }else{
              msg.channel.send(`${members[i].user.username} is not in the voice channel with you`);
            }
        }else{
            msg.channel.send(`${members[i].user.username} or you is not in the voice channel`);
        }
      }
    }
    }
    else if(tokens[0] === prefix+config.memberVoiceUnmute && magicEnabledServer){
      var members = msg.mentions.members.array();
      if(members.length>0){
        for(let i=0; i<members.length; i+=1){
          console.log(members[i].voice.channelID+"\n" +  msg.member.voice.channelID);
              const check = checkMemberMagic(msg,config.memberVoiceUnmute, members[i].id);
              if(!check){
                console.log("->" + members[i].user.username + " unmuted");
                members[i].voice.setMute(false);
              }else{
                msg.channel.send(check);
              }
      }
      msg.member.voice.setMute(false);
      }
    }else if(tokens[0] === prefix+"magic"){
      var out="";
      var id = msg.author.id;
      if(!magicMembers.hasOwnProperty(id)){
        if(tokens.length === 3){
          if(tokens[1] === "on"){
            magicMembers[id] = {
              "status" : "on", "nickname" : tokens[2], "mana":config.manaPool, "time": Date.now(), [config.memberVoiceMute]:0, [config.memberVoiceKick]:0
            };
            //const out = writeToJSON(config.magicFile, magicMembers); 
            if(!out){
              msg.channel.send("Congrats! You got your license");
            }else{
              msg.channel.send("Something went wrong:\n" + out);
            }
          }
        }else{
          msg.channel.send("Invalid arguments, check out my " + prefix + "help");
        }
      }else{
        if(tokens[1] === "off"){
          magicMembers[id] = {
            "status" : "off", "nickname" : tokens[2], "mana":magicMembers[id].mana, "time": Date.now(), [config.memberVoiceMute]:0, [config.memberVoiceKick]:0
          };//never could be run as above hasOwnProperty id check
        }
        magicMembers[id].mana = updateMana(magicMembers[id]);
        msg.channel.send(`Wizard ${magicMembers[id].nickname} has ${magicMembers[id].mana} of mana, status: ${magicMembers[id].status}`);
      }
      //saving magicMembers to json
      if(tokens[1] === "save"){
        writeToJSON(config.magicFile, magicMembers);
      }
      //console.log(magicMembers);
    }else if(tokens[0] === prefix + "love"){
      const a ="💋 💋 💋 💋 💋 💋 💋 💋 💋 💋 💋 💌 💌 💌 💌 💌 💌 💌 💌 💌 💌 💌 💘 💘 💘 💘 💘 💘 💘 💘 💘 💘 💘 💝 💝 💝 💝 💝 💝 💝 💝 💝 💝 💝 💖 💖 💖 💖 💖 💖 💖 💖 💖 g 💖 💗 💗 💗 💗     💗 💗 💗 💗 💗 💗 💓 💓 💓 💓 💓 💓 💓 💓 💓 💓 💓 💓 💞 💞 💞 💞 💞 💞💞 💞 💞 💞 💕 💕 💕 💕 💕 💕 💕 💕 💕 💕 💕 💟 💟 💟 💟 💟 💟 💟 💟 💟 💟 ❣ ❣ ❣ ❣ ❣ ❣ ❣ ❣ 💔 💔 💔 💔 💔     💔 💔 💔 💔 💔 💔 🔥 🔥 ⊛"
      b = a.split(" ");
      msg.channel.send(b[Math.floor(Math.random()*b.length)]);
    }else if(tokens[0] === prefix+"room_for_user"){
      if(msg.channel.type==="text" && msg.author.id === msg.guild.ownerID){
        if(config.create_roomVoiceChannel){
          config.create_roomVoiceChannel = 0;
        }else{
          var channel = msg.guild.channels.cache.array().filter(ch => ch.name === tokens[1]);
          if(channel.length===1){
            channel = channel[0];
            config.create_roomVoiceChannel = channel.id;
          }else{
            msg.channel.send("Invalid channel");
          }
          //console.log(channel);
        }
      }else{
        msg.channel.send("You don't have permission for this command");
      }
    }else if(tokens[0]===prefix+"clean"){
      var n = Number(tokens[1]);
      if(tokens[1] !=null){
        n=(n?n>100?100:n:1);
        msg.channel.bulkDelete(n, true);
      } 
    }else if(tokens[0]===prefix+"alarms"){
      if(msg.channel.type==="dm"){
        if(tokens.length>=3){
          var hours = tokens[1].replace(/[a-zA-Z\W_]+/gi,"");
          var often = tokens[2].replace(/[a-zA-Z\W_]+/gi,"");
          //console.log(`${hours} hours, ${often} often in mins`);
          if(!hours || !often){
            msg.channel.send("Wrong args...dear((");
            return;
          }
          var id=msg.author.id;
          alarmsMembers[id]={"times": Math.floor(hours*60/often), "minBeforeSignal":often, "often":often, "message":(tokens.length>3?msg.content.split(" ").slice(3).join(' '):"Hello my dear, this a default reminder for you to have a pause in what you are doing")};
          //console.log(alarmsMembers[id]);
          msg.channel.send("Got it");
        }else if(tokens.length===2 && tokens[1]==="off"){
          delete alarmsMembers[msg.author.id];
          msg.channel.send("removed from the stack");
        }else{
          msg.channel.send("Invalid args...dear(\n//use it in direct messages, bot sends you in DM your custom message or default message every <number of minutes> during some <number of hours> you mentioned");
        }
        //console.log(msg.author.id);
      }else{
        msg.channel.send("My dear, you can only use this command in direct messages, so don't interupt others)thank you");
      }
    }//next command
    
  }


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
  if(msg.channel.type==="text" && msg.mentions.members.array().length > 0 && !msg.author.equals(client.user)){
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
//cd ~/d*/A* ; nodemon --inspect index.js --ignore magic.json
