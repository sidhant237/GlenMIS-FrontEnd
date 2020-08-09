import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cultivation-grp',
  templateUrl: './cultivation-grp.component.html',
  styleUrls: ['./cultivation-grp.component.css']
})
export class CultivationGrpComponent implements OnInit {
  startdate: any;
  enddate: any;
  startdateCmp: any;
  enddateCmp: any;
  displayedColumns: any;
  dataSource: any;
  dataSourceCmp: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
	this.startdate = new Date();
	this.enddate = new Date();
	this.startdate.setDate(this.startdate.getDate() - 1);
	this.startdateCmp = this.startdate;
	this.enddateCmp = this.enddate;
	this.displayedColumns = ['Job_Name', 'Mandays', 'AreaCovered', 'MndArea'];

	const url = 'http://127.0.0.1:5000/cultgroup?start=' + this.convert(this.startdate) + '&end=' + this.convert(this.enddate);
	this.http.get(url).subscribe((data: CultivationGroupByJob) => {
		this.dataSource = data;
		});
	}

	clickedGo() {
		const url = 'http://127.0.0.1:5000/cultgroup?start=' + this.convert(this.startdate) + '&end=' + this.convert(this.enddate);
		this.http.get(url).subscribe((data: CultivationGroupByJob) => {
		this.dataSource = data;
		});
	}

	clickedGoCompare() {
		const url = 'http://127.0.0.1:5000/cultgroup?start=' + this.convert(this.startdateCmp) + '&end=' + this.convert(this.enddateCmp);
		this.http.get(url).subscribe((data: CultivationGroupByJob) => {
			this.dataSourceCmp = data;
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

export interface CultivationGroupByJob {
	Job_Name: string;
	Mandays: number;
	AreaCovered: number;
	MndArea: number;
}
