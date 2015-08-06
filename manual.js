var init = require('./client').init;
var keypress = require('keypress');

keypress(process.stdin);

var command = {
    mainEngine: 0,
    rotation: 0
};

process.stdin.on('keypress', function(ch, key) {
    if (key.name === 'w') {
        command.mainEngine = command.mainEngine ? 0 : 1;
        console.log(command.mainEngine ? 'engine on' : 'engine off');
    }
    if (key.name === 'a') {
        command.rotation = 1;
        console.log('rotate left')
    }
    if (key.name === 'd') {
        command.rotation = -1;
        console.log('rotate right');
    }
    if (key.name === 's') {
        command.rotation = 0;
        console.log('stop rotating');
    }

});

process.stdin.setRawMode(true);
process.stdin.resume();

init({
    start: function(setCommand) {
        console.log('started');
    },
    message: function(myShip, data, setCommand) {
        setCommand(command);
    }
})
