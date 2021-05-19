import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  headers = new Headers();
  path = 'http://127.0.0.1:8000';
  covidURL = ' https://corona-api.com';
  

  constructor(private http: HttpClient) {}

  sendSignUpData(requested_data: any) {
    this.headers.append('content-type', 'application/json');
    var json = JSON.stringify(requested_data);
    return this.http.post(
      this.path + '/signUp/',
      JSON.stringify(requested_data)
    );
  }

  sendProfileData(requested_data: any) {
    this.headers.append('content-type', 'application/json');
    var json = JSON.stringify(requested_data);
    return this.http.post(
      this.path + '/updateUserProfile/',
      JSON.stringify(requested_data)
    );
  }

  getCovidDataForAllCountries() {
    this.headers.append('content-type', 'application/json');
    return this.http.get(this.covidURL + '/countries');
  }

  getCovidDataForCountry(country_code: any) {
    this.headers.append('content-type', 'application/json');
    return this.http.get(this.covidURL + '/countries/' + country_code);
  }

  exportImageViaEmail(requested_data:any){
    this.headers.append('content-type', 'application/json');
    var json = JSON.stringify(requested_data);
    return this.http.post(
      this.path + '/exportImageViaEmail/',
      JSON.stringify(requested_data)
    );
  }
}
