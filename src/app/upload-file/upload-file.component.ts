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

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadFileToServer() {
    const url = 'http://127.0.0.1:5000/upload?table=' + this.database;
    const formData: FormData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    this.http.post(url, formData).subscribe(
      (result: Result) => {
        this.openSnackBar(result.message, 'Success');
      }, (error: Response) => {
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
    const url = 'http://127.0.0.1:5000/email-report';
    this.http.post(url, {}).subscribe(
      result => {
        this.openSnackBar('Email report generation initiated', 'success');
      }, error => {
        this.openSnackBar('Something went wrong', 'Error');
      }
    );
  }

}

export interface Result {
  message: string;
}
