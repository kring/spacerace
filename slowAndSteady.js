var init = require('./client').init;
var loadMapFlowField = require("./loadMapFlowField");

var flowField;
var lastAngularVelocity;

init({
    start: function(mapName, setCommand) {
        flowField = loadMapFlowField(mapName);
    },
    message: function(ship, data, setCommand) {
        var flowDirection = flowField.getFlowDirection(ship.x | 0, ship.y | 0);
        var desiredAngle = Math.atan2(flowDirection.y, flowDirection.x);
        var currentAngle = ship.theta;

        

        if (Math.abs(desiredAngle - currentAngle) < 0.01) {

        }

        setCommand({
            mainEngine: 1,
            rotation: 1
        });

        if (lastAngularVelocity) {
            console.log(ship.omega - lastAngularVelocity);
        }
        lastAngularVelocity = ship.omega;
    }
});
