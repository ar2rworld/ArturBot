const Discord = require('discord.js');
const client = new Discord.Client();
const { MessageAttachment } = require('discord.js');
const config = require('./config.json');
const fs = require('fs'); //readFile function 
//var StringBuilder = require('stringbuilder');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const request = require('request')
const { exec } = require("child_process");

const redis=require( './connectRedis.js');
const divideusTest=require("./divideusTest.js");
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
let help = "Hello dear, my creators moved docs here https://github.com/ar2rworld/ArturBot";
let autoreplyFileExists = false;
let magicEnabledServer = false;
let alarmsMembers={};
let tempVoiceChannelIDs=[];
var redisConnected=false;
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(help);
  redis.checkR().then(r=>{
    console.log(r+ " redisConnected");
    if(r==="PONG"){
      client.user.setActivity("redis connected", {type : "PLAYING"}).then(p => console.log("Activity set to " + p.activities[0].name));
      redisConnected=true;
    }
      }).catch(r=>{
        console.log(r + " catch redis is not Connected");
      redisConnected=false;
      client.user.setActivity("redis is not connected", {type : "PLAYING"}).then(p => console.log("Activity set to " + p.activities[0].name));
        });
  //console.log(client.guilds.cache.get("736262572076040322").members);
  //magic

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

  //console.log(client.guilds.cache.array()[1].channels.cache.array()); //[1]
  //client.guilds.cache.fetch()
  
  //Monitoring of RAM in bot activity
  client.setInterval(()=>{
    exec("free -m", (error, stdout, stderr) =>{
    if(!error){
      let out=stdout.split("         ");
      let act=(out.slice(3,5) + "~"+ out.slice(9,11))
      client.user.setActivity(act+"/r"+(redisConnected?"+":"-"), {type : "PLAYING"})
    }
  })
  }, 60000);
});

//check member joining specific voice channel to create a new room
//https://discord.js.org/#/docs/main/stable/typedef/GuildMemberEditData
client.on('voiceStateUpdate', (oldS, newS) =>{
  //console.log( newS.channelID);
  if(newS.channelID!==null){
  redis.containsInList("create_room_channels", newS.channelID).then(r=>{
        if(r!==null){
          redis.incr("create_room_channels_created");
          newS.channel.clone({"name":(newS.member.nickname?newS.member.nickname:newS.member.user.username) + "'s room"}).then(guildCh =>{
            redis.pushToList("tempVoiceChannelIDs", guildCh.id);
            guildCh.overwritePermissions([{id:newS.member.user.id, allow: ["MOVE_MEMBERS","KICK_MEMBERS", "ADMINISTRATOR", "MANAGE_CHANNELS"]}]);
            newS.member.edit({"channel":guildCh.id});
          });
        }
  });
  }
  if(oldS.channel!=null && oldS.channel.members.array().length === 0){
    redis.containsInList("tempVoiceChannelIDs", oldS.channel.id).then(r=>{
      if(r!==null){
        oldS.channel.delete("REDISpart: cleaning up...(No users in the channel)").then(console.log(oldS.channel.name + " deleted.")).catch(err=>{oldS.guild.systemChannel.send("Error occured while deleting the channel:\n"+err)});
        redis.removeFromList("tempVoiceChannelIDs", oldS.channel.id);
      }
    }).catch(r=>{
      console.log("redis error:291\n" + r);
    });
  }
  //###redis
  //console.log(newS);
});

client.on('message',async msg => { 
  magicEnabledServer = msg.channel.type==="text"?config.magicEnabledServers.includes(msg.guild.id):0;
  const inp = msg.content.toLowerCase();
  if(inp.startsWith(prefix)){ 
    var tokens = inp.split(" ");
    if(tokens[0] === prefix+"help"){
      if(redisConnected)redis.incr("help_command");
      msg.reply(help);
    }else if(tokens[0] === prefix+"changeava"){
      if(redisConnected)redis.incr("changeave_command");
      client.user.setAvatar('https://random-d.uk/api/randomimg').then(msg.reply('Image is set, my friend, it is always good to have something dynemic =)')).catch(console.error);
    }else if(tokens[0] === prefix+"isthebest"){
      if(redisConnected)redis.incr("isthebest_command");
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
      if(redisConnected)redis.incr("number_command");
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
    }else if(tokens[0] === prefix+"autoreply"){
      if(redisConnected)redis.incr("autoreply_command");
      //console.log(msg.author.id + " " + msg.author.username);
      if(redisConnected){
        const temp = tokens;
        redis.containsInList("autoreply", msg.author.id).then(r=>{
              if(r!==null){
                if(temp.length===1){
                  msg.channel.send("I see your command and your id in my log, please check the !@help");
                }else if(temp.length===2){
                  if(temp[1]==="off"){
                    redis.removeFromList("autoreply",msg.author.id).then(r=>{
                      msg.channel.send("You autoreply status is off now.");
                    });
                  }else{
                    redis.setValue(msg.author.id+"_autoreply",temp[1]);
                    msg.channel.send("You autoreply message(word) updated");
                  }
                }else{
                  redis.setValue(msg.author.id+"_autoreply", msg.content.split(" ").slice(1).join(" "));
                  msg.channel.send("You autoreply message updated");
                }
              }else{
                redis.pushToList("autoreply", msg.author.id);
                if(temp.length===1){
                  redis.setValue(msg.author.id+"_autoreply", "Hello, this is a default autoreply message, have a nice day!");
                  msg.channel.send("You autoreply created and is working now");
                }else{
                  redis.setValue(msg.author.id+"_autoreply", msg.content.split(" ").slice(1).join(" "));
                  msg.channel.send("You autoreply custome message created");
                }
              }
            });
      }else{
        msg.channel.send("redis disconnected(");
      }
    }else if(tokens[0] === prefix+"meme"){
      if(redisConnected)redis.incr("meme_command");
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
      if(redisConnected)redis.incr("rip_command");
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
      if(redisConnected)redis.incr("magic_command");
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
      if(redisConnected)redis.incr("love_command");
      const a ="💋 💋 💋 💋 💋 💋 💋 💋 💋 💋 💋 💌 💌 💌 💌 💌 💌 💌 💌 💌 💌 💌 💘 💘 💘 💘 💘 💘 💘 💘 💘 💘 💘 💝 💝 💝 💝 💝 💝 💝 💝 💝 💝 💝 💖 💖 💖 💖 💖 💖 💖 💖 💖 g 💖 💗 💗 💗 💗     💗 💗 💗 💗 💗 💗 💓 💓 💓 💓 💓 💓 💓 💓 💓 💓 💓 💓 💞 💞 💞 💞 💞 💞💞 💞 💞 💞 💕 💕 💕 💕 💕 💕 💕 💕 💕 💕 💕 💟 💟 💟 💟 💟 💟 💟 💟 💟 💟 ❣ ❣ ❣ ❣ ❣ ❣ ❣ ❣ 💔 💔 💔 💔 💔     💔 💔 💔 💔 💔 💔 🔥 🔥 ⊛"
      b = a.split(" ");
      msg.channel.send(b[Math.floor(Math.random()*b.length)]);
    }else if(tokens[0]===prefix+"clean"){
      if(redisConnected)redis.incr("clean_command");
      var n = Number(tokens[1]);
      if(tokens[1] !=null){
        n=(n?n>100?100:n:1);
        msg.channel.bulkDelete(n, true);
      } 
    }else if(tokens[0]===prefix+"alarms"){
      if(msg.channel.type==="dm"){
        if(redisConnected)redis.incr("alarms_command");
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
        if(redisConnected)redis.incr("else_statement_reached_command");
        msg.channel.send("My dear, you can only use this command in direct messages, so don't interupt others)thank you");
      }
    }else if(tokens[0]===prefix+"create_room"){
        if(redisConnected)redis.incr("create_room_command");
        //redis.containsInList("create_room_channels", newS.channelID).then(r=>{
        //redis.containsInList("tempVoiceChannelIDs", old.channel.id).then(r=>{
        //console.log(tokens[1])
        let channels=msg.guild.channels.cache.array().filter(c =>c.name === msg.content.split(" ").slice(1).join(" "))
        if(channels.length!=1 || channels[0].type!=="voice" || msg.member.hasPermission("MANAGE_CHANNELS")===false){
          msg.channel.send("Invalid channel(one channel case sensative name, type === voice, manage channels permission)");
          return
        }else{
          redis.containsInList("create_room_channels", channels[0].id).then(r=>{
              if(r===null){
                redis.pushToList("create_room_channels", channels[0].id);  
                msg.channel.send("Pushed to the stack(didn't check promise)");
              }else{
                redis.removeFromList("create_room_channels", channels[0].id);
                msg.channel.send("Poped out from the stack(didn't check promise)");
              }
            });
        }
    }//next command
    else if(tokens[0]===prefix+"divideus"){
      if(tokens.length>1){
        var users=msg.channel.members
        var groups=tokens.slice(1)
        var channel=msg.guild.members.fetch(msg.author.id).voice.channel
        divideusTest.divideUs(users.groups, channel, redis, msg)
      }else{
        msg.channel.send("Invalid args")
      }
    }else{
      msg.channel.send("I see that you trying to talk to me, but I'm talking in JS and you are in C++");
    }
    
  }
  if(msg.channel.type === "text" && !msg.author.equals(client.user) && msg.mentions.members.array().length > 0){
    //console.log(msg.author.id + " " + msg.author.discriminator + " "); 
    const mentionedIDs = msg.mentions.members.array();
    for(let i=0; i < mentionedIDs.length; i+=1){
      const userID = mentionedIDs[i].user.id;
      redis.containsInList("autoreply", userID).then(r=>{
            if(r!==null){
              redis.getValueP(userID+"_autoreply").then(r=>{
                    msg.channel.send( "Autoreply from " + mentionedIDs[i].user.username + ":\n" + r);
                  });
            }
          });
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
