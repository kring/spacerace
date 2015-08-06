var init = require('./client').init;
var loadMapFlowField = require("./loadMapFlowField");

function start() {
    init(function(game) {
        console.log("Init'd");
        var flowField = loadMapFlowField(game.mapName);

        var lastAngularVelocity;


        game.on("new-ship-state", function(ship) {



        });
        game.state.on("message", function(topic, message) {
            message = JSON.parse(message.toString());
            if(message.state === "finished") {
                console.log("restarting");
                start();
            } else {
                var ship = message.data.filter(function(ship) {
                    return ship.id === "kring/yuri/john";
                })[0];
                if(ship) {
                    var flowDirection = flowField.getFlowDirection(ship.x | 0, ship.y | 0);
                    var desiredAngle = Math.atan2(flowDirection.y, flowDirection.x);
                    var currentAngle = ship.theta;

                    game.setCommand({
                        mainEngine: 1,
                        rotation: 1
                    });

                    if (lastAngularVelocity) {
                        console.log(ship.omega - lastAngularVelocity);
                    }
                    lastAngularVelocity = ship.omega;
                }
            }
        });
    }, 1);
}

start();
