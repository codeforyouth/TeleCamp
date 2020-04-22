// Express
const express = require('express');
const sass = require('node-sass-middleware');
const path = require('path');
const app = express();

// dummy data （ここからハードコード） ----->

// ユーザ情報（自動生成のID、ユーザ名、アイコンの情報を持つ）
var dummyUserData = {};

// 部屋のレイアウト
// https://drive.google.com/open?id=13unkBri3d6gXs1zbgglELgG50HspY4oZlyUanZlhRLQ
var dummyMapLayout = [
  [-1,-1,-1,-1,-9,-2,-2,-2,-2,-2,-2,-5,-2,-2,-2,-2,-2,-2,-5,-2,-2,-2,-2,-2,-2,-5,-2,-2,-2,-2,-2,-10,-1,-1],[1,-1,1,-1,-3,-1,-1,-1,-1,-1,-1,-3,-1,-1,-1,-1,-1,-1,-3,-1,-1,-1,-1,-1,-1,-3,-1,-1,-1,-1,-1,-3,-1,16],[-13,-1,1,-1,-3,-1,5,-13,-13,5,-1,-3,-1,9,-13,-13,9,-1,-3,-1,10,-13,-13,10,-1,-3,-1,-1,11,-1,-1,-3,-1,16],[1,-1,1,-1,-3,-1,5,-13,-13,5,-1,-3,-1,9,-13,-13,9,-1,-3,-1,10,-13,-13,10,-1,-3,-1,11,-13,11,-1,-3,-1,16],[-1,-1,-1,-1,-3,-1,5,-13,-13,5,-1,-3,-1,9,-13,-13,9,-1,-3,-1,10,-13,-13,10,-1,-3,-1,-1,11,-1,-1,-3,-1,16],[-1,-1,-1,-1,-3,-1,-1,-1,-1,-1,-1,-3,-1,-1,-1,-1,-1,-1,-3,-1,-1,-1,-1,-1,-1,-3,-1,-1,-1,-1,-1,-3,-1,-1],[2,-1,2,-1,-4,-2,-2,-2,-2,-5,-2,-7,-2,-2,-2,-2,-2,-2,-7,-2,-2,-2,-2,-2,-2,-8,-2,-2,-2,-2,-2,-6,-1,-1],[-13,-1,2,-1,-3,-1,-1,-1,-1,-3,-1,-13,-13,-13,-1,-1,-2,-2,-2,0,-1,-13,-13,-13,-1,-3,-1,-1,-1,-1,-1,-3,-1,17],[2,-1,2,-1,-3,-1,6,6,-1,-3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-3,-1,-1,12,-1,-1,-3,-1,17],[-1,-1,-1,-1,-3,-1,-13,-13,-1,-3,-1,0,0,0,-1,-1,-1,-1,-1,-1,-1,0,0,0,-1,-3,-1,12,-13,12,-1,-3,-1,17],[-1,-1,-1,-1,-3,-1,-13,-13,-1,-3,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-3,-1,-1,12,-1,-1,-3,-1,17],[3,-1,3,-1,-3,-1,6,6,-1,-3,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-3,-1,-1,-1,-1,-1,-3,-1,-1],[-13,-1,3,-1,-3,-1,-1,-1,-1,-3,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-4,-2,-2,-2,-2,-2,-6,-1,-1],[3,-1,3,-1,-4,-2,-2,-2,-2,-6,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-3,-1,-1,-1,-1,-1,-3,-1,18],[-1,-1,3,-1,-3,-1,-1,-1,-1,-3,-1,-1,0,0,0,0,0,0,0,0,0,0,0,-1,-1,-3,-1,-1,14,-1,-1,-3,-1,18],[-1,3,-13,-1,-3,-1,7,7,-1,-3,-1,-1,0,0,0,0,0,0,0,0,0,0,0,-1,-1,-3,-1,14,-13,14,-1,-3,-1,18],[-1,-1,-1,-1,-3,-1,-13,-13,-1,-3,-1,-1,-1,-1,0,0,0,0,0,0,0,-1,-1,-1,-1,-3,-1,-1,14,-1,-1,-3,-1,18],[-1,-1,-1,-1,-3,-1,-13,-13,-1,-3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-3,-1,-1,-1,-1,-1,-3,-1,-1],[4,4,-13,-1,-3,-1,7,7,-1,-4,-2,-2,-2,-2,-2,-2,-5,-2,-2,-2,-2,-2,-2,-2,-2,-8,-2,-2,-2,-2,-2,-6,-1,-1],[-1,-1,4,-1,-3,-1,-1,-1,-1,-3,-1,-1,-1,-1,-1,-1,-3,-1,-1,-1,-1,-1,-1,-1,-1,-3,-1,-1,-1,-1,-1,-3,-1,19],[-1,-1,-1,-1,-12,-2,-2,-2,-2,-6,-1,8,-13,-13,8,-1,-3,-1,-1,13,13,13,13,-1,-1,-3,-1,-13,15,15,-1,-3,-1,19],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-3,-1,8,-13,-13,8,-1,-3,-1,13,-13,-13,-13,-13,13,-1,-3,-1,15,-1,-1,-1,-3,-1,19],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-3,-1,8,-13,-13,8,-1,-3,-1,13,-13,-13,-13,-13,13,-1,-3,-1,15,-1,-1,-1,-3,-1,19],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-3,-1,8,-13,-13,8,-1,-3,-1,-1,13,13,13,13,-1,-1,-3,-1,-13,15,15,-1,-3,-1,19],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-3,-1,-1,-1,-1,-1,-1,-3,-1,-1,-1,-1,-1,-1,-1,-1,-3,-1,-1,-1,-1,-1,-3,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-12,-2,-2,-2,-2,-2,-2,-7,-2,-2,-2,-2,-2,-2,-2,-2,-7,-2,-2,-2,-2,-2,-11,-1,-1]
];

// 会議システムのURL（zoom, meet, skype とか？）
var dummyMeetLinks = [
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx",
  "https://meet.google.com/xxxxxxxxxxx"
];

// 座席情報（誰がどこに座ってるかの情報はココに持つようになっている）
var dummySeatsData = {};

for(let r in dummyMapLayout) {
  for(let c in dummyMapLayout[r]){
    let componentID = dummyMapLayout[r][c];
    if(componentID >= 0) {
      dummySeatsData[r+"-"+c] = { meetLink: dummyMeetLinks[componentID], seatedUserID: undefined };
    }
  }
}

// <----- dummy data （ココまでハードコード）


// ejs 
app.set("view engine", "ejs");

// sass
app.use(sass({
  root: path.join(__dirname, '/static/'),
  src: '_sass',
  dest: 'css',
  debug: true,
  force: true,
  outputStyle: 'compressed',
  prefix: '/css'
}));

// static
app.use(express.static('static'));
app.use('/static', express.static(path.join(__dirname, '/static')));


const server = app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
})
 
app.get('/', function(req, res){
  res.render('index', {});
});

app.get('/users', function(req, res) {
  console.log(dummyUserData);
  res.json(dummyUserData);
});

app.get('/seats', function(req, res) {
  console.log(dummySeatsData);
  res.json(dummySeatsData);
});

// ↓ここからSocketIOの処理
const io = require('socket.io')(server);
 
io.on('connection', function(socket) {
  console.log(`a user connected[id:${ socket.id }]`);

  socket.on('UPDATE_USER', function(data) {
    console.log(`new user [uid: ${ data.uid }, userName: ${ data.userName }, userIcon: ${ data.userIcon }`);
    dummyUserData[data.uid] = { userName: data.userName, userIcon: data.userIcon };
    console.log(dummyUserData);
    io.emit('UPDATE_USER_STATUS', data);
  });

  socket.on('POST_MESSAGE', function(data) {
    console.log(`posted[name:${ data.name },message:${ data.message }]`);
    io.emit('MESSAGE', data);
  });

  socket.on('TAKE_SEAT', function(data) {
    let uid = data.uid;
    let current_pos = data.c_pos;
    let next_pos = data.row + "-" + data.col;
    
    console.log(`TAKE_SEAT { uid : ${uid}, current_pos: ${current_pos}, next_pos : ${next_pos} }`);

    let response = [];
    response.push({ flg: true,  uid: uid, sid: next_pos });
    dummySeatsData[next_pos].seatedUserID = uid;
    if(current_pos != undefined) {
      dummySeatsData[current_pos].seatedUserID = undefined;
      response.push({ flg: false, uid: uid, sid: current_pos});
    }

    io.emit('UPDATE_SEAT_STATUS', response);
  });

})
