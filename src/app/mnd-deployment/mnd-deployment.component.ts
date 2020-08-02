import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export interface MndDeployment {
  Job_Name: string;
  Mandays: number;
}


@Component({
  selector: 'app-mnd-deployment',
  templateUrl: './mnd-deployment.component.html',
  styleUrls: ['./mnd-deployment.component.css']
})
export class MndDeploymentComponent implements OnInit {

  displayedColumns: string[] = ['Job_Name', 'Mandays'];
  dataSource: MndDeployment[];
  startdate: any;
  enddate: any;
  startdateCmp: any;
  enddateCmp: any;
  dataSourceCmp: MndDeployment[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.startdate = new Date();
    this.enddate = new Date();
    this.startdate.setDate(this.startdate.getDate() - 1);
    this.startdateCmp = this.startdate;
    this.enddateCmp = this.enddate;

    const url = 'http://127.0.0.1:5000/mnddeploy?start=' + this.convert(this.startdate) + '&end=' + this.convert(this.enddate);
    this.http.get(url).subscribe((data: MndDeployment[]) => {
      this.dataSource = data;
    });
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
    const url = 'http://127.0.0.1:5000/mnddeploy?start=' + this.convert(this.startdate) + '&end=' + this.convert(this.enddate);
    this.http.get(url).subscribe((data: MndDeployment[]) => {
      this.dataSource = data;
    });
  }

  clickedGoCompare() {
    const url = 'http://127.0.0.1:5000/mnddeploy?start=' + this.convert(this.startdateCmp) + '&end=' + this.convert(this.enddateCmp);
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

}
