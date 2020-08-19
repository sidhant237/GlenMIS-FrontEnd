import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  authenticated: boolean = false;
  token: string;

  table = '';
  uploadDate: string;

  emailDate: string;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  ngOnInit() {
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
