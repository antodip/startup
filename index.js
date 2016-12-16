"use strict";
var Hapi = require("hapi");
var config_1 = require("./server/config/config");
var routes_1 = require("./server/routes/routes");
var timeSeries_1 = require("./server/time-series/timeSeries");
var dataGenerator_1 = require("./server/model/dataGenerator");
var data_acquirer_1 = require("./server/data-acquirer/data-acquirer");
var Path = require("path");
var xtend = require('xtend');
var minimist = require('minimist');
var Inert = require('inert');
var server = null;
var commandOpts = minimist(process.argv.slice(2), {
    integer: 'port',
    alias: {
        'port': 'p'
    }
});
var opts = xtend(config_1.config.server, commandOpts);
server = new Hapi.Server();
server.connection({ port: opts.port });
//register plugins and start server
var dataGenerator = new dataGenerator_1.default();
var timeSeriesPlugin = new timeSeries_1.default({
    dataGenerator: dataGenerator
});
var dataAcquirerPlugin = new data_acquirer_1.default({
    dataGenerator: new dataGenerator_1.default(),
    timeInterval: 1000
});
server.register([Inert, timeSeriesPlugin, dataAcquirerPlugin])
    .then(function () {
    return server.start();
})
    .then(function () {
    console.log('Server running at:', server.info.uri);
})
    .catch(function (err) {
    console.error('Error:', err);
});
//Routes
routes_1.default(server, Path.resolve(__dirname));
