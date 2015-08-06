var init = require('./client').init;

init(function(game) {
    game.setCommand({
        mainEngine: true,
        rotation: 0
    });

    game.state.on("message", function(topic, message) {
    });
}), 1;
