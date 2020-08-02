import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  startdate: any;
  enddate: any;
  displayedColumns: string[];
  dataSource: Invoice;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.startdate = new Date();
    this.enddate = new Date();
    this.startdate.setDate(this.startdate.getDate() - 1);
    this.displayedColumns = ['InvNo', 'Grade', 'NetWt', 'Papersacks', 'Packdate', 'DispatchDate'];

    const url = 'http://127.0.0.1:5000/invoicelist?start=' + this.convert(this.startdate) + '&end=' + this.convert(this.enddate);
    this.http.get(url).subscribe((data: Invoice) => {
    this.dataSource = data;
    });
  }

  clickedGo() {
    const url = 'http://127.0.0.1:5000/invoicelist?start=' + this.convert(this.startdate) + '&end=' + this.convert(this.enddate);
    this.http.get(url).subscribe((data: Invoice) => {
      this.dataSource = data;
    });
  }

  dateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    switch (type) {
      case 'startdate': this.startdate = event.value; break;
      case 'enddate': this.enddate = event.value; break;
    }
  }

  convert(str) {
    var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-").toString();
    }
}

export interface Invoice {
  InvNo: string;
  Grade: string;
  NetWt: string;
  Papersacks: string;
  Packdate: number;
  DispatchDate: number;
}
