var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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
  ole.log(`Logged in as ${
  client.user.tag}!`);
   85   //help = readFilePromise('https://raw.githubusercontent.com/ar2rworld/ArturBot/master/help.txt');
    86   console.log(help);
     87 });

  }et out =[];
  readable.on('readable', function() {
    var chunk;
    console.log('sb in readable: ' + sb);
    while (null !== (chunk = readable.read(1) )) {
      if(chunk == '\n'){
        out.push("\n"); //sb.append("\n");
      }else{
        out.push(chunk);
        //console.log(chunk);
      }
    }
    console.log("in listener:\n" + out.join(''));
  });
  console.log(out.join(''));
  return sb.join('');//sb.build();
}
*/
//let help = readFile('help.txt');
function readFileFromWebsite(url){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = "text";
    xhr.send();
    var out = "Error occured while loading file from: '" + url + "'";
    xhr.onload = function() {
      if (xhr.status != 200) { // analyze HTTP status of the response
        console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
      } else { // show the result
        console.log(`${xhr.responseText}`); // response is the server response
        out = xhr.responseText;
        return out;
      }
    };
    return out;
}
let readFilePromise = url => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
                console.log("rfp:" + xhr.responseText);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
    });
};
//const help = readFileFromWebsite('https://raw.githubusercontent.com/ar2rworld/ArturBot/master/help.txt');
async function asyncCallReadFilePromise(){
  console.log('calling');
  let result = await readFilePromise('https://arturlinnik.000webhostapp.com/help.txt').then(d => console.log("d:" + d));
  help = result;
  console.log('result: ' + help);
}
//asyncCallReadFilePromise();
let help = "";
function asyncTxt(){
  return new Promise((resolve, reject) =>{
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "https://arturlinnik.000webhostapp.com/help.txt");
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      resolve(xhr.responseText);
      //console.log("In txt rfp:" + xhr.responseText);
    } else {
      reject(xhr.statusText);
    }
  };
  xhr.onerror = () => reject(xhr.statusText);
  xhr.send();
}).then(v => {
  help = v;
  console.log("v: " + v.length);
});
}
async function asyncCall(){
  help = await asyncTxt();
  console.log(" : " + help) ;
}
asyncCall();
