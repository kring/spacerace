var init = require('./client').init;

init(function(game) {
    var flowField = loadMapFlowField(game.mapName);

    var lastAngularVelocity;

    game.setCommand({
        mainEngine: false,
        rotation: 1
    });

    game.state.on("message", function(topic, message) {
        message = JSON.parse(message.toString());
        var flowDirection = flowField.getFlowDirection(message.x | 0, message.y | 0);
        var desiredAngle = Math.atan2(flowDirection.y, flowDirection.x);
        var currentAngle = message.theta;

        if (lastAngularVelocity) {
            console.log(message.omega - lastAngularVelocity);
        } else {
            lastAngularVelocity = message.omega;
        }
    });
}, 1);
