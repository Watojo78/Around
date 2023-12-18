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
export class RegionService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  newRegion(data: any): Observable<any>{
    const url = this.apiUrl + '/api-around2/region/';
    return this.http.post(url, data, {headers: headers});
  }

  getAllRegions(): Observable<any>{
    const url = this.apiUrl + '/api-around2/region/';
    return this.http.get(url, {headers: headers});
  } //ok

  updateRegion(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/region/update/${id}`;
    return this.http.patch(url, {headers: headers});
  }

  delRegion(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/region/${id}`;
    return this.http.delete(url, { headers: headers });
  }
}
