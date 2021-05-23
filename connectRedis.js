const redis = require('redis');
const client = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
});
client.on('error', err => {
  console.log('Error ' + err);
});
module.exports ={
  incr:(key)=>{
         client.incr(key);
  },
  setValue:(key, value)=>{
    client.set(key, value, (err, reply) => {
        if (err){
          throw err;
          //return err;
        }
        //console.log(reply);
        return reply;
        //client.get('foe', (err, reply) => {
        //    if (err) throw err;
        //    console.log(reply);
        //});
    });
  },
  getValue:(key)=>{
      client.get(key, (err, reply)=>{
        if (err){
          throw err;
          //return err;
        }
        //console.log(reply);
        return reply;
      });
  },
  checkR:()=>{
              return new Promise((res,rej)=>{
                  client.send_command("PING",(err, reply)=>{
                    if(!err){
                            res(reply);
                          }else{
                            rej(err);
                          }
                        });
                      });
            },
  getValueP:(key)=>{
              return new Promise((res,rej)=>{
                    client.get(key, (err, reply)=>{
                          if(!err){
                            res(reply);
                          }else{
                            rej(err);
                          }
                        });
                      });
            },
   pushToList:(listName, key)=>{
    return new Promise((res, rej)=>{
          client.lpush(listName, key, (err, reply)=>{
                if(!err){
                  res(reply);
                }else{
                  rej(err);
                }
              });
          });
    }
  ,loadList:(listName)=>{
    return new Promise((res, rej)=>{
          client.lrange(listName, "0","-1", (err, reply)=>{
                if(!err){
                  res(reply);
                }else{
                  rej(err);
                }
              });
        });
  },
  containsInList:(listName, key)=>{
             return new Promise((res, rej)=>{
                client.lpos(listName, key, (err, reply)=>{
                      if(!err){
                        res(reply);
                      }else{
                        rej(err);
                      }
                    });
                 });
           },
   removeFromList:(listName, key)=>{
             return new Promise((res, rej)=>{
                client.lrem(listName,"1", key , (err, reply)=>{
                      if(!err){
                        res(reply);
                      }else{
                        rej(err);
                      }
                    });
                 });
               }
// {"users":{"635901894824558602":{"status":"on","message":"Im done with finals, but not sure if Im currently not coding or looking for a job"}}}

};
f =async () =>{
  /*console.log(await module.exports.setValue("a", "2"));
  console.log(await module.exports.getValue("a"));
  module.exports.getValueP("a").then(r=>{
      console.log("P : " + r);
      }).catch(r=>{
        console.log("P !: " +r);
        });
  module.exports.checkR().then(r=>{
      console.log("P check: " + r);
      }).catch(r=>{
        console.log("P check!: " +r);
        });

  module.exports.removeFromList("autoreply", "1").then(r=>{
      console.log("P lrem: " + r);
      }).catch(r=>{
        console.log("P lrem!: " +r);
        });
  module.exports.pushToList("autoreply", "1").then(r=>{
      console.log("P pushToList: " + r);
      }).catch(r=>{
        console.log("P pushToList!: " +r);
        });
  module.exports.containsInList("autoreply", "1").then(console.log);
  module.exports.loadList("autoreply").then(console.log);
  module.exports.containsInList("autoreply", "1").then(console.log);
  //console.log(module.exports.setValue("a", "4", c));
  //console.log(module.exports.getValue("a", c));
  console.log("end");*/
  module.exports.incr("max");
}
//f();
