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
export class NeighborhoodService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  newNeighborhood(data: any): Observable<any>{
    const url = this.apiUrl + '/api-around2/quartier/';
    return this.http.post(url, data, {headers: headers});
  }

  getAllNeighborhoods(): Observable<any>{
    const url = this.apiUrl + '/api-around2/quartier/';
    return this.http.get(url, {headers: headers});
  } //ok

  updateNeighborhood(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/quartier/update/${id}`;
    return this.http.patch(url, {headers: headers});
  }

  delNeighborhood(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/quartier/${id}`;
    return this.http.delete(url, { headers: headers });
  }
}
