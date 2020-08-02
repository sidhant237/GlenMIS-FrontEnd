import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//componets
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


const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'cultdaily', component: CultivationComponent },
  { path: 'cultgroup', component: CultivationGrpComponent },
  { path: 'pluckdaily', component: PluckingComponent },
  { path: 'pluckgroup', component: PluckingGrpComponent },
  { path: 'mnddeploy', component: MndDeploymentComponent },
  { path: 'fuelreport', component: FuelReportComponent },
  { path: 'teastock', component: TeaStockComponent },
  { path: 'teamade', component: TeaMadeComponent },
  { path: 'fineleaf', component: FineLeafComponent},
  { path: 'gradeper', component: GradePerComponent},
  { path: 'invoicelist', component: InvoiceListComponent},
  { path: 'weather', component: WeatherComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
