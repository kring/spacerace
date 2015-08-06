var zmq = require("zmq");

var gamesPlayed = 0;
module.exports.init = function(game, numberOfGames) {
    var socket = zmq.socket("req");
    socket.connect("tcp://10.0.0.236:5558");
    socket.monitor(500, 0);

    socket.on("connect", function(fd, ep) {
        console.log("connect, endpoint:", ep);
        socket.send(JSON.stringify({
            "name": "kring/yuri/john",
            "team": "we'll have to work on that"
        }));
    });

    socket.on("message", function(message) {
        console.log(message.toString());
        var lobbyInfo = JSON.parse(message.toString());
        var stateSocket = zmq.socket("sub");

        stateSocket.connect("tcp://10.0.0.236:5556");
        console.log("Subscribing to", lobbyInfo.game);
        stateSocket.subscribe(lobbyInfo.game);

        var controlSocket = zmq.socket("push");

        controlSocket.bindSync("tcp://127.0.0.1:8909");
        console.log("Bound to port 8909");

        game({
            setCommand: function(command) {
                var commandString = lobbyInfo.secret + "," + command.mainEngine + "," + command.rotation;
                controlSocket.send(commandString);
            },
            state: stateSocket,
            mapName: lobbyInfo.map
        });
    });
};
