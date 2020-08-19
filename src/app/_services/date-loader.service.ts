import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from './../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class DateLoaderService {

  constructor(private http: HttpClient) { }

  loadUpdatedDates() {
    return this.http.get(environment.url + 'dates');
  }
}

