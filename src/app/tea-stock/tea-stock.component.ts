import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-tea-stock',
  templateUrl: './tea-stock.component.html',
  styleUrls: ['./tea-stock.component.css']
})
export class TeaStockComponent implements OnInit {
  startdate: any;
  displayedColumns: string[];
  dataSource: TeaStock;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.startdate = new Date();
    this.startdate.setDate(this.startdate.getDate() - 1);
    this.displayedColumns = ['Grade', 'Kg' ];

    const url = 'http://127.0.0.1:5000/teastock?start=' + this.convert(this.startdate);
    this.http.get(url).subscribe((data: TeaStock) => {
    this.dataSource = data;
    });
  }

  clickedGo() {
    const url = 'http://127.0.0.1:5000/teastock?start=' + this.convert(this.startdate);
    this.http.get(url).subscribe((data: TeaStock) => {
      this.dataSource = data;
    });
  }

  dateChange(type: string, event: MatDatepickerInputEvent<Date>) {
      this.startdate = event.value;
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

export interface TeaStock {
  Grade: string;
  Kg: number;
}
