import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

const token = sessionStorage.getItem('token');
const headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('Authorization', `Bearer ${token}`)

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  newCountry(data: any): Observable<any>{
    const url = this.apiUrl + '/api-around2/pays/';
    return this.http.post(url, data, {headers: headers});
  }

  getAllCountries(): Observable<any>{
    const url = this.apiUrl + '/api-around2/pays/';
    return this.http.get(url, {headers: headers});
  } //ok

  updateCountry(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/pays/update/${id}`;
    return this.http.patch(url, {headers: headers});
  }

  delCountry(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/pays/${id}`;
    return this.http.delete(url, { headers: headers });
  }
  
}
