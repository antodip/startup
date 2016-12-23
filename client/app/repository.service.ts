import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { Subject } from "rxjs/Subject";
import { DataPoint } from "./dataPoint";
import { Observable } from "rxjs/Observable";


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

        this.openSocket()
            .then((socket) => {
                socket.send("frequency", frequency);
            });


    }

    public refreshStatus() {

        this.openSocket()
            .then((socket) => {
                socket.send("refreshStatus");
            });


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

        let self = this;
        this.openSocket()
            .then((socket) => {

                socket.on("syncFreq", (data: DataPoint) => {

                    let ng2Chart = <Ng2Point>{
                        x: data.dateTime,
                        y: data.value
                    };
                    self._syncFreq$.next(ng2Chart);
                });


                socket.on("syncStatus", (status: boolean) => {
                    self._syncStatus$.next(status);
                });
            });

    }

    private openSocket(): Promise<any> {

        let self = this;
        return new Promise<any>((resolve, reject) => {

            if (self._socket) {

                resolve(self._socket);
                return;
            }

            self._socket = Primus.connect();

            self._socket.on("open", () => {

                resolve(self._socket);

            });

        });

    }


}


interface Ng2Point {
    x: number;
    y: number;
}



