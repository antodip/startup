import { Component, OnInit } from "@angular/core";
import { RepositoryService } from "./repository.service";
import { DataPoint } from "./dataPoint";
// import { ChartsModule } from 'ng2-charts';



@Component({
    selector: "trend",
    templateUrl: "app/timeSeries.component.html"
})

export class TimeSeriesComponent implements OnInit {
    public title = "Performance Tester";
    public numPoints = 100;
    public data: DataPoint[];


    public lineChartData: any[] = [{
           data: [{x: 1475251068602, y: 5}],
           fill: false
        }];

    public lineChartType: string = "line";
    public lineChartOptions: any = {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                type: "time",
                time: {
                    displayFormats: {
                        quarter: "MMM YYYY"
                    }
                }
            }]
        }
    };

    constructor(public repositoryService: RepositoryService) {

    }

    public getData(numPoints: number): void {
        this.numPoints = numPoints;
        this.repositoryService.getData(numPoints)
            .then(p => this.dataHandler(p));
    }

    public ngOnInit(): void {
        this.getData(100);
    }

    private dataHandler(d: any) {
            this.lineChartData = [{
                data: d,
                fill: false,
                label: "Historical Values"
            }];

    }

}
