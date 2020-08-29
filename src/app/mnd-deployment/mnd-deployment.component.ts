import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { environment } from './../../environments/environment';
import { DateLoaderService } from '../_services/date-loader.service';

export interface MndDeployment {
  Job_Name: string;
  Job_ID: number;
  Mandays: number;
}


@Component({
  selector: 'app-mnd-deployment',
  templateUrl: './mnd-deployment.component.html',
  styleUrls: ['./mnd-deployment.component.css']
})
export class MndDeploymentComponent implements OnInit {

  displayedColumns: string[] = ['Job_Name','JobID', 'Mandays'];
  dataSource: MndDeployment[];
  startdate: any;
  enddate: any;
  startdateCmp: any;
  enddateCmp: any;
  dataSourceCmp: MndDeployment[];

  constructor(private http: HttpClient, private dateService: DateLoaderService) { }

  ngOnInit() {
    this.startdate = new Date();
    this.enddate = new Date();
    this.startdate.setDate(this.startdate.getDate() - 1);
    this.startdateCmp = this.startdate;
    this.enddateCmp = this.enddate;

    this.dateService.loadUpdatedDates().subscribe(
      (date: any) => {
        this.startdate = new Date(date.Date.split('/').join('-'));
        const url = environment.url + 'mnddeploy?start=' + this.convert(this.startdate) + '&end=' + this.convert(this.enddate);
        this.http.get(url).subscribe((data: MndDeployment[]) => {
          this.dataSource = data;
        });
      }, error => {
        console.log(error);
      }
    );

    /*
    const url = environment.url + 'mnddeploy?start=' + this.convert(this.startdate) + '&end=' + this.convert(this.enddate);
    this.http.get(url).subscribe((data: MndDeployment[]) => {
      this.dataSource = data;
    }); */

  }

  dateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    switch (type) {
      case 'startdate': this.startdate = event.value; break;
      case 'enddate': this.enddate = event.value; break;
      case 'startdateCmp': this.startdateCmp = event.value; break;
      case 'enddateCmp': this.enddateCmp = event.value; break;
    }
  }

  clickedGo() {
    const url = environment.url + 'mnddeploy?start=' + this.convert(this.startdate) + '&end=' + this.convert(this.enddate);
    this.http.get(url).subscribe((data: MndDeployment[]) => {
      this.dataSource = data;
    });
  }

  clickedGoCompare() {
    const url = environment.url + 'mnddeploy?start=' + this.convert(this.startdateCmp) + '&end=' + this.convert(this.enddateCmp);
    this.http.get(url).subscribe((data: MndDeployment[]) => {
      this.dataSourceCmp = data;
    });
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-").toString();
  }

  getTotal(_dataSrc: string, _field: string) {
    if (this[_dataSrc]) {
      return this[_dataSrc].map(t => t[_field]).reduce((acc, value) => acc + value, 0);
    } else {
      return null;
    }
  }

}
