import * as Hapi from "hapi";
import {Plugin} from "../utils/plugin";
import RandomDataGeneratorService  from "../services/randomDataGeneratorService";
import { Router } from "../routes/router";


export default class TimeSeriesPlugin extends Plugin {

    private _dataService;

    constructor(public options: any) {
        super(options, {
            name: "time-series",
            version: "0.1.0"
        });
        this._dataService = this.options.service;
    }



    public GetRandomTimeSerie(): Hapi.IRouteAdditionalConfigurationOptions {
        return {
            handler: (request: Hapi.Request, reply: Hapi.IReply) => {
                // tslint:disable-next-line:no-string-literal
                let num = +request.params["num"];
                reply(this._dataService.GetHistory(num));
            }
        };

    }


    public _register(server, options) {
        server.route(new Router("GET", "/test/{num}", this.GetRandomTimeSerie()).get());
    }

}
