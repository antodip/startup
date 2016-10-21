import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Subject }  from 'rxjs/Subject';
import { DataPoint } from './dataPoint';


var Primus = require('../primus_io/primus.io.js');


@Injectable()
export class RepositoryService {

    constructor(private http: Http) {
        this.listenForData();
    }

    private srvRepoUrl = "/test";
    private dataSource = new Subject<Ng2Point>();
    private _socket: any = null;

    //Observable streams
    dataSource$ = this.dataSource.asObservable();



    getData(numPoints: number): Promise<Array<Ng2Point>> {


        let url = `${this.srvRepoUrl}/${numPoints}`
        return this.http.get(url)
            .toPromise()
            .then(response => this.toN2Charts(response))
            .catch(this.handleError);

    }

   
    sendFrequency(frequency: number) {

       if (this._socket)
        this._socket.send("frequency", frequency)

    }

    private toN2Charts(response: any): Array<Ng2Point> {
        let dataPoints = response.json() as Array<any>;
        let list: Array<Ng2Point> = dataPoints.map<Ng2Point>(function (value: any): Ng2Point {
            return { x: value.dateTime, y: value.value }
        });

        return list;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }


    private listenForData() {
        var socket = Primus.connect('http://localhost:8000');
        let self = this;

        socket.on('open', function () {

            self._socket = socket;
            // listen to hello events 
            socket.on('acquisition', function (data: DataPoint) {

                var ng2Chart =  <Ng2Point> {
                    x: data.dateTime,
                    y: data.value
                };
                self.dataSource.next(ng2Chart)
                //console.log(msg); //-> hello from the server 
            });
        });
    }


    


    

}


interface Ng2Point {
    x: number,
    y: number
}



