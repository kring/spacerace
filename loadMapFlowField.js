'use strict';

var fs = require('fs');
var d3 = require('d3');


function loadMapFlowField(mapName) {
    var flowx = fs.readFileSync(__dirname + '/bundle/' + mapName + '_flowx.csv', 'utf8');
    var flowy = fs.readFileSync(__dirname + '/bundle/' + mapName + '_flowy.csv', 'utf8');

    var dsv = d3.dsv(' ', "text/plain");

    var csvX = dsv.parseRows(flowx);
    var csvY = dsv.parseRows(flowy);

    return {
        x: csvX.map(function(item) {
            return item.map(function(value) {
                return +value;
            });
        }),
        y: csvY.map(function(item) {
            return item.map(function(value) {
                return +value;
            });
        }),
        getFlowDirection: function(x, y) {
            return {
                x: this.x[y][x],
                y: this.y[y][x]
            };
        }
    };

}

module.exports = loadMapFlowField;
