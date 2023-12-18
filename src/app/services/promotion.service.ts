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
export class PromotionService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  newPromotion(data: any): Observable<any>{
    const url = this.apiUrl + '/api-around2/promotion/';
    return this.http.post(url, data, {headers: headers});
  }

  getAllPromotions(): Observable<any>{
    const url = this.apiUrl + '/api-around2/promotion/';
    return this.http.get(url, {headers: headers});
  } //ok

  updatePromotion(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/promotion/update/${id}`;
    return this.http.patch(url, {headers: headers});
  }

  delPromotion(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/promotion/${id}`;
    return this.http.delete(url, { headers: headers });
  }

}
