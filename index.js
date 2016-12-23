"use strict";
var Hapi = require("hapi");
var routes_1 = require("./server/routes/routes");
var timeSeries_1 = require("./server/plugins/timeSeries");
var Path = require("path");
var Config = require("config");
var Opc = require("@tech/opc-lib");
var opcDataService_1 = require("./server/services/opcDataService");
var opcDataPlugin_1 = require("./server/plugins/opcDataPlugin");
var xtend = require("xtend");
var minimist = require("minimist");
var Inert = require("inert");
var server = null;
var createNodeId = function (conf) {
    return new Promise(function (resolve, reject) {
        var iConf = conf.identifier.toLowerCase();
        var identifier;
        switch (iConf) {
            case "numeric":
                identifier = Opc.NodeIdType.NUMERIC;
                break;
            case "string":
                identifier = Opc.NodeIdType.STRING;
                break;
            case "guid":
                identifier = Opc.NodeIdType.GUID;
                break;
            case "byteString":
                identifier = Opc.NodeIdType.BYTESTRING;
                break;
            default: reject("wrong option");
        }
        var ret = new Opc.NodeId(identifier, conf.value, conf.nameSpace);
        if (ret)
            resolve(ret);
        else
            reject("error resolving nodeId");
    });
};
var commandOpts = minimist(process.argv.slice(2), {
    integer: "port",
    alias: {
        // tslint:disable-next-line:object-literal-key-quotes
        "port": "p"
    }
});
var serverConf = Config.get("Server");
var opts = xtend(serverConf, commandOpts);
server = new Hapi.Server();
server.connection({ port: opts.port });
var opcServiceDa = Opc.ServiceFactory.CreateOpcService(Config.get("OpcDataSource.OpcServerUrl"), 10);
var opcServiceHistorical;
var synFreqNodeId;
var historicalNodeId;
var syncFreqStatusNodeId;
createNodeId(Config.get("OpcDataSource.SyncFreqNode"))
    .then(function (nodeId) {
    synFreqNodeId = nodeId;
    return createNodeId(Config.get("OpcDataSource.HistoricalNode"));
})
    .then(function (nodeId) {
    historicalNodeId = nodeId;
    return createNodeId(Config.get("OpcDataSource.SyncStatusNode"));
})
    .then(function (nodeId) {
    syncFreqStatusNodeId = nodeId;
    if (Config.has("OpcDataSource.HistoricalNode.OpcServerUrl"))
        opcServiceHistorical = Opc.ServiceFactory.CreateOpcService(Config.get("OpcDataSource.HistoricalNode.OpcServerUrl"), 10);
    var opcServiceOptions = {
        opcServiceDA: opcServiceDa,
        syncFreqNode: synFreqNodeId,
        historicalNode: historicalNodeId,
        syncFreqStatusNode: syncFreqStatusNodeId,
        opcServiceHistorcal: opcServiceHistorical
    };
    // register plugins and start server
    var opcDataService = new opcDataService_1.default(opcServiceOptions);
    opcDataService.StartMonitoring();
    var opcDataPlugin = new opcDataPlugin_1.default({
        // tslint:disable-next-line:object-literal-shorthand
        opcDataService: opcDataService
    });
    var timeSeriesPlugin = new timeSeries_1.default({
        // tslint:disable-next-line:object-literal-shorthand
        service: opcDataService
    });
    return server.register([Inert, timeSeriesPlugin, opcDataPlugin]);
})
    .then(function () {
    return server.start();
})
    .then(function () {
    routes_1.default(server, Path.resolve(__dirname));
    console.log("Server running at:", server.info.uri);
})
    .catch(function (err) {
    console.error("Error:", err);
});
// Routes
//# sourceMappingURL=index.js.map