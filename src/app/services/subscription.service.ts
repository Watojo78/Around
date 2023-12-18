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
export class SubscriptionService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  newSubscription(data: any): Observable<any>{
    const url = this.apiUrl + '/api-around2/souscription/';
    return this.http.post(url, data, {headers: headers});
  }

  getAllCountries(): Observable<any>{
    const url = this.apiUrl + '/api-around2/souscription/';
    return this.http.get(url, {headers: headers});
  } //ok

  updateSubscription(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/souscription/update/${id}`;
    return this.http.patch(url, {headers: headers});
  }

  delSubscription(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/souscription/${id}`;
    return this.http.delete(url, { headers: headers });
  }

}
