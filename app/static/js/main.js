var socket = io();

Vue.use(VueLazyload);

var app = new Vue({
  el: '#app',
  data: {
    // user
    userID: "anonymous",
    userName: "anonymous",
    userIcon: "img/user-icon-default.png",
    users: {},
    // map
    layout: [],
    seats: {},
    mySeat: undefined,
    mapContentStyle: {
      width: '0px',
      height: '0px',
      top: '0px',
      left: '0px'
    },
    mapContentPos: {
      x: 20,
      y: 20,
    },
    touchPrevPos: {
      x: 0,
      y: 0,
    },
    isMapMousedown: false,
    isSeatMouseDown: false,
    // modal
    isModalShown: false,
    modalMode: 0,
    settingModalTitle: "",
    // meet
    meetLink: undefined,
    isMeetLinkAvailable: false,
    // chat
    textInput: '',
    messages: [],
  },
  methods: {
    getParams() {
    },
    loadPage() {
      this.checkUserID();
      this.initMap();
      this.getUsers();
      this.getSeatStatus();
    },
    checkUserID() {
      let cookie = document.cookie.split(';').filter((item) => item.trim().startsWith('user_id='));
      if (cookie.length) {
        this.userID = cookie[0].split('=')[1];
        console.log("cookie (userID): " + this.userID);
      } else {
        this.userID = generateUserID((new Date()).getTime());
        var expDate = new Date('2100/1/1 9:00'); // 2100年まで有効
        document.cookie = "user_id=" + this.userID + "; expires=" + expDate.toUTCString();
        console.log("cookie (userID): not exists => generage new ID (" + this.userID + ")");
        this.updateMyUserInfo();
      }
      this.showModal(0);
    },
    async getUsers() {
      await axios
        .get('/users')
        .then(function(response) {
          console.log("getUsers() completed");
          this.users = Object.assign({}, this.users, response.data);
          console.log(this.users);
          console.log(this.userID);
          if(this.users[this.userID]) {
            this.userName = this.users[this.userID].userName;
            this.userIcon = this.users[this.userID].userIcon;
            console.log("name: " + this.userName + "\ticon: " + this.userIcon);
          }
        }.bind(this));
    },
    updateMyUserInfo() {
      socket.emit('UPDATE_USER', { uid: this.userID, userName: this.userName, userIcon: this.userIcon });
    },
    initMap() {
      // TODO: 今は layout.js から取ってきてるので、API化したい。
      //       SpreadSheetからダイレクトに取ってこれると素晴らしい
      this.layout = layout;
      console.log(layout);
      if(this.layout != undefined) {
        this.mapContentStyle.height = this.mapContentHeight + 'px';
        this.mapContentStyle.width = this.mapContentWidth + 'px';
      }
      this.initMapContentPosition();
    },
    initMapContentPosition() {
      var ww = document.getElementById("map").clientWidth;
      var wh = document.getElementById("map").clientHeight;

      this.mapContentPos.x = (ww - this.mapContentWidth - 100.0)/2; // 50 = .map-content の padding
      this.mapContentPos.y = (wh - this.mapContentHeight - 100.0)/2; // 50 = .map-content の padding

      console.log("w: " + this.mapContentWidth + "\th:" + this.mapContentHeight + "\tww:" + ww + "\twh:" + wh + "\tpos.x:" + this.mapContentPos.x + "\tpos.y:" + this.mapContentPos.y);

      this.updateMapContentPosition();
    },
    updateMapContentPosition() {
      this.mapContentStyle.left = this.mapContentPos.x + 'px';
      this.mapContentStyle.top = this.mapContentPos.y + 'px';
    },
    getCellClass(cell) {
      if(cell < 0) {
        return "map-cell-p" + Math.abs(cell);
      } else {
        return "map-cell-seat map-cell-c" + cell;
      }
    },
    async getSeatStatus() {
      await axios
        .get('/seats')
        .then(function(response) {
          console.log("getSeatStatus() completed");
          this.seats = Object.assign({}, this.seats, response.data);
          console.log(this.seats);
        }.bind(this));
    },
    getSeatID(r, c) {
      return r + "-" + c;
    },
    checkMySeat(sid, seatedUserID) {
      if(seatedUserID == this.userID) {
        this.mySeat = sid;
        this.isMeetLinkAvailable = this.seats[sid].meetLink != undefined;
        if(this.isMeetLinkAvailable) {
          this.meetLink = this.seats[sid].meetLink;
        }
      }
    },
    isSeated(cell, r, c) {
      if(cell >= 0) {
        let sid = this.getSeatID(r, c);
        if(this.seats[sid]) {
          let uid = this.seats[sid].seatedUserID;
          if(uid && this.users[uid]) {
            return true;
          }
        }
      }
      return false;
    },
    getSeatedUserIcon(cell, r, c) {
      if(cell >= 0) {
        let sid = this.getSeatID(r, c);
        if(this.seats[sid]) {
          let uid = this.seats[sid].seatedUserID;
          this.checkMySeat(sid, uid);
          if(uid && this.users[uid]) {
            return this.users[uid].userIcon;
          }
        }
        return "";
      }
      return "";
    },
    takeSeat(cell, r, c) {
      if(cell >= 0 && !this.isSeated(cell, r, c)) {
        var takeSeatRequest = {
          uid: this.userID,
          row: r,
          col: c,
          c_pos: this.mySeat,
        }
        console.log(takeSeatRequest);
        socket.emit('TAKE_SEAT', takeSeatRequest);
      }
    },
    touchstart: function(e){
      if(e.target.classList.contains("map-cell-seat")) {
        this.isSeatMouseDown = true;
      } else {
        this.startMove(e);
      }
    },
    startMove: function(e) {
      if(e != undefined) {
        document.getElementById("map").classList.add("moving");
        this.isSeatMouseDown = false;
        this.isMapMousedown = true;
        this.isSeatMousedown = true;
        this.touchPrevPos.x = e.clientX;
        this.touchPrevPos.y = e.clientY;
      }
    },
    touchmove: function(e){
      if(this.isSeatMouseDown) {
        this.startMove(e);
      } else if(this.isMapMousedown && e.target.id === "map"){
        // 前回座標との差分を算出
        this.mapContentPos.x += (e.clientX - this.touchPrevPos.x) * 2;
        this.mapContentPos.y += (e.clientY - this.touchPrevPos.y) * 2;
        this.updateMapContentPosition();
        // 前回のクリック座標を更新
        this.touchPrevPos.x = e.clientX;
        this.touchPrevPos.y = e.clientY;
      }
    },
    touchend: function(e){
      if(e.target.classList.contains("map-cell-seat")) {
        this.isSeatMouseDown = false;
      } else {
        this.isMapMousedown = false;
        document.getElementById("map").classList.remove("moving");
      }
    },
    showModal(mode) {
      switch(mode) {
        case 0:
          this.settingModalTitle = "Welcome to TeleCamp!";
          break;
        case 1:
          this.settingModalTitle = "Settings";
          break;
        default:
          this.settingModalTitle = "Other modal";
      }
      this.isModalShown = true;
      document.getElementById("app").classList.add("modal-mode");
    },
    hideModal() {
      this.isModalShown = false;
      document.getElementById("app").classList.remove("modal-mode");
      this.updateMyUserInfo();
    },
    changeUserIcon() {
      let newUserIcon = window.prompt("アイコンのURLを入れてください（コレは暫定機能です）", "");
      if(newUserIcon != undefined) {
        this.userIcon = newUserIcon;
      }
    },
    changeUserName() {
      let newUserName = window.prompt("ユーザ名を入れてください（コレは暫定機能です）", "");
      if(newUserName != undefined) {
        this.userName = newUserName;
      }
    },
    sendMessage(e) {
      e.preventDefault();
      socket.emit('POST_MESSAGE', this.textInput);
      this.textInput = '';
    }
  },
  computed: {
    mapContentWidth: function() {
      if(this.layout != undefined) {
        return this.layout[0].length * 30;
      }
      return 0;
    },
    mapContentHeight: function() {
      if(this.layout != undefined) {
        return this.layout.length * 30;
      }
      return 0;
    }
  },
  mounted(){

    socket.on('MESSAGE',function(msg){
      console.log("received[MESSAGE] ↓");
      console.log(msg);
      this.messages.push(msg);
    }.bind(this));

    socket.on('UPDATE_USER_STATUS', function(msg){
      console.log("received[UPDATE_USER_STATUS] ↓");
      console.log(msg);
      this.$set(this.users, msg.uid, { userName: msg.userName, userIcon: msg.userIcon })
    }.bind(this));

    socket.on('UPDATE_SEAT_STATUS', function(msg){
      console.log("received[UPDATE_SEAT_STATUS] ↓");
      console.log(msg);
      for(let i in msg){
        let flag = msg[i].flg;
        let seatedUserID = msg[i].uid;
        let updatedSeatID = msg[i].sid;
        if(flag) {
          this.checkMySeat(updatedSeatID, seatedUserID);
          this.$set(this.seats[updatedSeatID], "seatedUserID", seatedUserID);
        } else {
          this.$set(this.seats[updatedSeatID], "seatedUserID", undefined);
        }
      }

      console.log("this.users ↓");
      console.log(this.users);
      console.log("this.seats ↓");
      console.log(this.seats);

    }.bind(this));

  }
});

app.loadPage();

