"use strict";
var Hapi = require("hapi");
var config_1 = require("./server/config/config");
var routes_1 = require("./server/routes/routes");
var timeSeries_1 = require("./server/time-series/timeSeries");
var dataGenerator_1 = require("./server/model/dataGenerator");
var data_acquirer_1 = require("./server/data-acquirer/data-acquirer");
var xtend = require('xtend');
var minimist = require('minimist');
var Inert = require('inert');
if (require.main === module) {
    var commandOpts = minimist(process.argv.slice(2), {
        integer: 'port',
        alias: {
            'port': 'p'
        }
    });
    var opts = xtend(config_1.config.server, commandOpts);
    var server_1 = new Hapi.Server();
    server_1.connection({ port: opts.port });
    //register plugins and start server
    var dataGenerator = new dataGenerator_1.default();
    var timeSeriesPlugin = new timeSeries_1.default({
        dataGenerator: dataGenerator
    });
    var dataAcquirerPlugin = new data_acquirer_1.default({
        dataGenerator: new dataGenerator_1.default(),
        timeInterval: 1000
    });
    server_1
        .register([Inert, timeSeriesPlugin, dataAcquirerPlugin])
        .then(function () {
        return server_1.start();
    })
        .then(function () {
        console.log('Server running at:', server_1.info.uri);
    })
        .catch(function (err) {
        console.error('Error:', err);
    });
    //Routes
    routes_1.default(server_1);
}
