import * as Hapi from "hapi";
import {Plugin} from "../utils/plugin";
import { Router } from "../routes/router";
import RandomDataGeneratorService  from "../services/randomDataGeneratorService";
const Primus = require("primus.io");



export default class RandomDataAcquirer extends Plugin {

    public primus: any;
    private _dataGenerator: RandomDataGeneratorService;
    private _timeInterval: number;
    private _currentTicks: number;
    private _isGenerating: boolean;
    private _currentTimer: NodeJS.Timer;

    constructor(public options: any) {
        super(options, {
            name: "data-generator",
            version: "0.1.0"
        });
        this._dataGenerator = this.options.dataGenerator;
        this._timeInterval = this.options.timeInterval;
        this._currentTicks = this._dataGenerator.getRandomDataPoint().dateTime;
    }


    public _register(server, options) {


        let self = this;
        let primusOptions = {
            transformer: "engine.io"
        };
        this.primus = new Primus(server.listener, primusOptions);

        this.primus.on("connection", (spark) => {

            self.start(spark, self._timeInterval);

            spark.on("frequency", (frequency: string) => {
                self.stop();
                self.start(spark, +frequency);
            });


        });

        this.primus.on("disconnection", (spark) => {
                console.log("disconnected!");
        });

    }



    private start(spark: any, frequency: number) {

        let self = this;
        if (self._isGenerating) return;
        this.generateData(spark, frequency, (id: NodeJS.Timer) => {
            self._isGenerating = true;
            self._currentTimer = id;
            self._timeInterval = frequency;
        });

    }


    private stop() {

        let self = this;
        if (!self._isGenerating) return;
        clearInterval(self._currentTimer);
        self._isGenerating = false;
    }


    private generateData = (spark: any, frequency: number, cb: (id: NodeJS.Timer) => void): void => {
        let self = this;
        let ret = setInterval(() => {

            let newAcquisition = self._dataGenerator.getRandomDataPointByDateAndFrequency(self._currentTicks, frequency);
            self._currentTicks = newAcquisition.dateTime;
            self.primus.send("acquisition", newAcquisition);

        }, frequency);
        cb(ret);
    }




}
