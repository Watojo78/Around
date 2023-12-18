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
export class CityService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  newCity(data: any): Observable<any>{
    const url = this.apiUrl + '/api-around2/ville/';
    return this.http.post(url, data, {headers: headers});
  }

  getAllCities(): Observable<any>{
    const url = this.apiUrl + '/api-around2/ville/';
    return this.http.get(url, {headers: headers});
  } //ok

  updateCity(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/ville/update/${id}`;
    return this.http.patch(url, {headers: headers});
  }

  delCity(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/ville/${id}`;
    return this.http.delete(url, { headers: headers });
  }
}
