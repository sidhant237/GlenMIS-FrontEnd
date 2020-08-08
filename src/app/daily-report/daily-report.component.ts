import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.css']
})
export class DailyReportComponent implements OnInit {
  startdate: any;
  teaMadeColumns: string[];
  greenLeafColumns: string[];
  GradePerColumns: string[];
  MandaysColumns: string[];
  PluckingColumns: string[];
  CultivationColumns: string[];
  FuelReportColumns: string[];

  teaMadeData: any;
  greenleafData: any;
  gradePerData: any;
  MandaysData: any;
  PluckingData: any;
  CultivationData: any;
  FuelReportData: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.startdate = new Date();
    this.startdate.setDate(this.startdate.getDate() - 1);
    this.teaMadeColumns = ['TMToday', 'TMTodate', 'TMTodateLY', 'RecoveryToday', 'RecoveryTodate'];
    this.greenLeafColumns = ['Division', 'GLToday', 'GLTodayLY', 'FineLeaf'];
    this.GradePerColumns = ['Grade', 'Qnty', 'Percent'];
    this.MandaysColumns = ['Job_Name', 'Mandays'];
    this.PluckingColumns = ['Division', 'Date', 'Section_Name', 'Squad_Name', 'Mandays', 'Greenleaf', 'AreaCovered',
                            'GlMnd', 'GlHa', 'MndHa', 'Prune', 'Jat', 'SecArea'];
    this.CultivationColumns = ['Division', 'Date', 'AreaCovered', 'Job_Name', 'Mandays', 'Mnd/Area', 'Section_Name', 'Squad_Name'];
    this.FuelReportColumns = ['Machine', 'FuelUsed', 'TM', 'TMFuel'];

    const url = 'http://127.0.0.1:5000/dailyreport?start=' + this.convert(this.startdate);
    this.http.get(url).subscribe((data: DailyReport) => {
      this.teaMadeData = data.TeaMade;
      this.greenleafData = data.Greenleaf;
      this.gradePerData = data.GradePer;
      this.MandaysData = data.Mandays;
      this.PluckingData = data.Plucking;
      this.CultivationData = data.Cultivation;
      this.FuelReportData = data.FuelReport;
    });
  }

  clickedGo() {
    const url = 'http://127.0.0.1:5000/dailyreport?start=' + this.convert(this.startdate);
    this.http.get(url).subscribe((data: DailyReport) => {
      this.teaMadeData = data.TeaMade;
      this.greenleafData = data.Greenleaf;
      this.gradePerData = data.GradePer;
      this.MandaysData = data.Mandays;
      this.PluckingData = data.Plucking;
      this.CultivationData = data.Cultivation;
      this.FuelReportData = data.FuelReport;
    });
  }

  dateChange(type: string, event: MatDatepickerInputEvent<Date>) {
      this.startdate = event.value;
  }

  getTotal(_dataSrc: string, _field: string) {
    if (this[_dataSrc]) {
      return this[_dataSrc].map(t => t[_field]).reduce((acc, value) => acc + value, 0);
    } else {
      return null;
    }
  }

  convert(str) {
    var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-").toString();
  }
}

export interface DailyReport {
  Greenleaf: any;
  TeaMade: any;
  Mandays: any;
  Plucking: any;
  Cultivation: any;
  GradePer: any;
  FuelReport: any;
}
