import * as Hapi from "hapi";
import {Plugin} from "../utils/plugin";
import DataGenerator  from "../model/dataGenerator";
import { Router } from "../routes/router"


export default class TimeSeriesPlugin extends Plugin {

    private _dataGenerator = this.options.dataGenerator;

    constructor(public options: any) {
        super(options, {
            name: 'time-series',
            version: '0.1.0'
        });
    }



    public GetRandomTimeSerie(): Hapi.IRouteAdditionalConfigurationOptions {
        return {
            handler: (request: Hapi.Request, reply: Hapi.IReply) => {
                var num = +request.params["num"];
                reply(this._dataGenerator.getRandomSerie(num));
            }
        }

    }


    _register(server, options) {
        
        server.route(new Router('GET', '/test/{num}', this.GetRandomTimeSerie()).get())
    }

}