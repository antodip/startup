import { DataPoint } from "./dataPoint";


export default class DataGenerator {
    
    getRandomSerie(numPoints: number): DataPoint[] {
        
        let list: DataPoint[] = [];
        let dateTime = this.generateRandomData(new Date(2012,0,1), new Date());

        for(let i=0; i<numPoints; i++) {
            
            let value = Math.floor((Math.random() * 100) + 1);
            dateTime.setMinutes(dateTime.getMinutes() + 1);
            list.push(new DataPoint(value,dateTime.getTime()));
        }
        
        return list;
    }


    getRandomDataPoint = (): DataPoint => {
        let dateTime = this.generateRandomData(new Date(2012,0,1), new Date());
        let value = Math.floor((Math.random() * 100) + 1);
        return new DataPoint(value,dateTime.getTime())
    }


     getRandomDataPointByDateAndFrequency = (dateTimeTicks: number, frequency: number): DataPoint => {
        //dateTime.setMilliseconds(dateTime.getMilliseconds()+frequency);
        let value = Math.floor((Math.random() * 100) + 1);
        return new DataPoint(value,dateTimeTicks+frequency)
    }
    
    private generateRandomData(start: Date, end: Date): Date {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    
}