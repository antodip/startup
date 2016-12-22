import { DataPoint } from "../model/dataPoint";
import * as Opc from "@tech/opc-lib";
import * as Rx from "rxjs";


export default class OpcDataService {



    private _opcServiceDa: Opc.Service;
    private _opcServiceHistorical: Opc.Service;

    private _syncFreqNode: Opc.NodeId;
    private _historicalNode: Opc.NodeId;
    private _syncFreqStatusNode: Opc.NodeId;

    private _syncFreq$: Rx.Subject<DataPoint>;
    private _syncFreqStatus$: Rx.Subject<boolean>;


    constructor(options: any) {

        this._opcServiceDa = options.opcServiceDA;
        this._opcServiceHistorical = (!options.opcServiceHistorcal) ? options.opcService() : options.opcServiceHistorcal;
        this._syncFreqNode = options.syncFreqNode;
        this._historicalNode = options.historicalNode;
        this._syncFreqStatusNode = options.syncFreqStatusNode;

        this._syncFreq$ = new Rx.Subject<DataPoint>();
        this._syncFreqStatus$ = new Rx.Subject<any>();
    }


    get SyncFreq$(): Rx.Subject<DataPoint> {

        return this._syncFreq$;
    }


    get SyncFreqStatus$(): Rx.Subject<boolean> {

        return this._syncFreqStatus$;
    }


    public StartMonitoring() {

        this._opcServiceDa.MonitorNodes([this._syncFreqNode, this._syncFreqStatusNode])
            .then((res$) => {
                res$.subscribe((opcData) => {

                    if (opcData.NodeId.IsEqual(this._syncFreqNode))
                        this._syncFreq$.next(this.ConvertToDataPoint(opcData.Variant));

                    if (opcData.NodeId.IsEqual(this._syncFreqStatusNode)) {
                        let val: boolean = (!opcData.Value) ? false : true;
                        this._syncFreqStatus$.next(val);
                    }


                });
            });

    }


    public GetHistory(minutesAgo: number): Promise<DataPoint[]> {

        let self = this;
        return new Promise((resolve, reject) => {

            let endData = new Date();
            let startDate = new Date(endData);
            startDate.setMinutes(endData.getMinutes() - minutesAgo);

            let history = [];
            this._opcServiceHistorical.GetHistory(this._historicalNode, startDate, endData)
                .then((res) => {

                    res.Values.forEach((val, ix) => {
                        history.push(this.ConvertToDataPoint(val));
                    });

                    resolve(history);
                })
                .catch((err) => {
                    reject(err);
                });

        });



    }



    private ConvertToDataPoint(variant: Opc.VariantExtended): DataPoint {

        return new DataPoint(variant.Value, variant.SourceTimeStamp.getTime());

    }

}


