const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
async function load(){
  var modelJSON = fs.readFileSync("model.json");
  //console.log(modelJSON);
  const model =  await tf.models.modelFromJSON(modelJSON); //await
  //model.summary();
}
load();