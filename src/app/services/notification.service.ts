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
export class NotificationService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllNotifications(): Observable<any>{
    const url = this.apiUrl + '/api-around2/notification/';
    return this.http.get(url, {headers: headers});
  } //ok
}
