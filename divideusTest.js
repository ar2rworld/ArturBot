//const users=['a','b','c', 'd', 'e', 'f', 'g' ]//'h', 'i', 'j', 'k', 'l', 'm', 'n'
//const groups=[2,2, "a", 2]
const swap=(i1, i2, arr)=>{ 
  var temp=arr[i1]
  arr[i1]=arr[i2]
  arr[i2]=temp
}
exports.divideUs=(users,groups,channel,redis, msg)=>{
  redis.incr("divideUs_command");
  for(let i=0; i<groups.length; i+=1){
    console.log(i);
    if(Number(groups[i])>0){
      //users.
      var tempUsers=[]
      for(let j=0; j<groups[i]; j+=1){
        var index=Math.floor(Math.random()*users.length)
        console.log("i: " +groups[i]+ " " +users[index])
        tempUsers.push(users[index])
        swap(index, users.length-1, users)
        users.pop()
        if(users.length===0)
          i=groups.length
      }
      //console.log("Channel create with users:" +tempUsers.length)
      channel.clone({"name" : i+"->tempChannel"}).then(guildCh =>{
        redis.pushToList("tempVoiceChannelIDs", guildCh.id)
        for(let userIndex=0; userIndex<tempUsers; userIndex+=1){
          tempUsers[userIndex].edit({"channel":guildCh.id})
        }
      });
    }else{
      //console.log("Invalid input!")
    }
  }
  /*for(let i=0; i<users.length; i+=1){
    console.log(users[i])
  }*/
}
//exports.divideUs(users, groups)