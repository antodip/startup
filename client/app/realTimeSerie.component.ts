import { Component, OnInit } from '@angular/core';
import { RepositoryService } from './repository.service';
import { DataPoint } from './dataPoint';
//import { ChartsModule } from 'ng2-charts';



@Component({
    selector: 'realTimeSerie',
    templateUrl: 'app/realTimeSerie.component.html'
})

export class RealTimeSeriesComponent {

    frequency = 1000;
    buffer: Array<any> = [];

    public lineChartData: Array<any> = [{
        data: [],
        fill: false
    }];
    public lineChartType: string = 'line';

    public lineChartColors: Array<any> = [
        
        { // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        }
    ];
    public lineChartOptions: any = {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        borderColor: "rgb(255,100,100)",
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    displayFormats: {
                        quarter: 'MMM YYYY'
                    }
                }
            }]
        }
    };

    constructor(public repositoryService: RepositoryService) {
        repositoryService.dataSource$.subscribe(data => {
            this.buildTrend(data);
        })
    }




    private dataHandler(d: any) {
        this.lineChartData = [{ data: d, fill: false }];

    }

    private buildTrend(data: any) {
        if (this.buffer.length >= 300) this.buffer.shift();
        this.buffer.push(data);
        this.lineChartData = [{
            data: this.buffer,
            fill: false,
            label: "RealTimeTrend Test"
        }]

    }


    private sendFrequency(frequency: number) {
        this.repositoryService.sendFrequency(frequency);
    }

}