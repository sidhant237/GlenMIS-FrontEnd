import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  fileToUpload: File = null;
  database: string;
  isUploading = false;
  isMailSending = false;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadFileToServer() {
    this.isUploading = true;
    const url = 'http://127.0.0.1:5000/upload?table=' + this.database;
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
    const url = 'http://127.0.0.1:5000/email-report';
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

}

export interface Result {
  message: string;
}
