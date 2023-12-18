import { HttpClient, HttpHeaders } from '@angular/common/http';
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
export class ServiceService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  newService(data: any): Observable<any>{
    const url = this.apiUrl + '/api-around2/service/';
    return this.http.post(url, data, {headers: headers});
  } //ok

  getService(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/service/${id}`;
    return this.http.get(url, {headers: headers});
  }

  getAllServices(): Observable<any>{
    const url = this.apiUrl + '/api-around2/service/';
    return this.http.get(url, {headers: headers});
  } //ok

  updateService(id: any): Observable<any>{
    const url = this.apiUrl + `/api-around2/service/update/${id}`;
    return this.http.patch(url, {headers: headers});
  }

  delService(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/service/${id}`;
    return this.http.delete(url, { headers: headers });
  } //ok
}
