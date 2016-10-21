

"use strict";
import * as Hapi from "hapi";
import { config } from "./server/config/config";
import Routes from "./server/routes/routes";
import TimeSeriesPlugin from "./server/time-series/timeSeries";
import { Plugin } from "./server/utils/plugin"
import DataGenerator from "./server/model/dataGenerator";
import DataAcquirer from "./server/data-acquirer/data-acquirer";
import * as Path from "path";

const xtend = require('xtend')
const minimist = require('minimist')
const Inert = require('inert');

let server: Hapi.Server = null;




 let commandOpts = minimist(process.argv.slice(2), {
      integer: 'port',
      alias: {
        'port': 'p'
      }
    });

    let opts = xtend(config.server, commandOpts);

    server = new Hapi.Server();
    server.connection({ port: opts.port });


    //register plugins and start server

    let dataGenerator = new DataGenerator();

    let timeSeriesPlugin = new TimeSeriesPlugin({
      dataGenerator: dataGenerator
    });

    let dataAcquirerPlugin = new DataAcquirer({
      dataGenerator: new DataGenerator(),
      timeInterval: 1000
    });


    server.register([Inert, timeSeriesPlugin, dataAcquirerPlugin])
      // .then(() => {
      //   var timeSeriesPlugin = new TimeSeriesPlugin({
      //     dataGenerator: new DataGenerator()
      //   });
      //   return server.register(timeSeriesPlugin)
      // })
      // .then(()=> {
      //   var dataGeneratorPlugin = new DataAcquirer({
      //     dataGenerator: new DataGenerator(),
      //     timeInterval: 1000
      //   });
      //   return server.register(dataGeneratorPlugin);
      // })
      .then(() => {
        return server.start();
      })
      .then(() => {
        console.log('Server running at:', server.info.uri);
      })
      .catch((err) => {
        console.error('Error:', err);
      });

    //Routes
    Routes(server, Path.resolve(__dirname));


