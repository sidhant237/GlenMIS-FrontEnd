import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.css']
})
export class FactoryComponent implements OnInit {

  date: any;
  teaMadeColumns: string[];
  greenLeafColumns: string[];
  GradePerColumns: string[];
  teaMadeData: any;
  greenleafData: any;
  gradePerData: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.date = new Date();
    this.date.setDate(this.date.getDate() - 1);
    this.teaMadeColumns = ['TMToday', 'TMTodate', 'TMTodateLY', 'RecoveryToday', 'RecoveryTodate'];
    this.greenLeafColumns = ['Division', 'GLToday', 'GLTodayLY', 'FineLeaf'];
    this.GradePerColumns = ['Grade', 'Qnty', 'Percent'];

    const url = 'http://127.0.0.1:5000/factory?start=' + this.convert(this.date);
    this.http.get(url).subscribe((data: Factory) => {
      this.teaMadeData = data.TeaMade;
      this.greenleafData = data.Greenleaf;
      this.gradePerData = data.GradePer;
    });
  }

  clickedGo() {
    const url = 'http://127.0.0.1:5000/factory?start=' + this.convert(this.date);
    this.http.get(url).subscribe((data: Factory) => {
      this.teaMadeData = data.TeaMade;
      this.greenleafData = data.Greenleaf;
      this.gradePerData = data.GradePer;
    });
  }

  dateChange(type: string, event: MatDatepickerInputEvent<Date>) {
      this.date = event.value;
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

export interface Factory {
  TeaMade: any[];
  Greenleaf: any[];
  GradePer: any[];
}
