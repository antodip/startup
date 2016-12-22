import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Subject }  from "rxjs/Subject";
import { DataPoint } from "./dataPoint";
import { Observable }  from "rxjs/Observable";


let Primus = require("../precompiled/primus.io.js");


@Injectable()
export class RepositoryService {

     // Observable streams

    private srvRepoUrl = "/test";
    private _syncFreq$ = new Subject<Ng2Point>();
    private _syncStatus$ = new Subject<boolean>();
    private _socket: any = null;


    constructor(private http: Http) {
        this.listenForData();
    }


    get SyncFreq$(): Observable<Ng2Point> {

        return this._syncFreq$.asObservable();

    }

    get SyncStatus$(): Observable<boolean> {

        return this._syncStatus$.asObservable();

    }



    public getData(numPoints: number): Promise<Ng2Point[]> {


        let url = `${this.srvRepoUrl}/${numPoints}`;
        return this.http.get(url)
            .toPromise()
            .then(response => this.toN2Charts(response))
            .catch(this.handleError);

    }


    public sendFrequency(frequency: number) {

       if (this._socket)
        this._socket.send("frequency", frequency);

    }

    private toN2Charts(response: any): Ng2Point[] {
        let dataPoints = response.json() as any[];
        let list: Ng2Point[] = dataPoints.map<Ng2Point>((value: any): Ng2Point => {
            return { x: value.dateTime, y: value.value };
        });

        return list;
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }


    private listenForData() {
        let socket = Primus.connect();
        let self = this;

        socket.on("open", () => {

            self._socket = socket;
            socket.on("syncFreq", (data: DataPoint) => {

                let ng2Chart =  <Ng2Point> {
                    x: data.dateTime,
                    y: data.value
                };
                self._syncFreq$.next(ng2Chart);
            });


            socket.on("syncStatus", (status: boolean) => {

                //let val: boolean = (!data.value) ? false : true;
                self._syncStatus$.next(status);
            });
        });
    }


}


interface Ng2Point {
    x: number;
    y: number;
}



