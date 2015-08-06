var zmq = require("zmq");
var socket = zmq.socket("req");

socket.on("connect", function(fd, ep) {
  console.log("connect, endpoint:", ep);
  socket.send(JSON.stringify({
    "name": "yuri",
    "team": "teamyes"
  }));
});
socket.on("message", function(message) {
  console.log(message.toString());
  var lobbyInfo = JSON.parse(message.toString());
  subscribeState(lobbyInfo.game);
  createContol(lobbyInfo.secret);
});

// socket.bindSync("tcp://10.0.0.236:8000");
socket.connect("tcp://10.0.0.236:5558");
socket.monitor(500, 0);

function subscribeState(gameName) {
  var stateSocket = zmq.socket("sub");

  stateSocket.connect("tcp://10.0.0.236:5556");
  console.log("Subscribing to", gameName);
  stateSocket.subscribe(gameName);
  stateSocket.on("message", function(topic, message) {
    console.log("topic", topic.toString());
    console.log("message", message.toString());
  });
}

function createContol(secret) {
  var controlSocket = zmq.socket("push");

  controlSocket.bindSync("tcp://127.0.0.1:8909");
  console.log("Bound to port 8909");

  setInterval(function() {
    // <yoursecretkey>,<main_engine>,<rotation>
    controlSocket.send(secret + ",1,1");
  }, 15);
}
