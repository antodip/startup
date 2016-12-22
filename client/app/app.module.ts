import { NgModule }      from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule }   from "@angular/forms";
import { HttpModule }    from "@angular/http";
import { ChartsModule } from "ng2-charts/components/charts/charts";

import { TimeSeriesComponent } from "./timeSeries.component";
import { RealTimeSeriesComponent } from "./realTimeSerie.component";
import { StatusLedComponent } from "./statusLed.component";
import { AppComponent }  from "./app.component";
import { RepositoryService } from "./repository.service";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule
  ],
  declarations: [
    AppComponent,
    TimeSeriesComponent,
    RealTimeSeriesComponent,
    StatusLedComponent
  ],
  providers: [RepositoryService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
