import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

import { DateLoaderService } from '../_services/date-loader.service';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  fileToUpload: File = null;
  isUploading = false;
  isMailSending = false;
  activeMenu = 'upload';
  authenticated: boolean = true;
  token: string;

  table = '';
  uploadDate: any;

  emailDate: any;

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private dateService: DateLoaderService) { }

  ngOnInit() {
    this.dateService.loadUpdatedDates().subscribe(
      (date: any) => {
        this.uploadDate = new Date(date.Date.split('/').join('-'));
        this.emailDate = new Date(date.Date.split('/').join('-')).toISOString().split('T')[0];
        console.log(this.uploadDate);
      }, error => {
        console.log(error);
      }
    );
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadFileToServer() {
    this.isUploading = true;
    const url = environment.url + this.table + '?date=' + this.uploadDate;
    const formData: FormData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    this.http.post(url, formData).subscribe(
      (result: Result) => {
        this.isUploading = false;
        this.openSnackBar(result.message, 'Success');
      }, (error: Response) => {
        this.isUploading = false;
        this.openSnackBar('Something went wrong', 'Error');
        console.log(error);
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  emailReportHandler() {
    this.isMailSending = true;
    const url = environment.url + 'email-report';
    this.http.post(url, {}).subscribe(
      result => {
        this.isMailSending = false;
        this.openSnackBar('Email report generation initiated', 'success');
      }, error => {
        this.isMailSending = false;
        this.openSnackBar('Something went wrong', 'Error');
      }
    );
  }

  authenticateHandler() {
    if(this.token === 'glenburnmis') {
      this.authenticated = true;
    }
  }

}

export interface Result {
  message: string;
}
