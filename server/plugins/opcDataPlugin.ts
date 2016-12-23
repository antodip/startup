import { Plugin } from "../utils/plugin";
import OpcDataService from "../services/opcDataService";
const Primus = require("primus.io");



export default class OpcDataPlugin extends Plugin {

    private _opcDataService: OpcDataService;
    private _primus: any;

    constructor(public options: any) {
        super(options, {
            name: "opcDataPlugin",
            version: "0.1.0"
        });

        this._opcDataService = options.opcDataService;

    }


    public _register(server, options) {

        let self = this;
        let primusOptions = {
            transformer: "engine.io"
        };
        this._primus = new Primus(server.listener, primusOptions);

        this._primus.on("connection", (spark) => {

            self._opcDataService.SyncFreq$.subscribe((dataPoint) =>
                self._primus.send("syncFreq", dataPoint));

            self._opcDataService.SyncFreqStatus$.subscribe((val) =>
                self._primus.send("syncStatus", val));

            spark.on("refreshStatus", () => {
                self._opcDataService.RefreshStatus();
            });

        });

        this._primus.on("disconnection", (spark) => {
            console.log("disconnected!");
        });

    }

}
