exports.divideUs=async(users,groups,channel,redis, msg)=>{
  redis.incr("divideus_command");
  var usersClone=users.clone()
  for(let i=0; i<groups.length; i+=1){
    //console.log(i);
    if(Number(groups[i])>0){
      //users.
      var tempUsers=new Map()
      for(let j=0; j<groups[i]; j+=1){
        var tempUser=usersClone.randomKey()
        tempUsers.set(tempUser,usersClone.get(tempUser))
        usersClone.delete(tempUser)
        //console.log("n of users after removing: " +usersClone.size)
        if(usersClone.size===0){
          i=groups.length
          j=groups[i]
          //console.log("no users to divide left")
        }
      }
      //console.log("tempUSers before:")
      //tempUsers.forEach(u=>console.log(u.user.username))
      //console.log("Channel create with users:" +tempUsers.length)
      await channel.clone({"name" : "tempChannel"}).then(guildCh =>{
        redis.pushToList("tempVoiceChannelIDs", guildCh.id)
        //console.log("tempUSers inside:")
        tempUsers.forEach(u=>console.log(u.user.username))
        tempUsers.forEach(user1=>{
          user1.edit({"channel":guildCh.id}).then(r=>{
              if(r){
                //console.log("editted: " +r.voice.channel.name);
              }else{
                console.log("something wrong with editting");
              }
              }).catch(r=>console.log(r))
          //console.log(user1.user.username +" in group " + i)
        })
      });
    }else{
      console.log("Invalid input!")
      msg.channel.send("Invalid input=(")
    }
  }
}
