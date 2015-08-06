var zmq = require("zmq");

var gamesPlayed = 0;
module.exports.init = function(game, numberOfGames) {
  console.log('hi');
    var lobbySocket = zmq.socket("req");
    lobbySocket.connect("tcp://10.0.0.144:5558");
    lobbySocket.monitor(500, 0);

    var name = "yuri";

    lobbySocket.on("connect", function(fd, ep) {
        console.log("connect, endpoint:", ep);
        lobbySocket.send(JSON.stringify({
            "name": name,
            "team": "we'll have to work on that"
        }));
    });

    lobbySocket.on("message", function(message) {
        console.log(message.toString());
        var lobbyInfo = JSON.parse(message.toString());
        var stateSocket = zmq.socket("sub");

        stateSocket.connect("tcp://10.0.0.144:5556");
        console.log("Subscribing to", lobbyInfo.game);
        stateSocket.subscribe(lobbyInfo.game);

        var controlSocket = zmq.socket("push");

        // controlSocket.bindSync("tcp://10.0.0.144:5557");
        controlSocket.connect("tcp://10.0.0.144:5557");
        console.log("Bound to port 8909");

        var setCommand = function(command) {
            var commandString = lobbyInfo.secret + "," + command.mainEngine + "," + command.rotation;
            // console.log(commandString);
            controlSocket.send(commandString);
        };

        var infoSocket = zmq.socket("sub");
        infoSocket.connect("tcp://10.0.0.144:5559");
        infoSocket.subscribe("");
        infoSocket.on("message", function(message) {
            // console.log(arguments);
            // console.log(message.toString());
        });

        var started = false;
        stateSocket.on("message", function(topic, message) {
            message = JSON.parse(message.toString());
            if(message.state === "running") {
                if(!started) {
                    started = true;
                    game.start(lobbyInfo.map, setCommand);
                }

                var ship;
                var ourShips = message.data.filter(function(ship) {
                    return ship.id === name;
                });

                if(ourShips.length) {
                    ship = ourShips[0];
                }

                game.message(ship, message.data, setCommand);
            } else {
                started = false;
            }
        });
    });
};
