import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//components
import { CultivationComponent } from './cultivation/cultivation.component';
import { CultivationGrpComponent } from './cultivation-grp/cultivation-grp.component';
import { PluckingComponent } from './plucking/plucking.component';
import { PluckingGrpComponent } from './plucking-grp/plucking-grp.component';
import { MndDeploymentComponent } from './mnd-deployment/mnd-deployment.component';
import { FuelReportComponent } from './fuel-report/fuel-report.component';
import { TeaStockComponent } from './tea-stock/tea-stock.component';
import { TeaMadeComponent } from './tea-made/tea-made.component';
import { FineLeafComponent } from './fine-leaf/fine-leaf.component';
import { GradePerComponent } from './grade-per/grade-per.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { WeatherComponent } from './weather/weather.component';

@NgModule({
  declarations: [
    AppComponent,
    CultivationComponent,
    CultivationGrpComponent,
    PluckingComponent,
    PluckingGrpComponent,
    MndDeploymentComponent,
    FuelReportComponent,
    TeaStockComponent,
    TeaMadeComponent,
    FineLeafComponent,
    GradePerComponent,
    InvoiceListComponent,
    WeatherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
