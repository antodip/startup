

"use strict";
import * as Hapi from "hapi";
import Routes from "./server/routes/routes";
import TimeSeriesPlugin from "./server/plugins/timeSeries";
import { Plugin } from "./server/utils/plugin";
import RandomDataGeneratorService from "./server/services/randomDataGeneratorService";
import RandomDataAcquirer from "./server/plugins/randomData-acquirer";
import * as Path from "path";
import * as Config from "config";
import * as Opc from "@tech/opc-lib";
import OpcDataService from "./server/services/opcDataService";
import OpcDataPlugin from "./server/plugins/opcDataPlugin";

const xtend = require("xtend");
const minimist = require("minimist");
const Inert = require("inert");

let server: Hapi.Server = null;

let createNodeId = (conf): Promise<Opc.NodeId> => {

  return new Promise((resolve, reject) => {

    let iConf: string = conf.identifier.toLowerCase();
    let identifier: Opc.NodeIdType;

    switch (iConf) {

      case "numeric": identifier = Opc.NodeIdType.NUMERIC; break;
      case "string": identifier = Opc.NodeIdType.STRING; break;
      case "guid": identifier = Opc.NodeIdType.GUID; break;
      case "byteString": identifier = Opc.NodeIdType.BYTESTRING; break;

      default: reject("wrong option");

    }

    let ret = new Opc.NodeId(identifier, conf.value, conf.nameSpace);
    if (ret) resolve(ret);
    else reject("error resolving nodeId");

  });

};


let commandOpts = minimist(process.argv.slice(2), {
  integer: "port",
  alias: {
    // tslint:disable-next-line:object-literal-key-quotes
    "port": "p"
  }
});



let serverConf = Config.get<number>("Server");
let opts = xtend(serverConf, commandOpts);

server = new Hapi.Server();
server.connection({ port: opts.port });


let opcServiceDa = Opc.ServiceFactory.CreateOpcService(Config.get<string>("OpcDataSource.OpcServerUrl"), 10);
let opcServiceHistorical: Opc.Service;

let synFreqNodeId: Opc.NodeId;
let historicalNodeId: Opc.NodeId;
let syncFreqStatusNodeId: Opc.NodeId;

createNodeId(Config.get("OpcDataSource.SyncFreqNode"))
  .then((nodeId) => {
    synFreqNodeId = nodeId;
    return createNodeId(Config.get("OpcDataSource.HistoricalNode"));
  })
  .then((nodeId) => {
    historicalNodeId = nodeId;
    return createNodeId(Config.get("OpcDataSource.SyncStatusNode"));
  })
  .then((nodeId) => {
    syncFreqStatusNodeId = nodeId;
    if (Config.has("OpcDataSource.HistoricalNode.OpcServerUrl"))
      opcServiceHistorical = Opc.ServiceFactory.CreateOpcService(Config.get<string>("OpcDataSource.HistoricalNode.OpcServerUrl"), 10);

    let opcServiceOptions = {

      opcServiceDA: opcServiceDa,
      syncFreqNode: synFreqNodeId,
      historicalNode: historicalNodeId,
      syncFreqStatusNode: syncFreqStatusNodeId,
      opcServiceHistorcal: opcServiceHistorical
    };


    // register plugins and start server

    // let dataGenerator = new RandomDataGeneratorService();

    let opcDataService = new OpcDataService(opcServiceOptions);
    opcDataService.StartMonitoring();
    let opcDataPlugin = new OpcDataPlugin({
      // tslint:disable-next-line:object-literal-shorthand
      opcDataService: opcDataService
    });


    let timeSeriesPlugin = new TimeSeriesPlugin({
      // tslint:disable-next-line:object-literal-shorthand
      service: opcDataService
    });

    // let dataAcquirerPlugin = new RandomDataAcquirer({
    //   dataGenerator: new RandomDataGeneratorService(),
    //   timeInterval: 1000
    // });





    server.register([Inert, timeSeriesPlugin, opcDataPlugin])
      .then(() => {
        return server.start();
      })
      .then(() => {
        console.log("Server running at:", server.info.uri);
      })
      .catch((err) => {
        console.error("Error:", err);
      });

    // Routes
    Routes(server, Path.resolve(__dirname));





  });













