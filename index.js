const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs'); //readFile function 
var StringBuilder = require('stringbuilder');

/*Used methods:*/
const getASCIIsum = (s) =>{
  return s.toLowerCase().split('').reduce( (t, c) => t + c.charCodeAt(0),0);
}
/*const readFile = (file) => {
  var output = "";
  fs.readFile(file,(err, data) => { 
    if (err) throw err;
    temp = data.toString().split('\n');
    var i=0;
    for(i=0; i<temp.length; i+=1){
      output += temp[i] + "\n";
    }
    //output = data.toString();
  });
  console.log(output);
  return output;
}*/
/*
const readFile = (f) =>{
  var readable = fs.createReadStream(f, {
    encoding: 'utf8',
    fd: null,
  });
  //var sb = new StringBuilder();
  var sb = ['1'];
  readable.on('readable', function() {
    var chunk;
    var out =[];
    console.log('sb in readable: ' + sb);
    while (null !== (chunk = readable.read(1) )) {
      if(chunk == '\n'){
        out.push("\n"); //sb.append("\n");
      }else{
        out.push(chunk);
        //console.log(chunk);
      }
    }
    return out;
  });
  console.log('sb: ' + sb);
  console.log(sb.join(''));
  return sb.join('');//sb.build();
}
*/

/*Main functionality*/
//number game variables:
let gameStatus = false;
let number = 0;
let attempts = 0;

//bot vars
const prefix = '!@';
const help = "Hey my friend, Commands I have for now:\n!@isthebest <name>\n!@number <your number>\n!@match <name1> <age1> <or any other attributes> <name2> <age2> <or any other attributes>\n!@happy-birthday <name>\nThanks to Artur,Aman(they are real sweet hearts)\nv0.01\nhttps://github.com/ar2rworld/ArturBot/blob/master/index.js\n\n\nArtur DELETE THE SERVER SO it does not have all the functionality\nupdated functionality:\n!@changeAva\n!@isTheBest <name>\n!@number //Guess my number in range of [0, 99]\n->!@number <your number> //replies you if number is bigger or smaller\n->!@number new //new game";

//let help = readFile('help.txt');
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
//console.log("Hmmm, My reseach showed that you are on " + "33" + "% best" + (true === true?"22":". Congrats!"));
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
        const val = getASCIIsum(tempInp[1]) % 100;
        let ext = "";
        ext = "I'm so sorry, my friend, but you suck 	(͡ ° ͜ʖ ͡ °) ."; 
        msg.reply("Hmmm, My reseach showed that you are on " + val + "% best" + (val < 10 ? ext:". Congrats!"));
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
    }
  }

  
  if(inp.indexOf('arturbot')>=0 && !msg.client.user.equals(client.user)){
    msg.reply(help);
  }
});
client.login(config.token);
//nodemon --inspect index.js
