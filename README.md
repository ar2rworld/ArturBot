# ArturBot

## About

### ArturBot is made for fun, as sometimes you need to switch one programming to another one

### Discord.js bot

## Technologies

<ul>
<li>Node.js</li>
<ul>
<li>Discord.js</li>
</ul>
<li>Redis</li>
</ul>

## Commands

### Hey my friend, Commands I have for now:

```
!@help

!@changeAva

!@isTheBest <name>

!@number //Guess my number in range of [0, 99]
->!@number <your number> //replies you if number is bigger or smaller
->!@number new //new game

!@match <name1> <name2> [any optinal args]
!@happy-birthday <name>
!@autoreply //everytime anyone mentions your in the message, bot replies with default message
->!@autoreply //sets default message and status to ON
->!@autoreply off //changes your autoreply status to OFF
->!@autoreply <your message> //changes your autoreply message and sets status to \"on\"

!@meme //sends a meme from local storage
->!@meme //if picture is attached to the message it will be saved to the local storage
->!@meme <direct link to an image> //donwloads image from web into the storage, supports many links separated by single SPACE

[prefix] love //returns how much love u need
//Now you can server mute and kick another user from the voice channel...Magic
There is 5 conditions you need to keep in mind:
1)Server is magic enabled
2)You have a magic licence
3)You have enough mana
4)Skill you using is not in CD
5)User which is your target has a magic licence as well

//Magic commands
[prefix]magic <on/off> <Your magic name> //to get a licence
[prefix]k <tag user/users> //to kick user/users from the voice channel
[prefix]m  <tag user/users> //to server mute user
[prefix]um   <tag user/users> //to unmute user

[prefix]clean //cleans 1-100 last messages not older than two weeks

[prefix]room_for_user <name of the voice channel> //deprecated

[prefix]alarms <number of hours> <number of minutes> [you message(optional)] use it in direct messages, bot sends you in DM your custom message or default message every <number of minutes> during some <number of hours> you mentioned

[prefix]create_room <Name of channel (case sensitive)> //when user enters this channel bot creates a separate voice channel, moves him/her to the new room, if room ends on \"s room\" and has no users in it bot deletes the room
```

## Contributors

<ul>
  <li>Artur-ar2rworld</li>
  <li>Aman-???</li>
</ul>

## Run

```bash
nodemon index.js
```

## Docker

### Add ```.env``` file like:
```
redis_host=[host in network, "redis" in this case]
redis_port=[port to expose redis locally]
redis_port_container=6379
redis_volume=path/to/volume
```
### and ```config.json``` file with discord token

### Compose command
```bash
docker-compose --env-file .env up -d
```

v0.03

Thanks to Artur,Aman(they are real sweet hearts)
https://github.com/ar2rworld/ArturBot
