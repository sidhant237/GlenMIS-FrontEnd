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
  displayedColumnsCmp: any;
  dataSource: any;
  dataSourceCmp: any;
  showCompare: boolean;
  selected: string;
  selectedCmp: string;
  group: string;
  groupCmp: string;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
	this.startdate = new Date();
	this.enddate = new Date();
	this.startdate.setDate(this.startdate.getDate() - 1);
	this.startdateCmp = this.startdate;
	this.enddateCmp = this.enddate;
	this.showCompare = false;
	this.displayedColumns = ['Job_Name', 'Mandays', 'AreaCovered', 'MndArea'];
	this.displayedColumnsCmp = ['Job_Name', 'Mandays', 'AreaCovered', 'MndArea'];
	this.selected = 'job';
	this.selectedCmp = 'job';
	this.group = 'job';
	this.groupCmp = 'job';

	const url = 'http://127.0.0.1:5000/cultgroup?start=' + this.convert(this.startdate) + '&end=' + this.convert(this.enddate) + '&grpby=' + this.selected;
	this.http.get(url).subscribe((data: CultivationGroupByJob) => {
		this.dataSource = data;
		});
	}

	clickedGo() {
		const url = 'http://127.0.0.1:5000/cultgroup?start=' + this.convert(this.startdate) + '&end=' + this.convert(this.enddate) + '&grpby=' + this.selected;
		this.http.get(url).subscribe((data: any) => {
			this.group = this.selected;
			if (this.selected === 'job') {
				this.displayedColumns = ['Job_Name', 'Mandays', 'AreaCovered', 'MndArea'];
				this.parseJobData('report', data);
			} else {
				this.displayedColumns = ['Section_Name', 'Mandays', 'AreaCovered', 'MndArea'];
				this.parseSectionData('report', data);
			}
		});
	}

	clickedCompare() {
		this.showCompare = true;
	}

	clickedGoCompare() {
		const url = 'http://127.0.0.1:5000/cultgroup?start=' + this.convert(this.startdateCmp) + '&end=' + this.convert(this.enddateCmp) + '&grpby=' + this.selectedCmp;
		this.http.get(url).subscribe((data: any) => {
			this.groupCmp = this.selectedCmp;
			if (this.selectedCmp === 'job') {
				this.displayedColumnsCmp = ['Job_Name', 'Mandays', 'AreaCovered', 'MndArea'];
				this.parseJobData('compare', data);
			} else {
				this.displayedColumnsCmp = ['Section_Name', 'Mandays', 'AreaCovered', 'MndArea'];
				this.parseSectionData('compare', data);
			}
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

	parseJobData(type: string, data: CultivationGroupByJob) {
		switch (type) {
			case 'report': this.dataSource = data; break;
			case 'compare': this.dataSourceCmp = data; break;
		}
	}

	parseSectionData(type: string, data: CultivationGroupBySection) {
		switch (type) {
			case 'report': this.dataSource = data; break;
			case 'compare': this.dataSourceCmp = data; break;
		}
	}

}

export interface CultivationGroupByJob {
	Job_Name: string;
	Mandays: number;
	AreaCovered: number;
	MndArea: number;
}

export interface CultivationGroupBySection {
	Section_Name: string;
	Mandays: number;
	AreaCovered: number;
	MndArea: number;
}
