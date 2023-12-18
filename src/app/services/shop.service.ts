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
export class ShopService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  newShop(data: any): Observable<any>{
    const url = this.apiUrl + '/api-around2/boutique/';
    return this.http.post(url, data, {headers: headers});
  } //ok

  getShopDetail(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/boutique/${id}`;
    return this.http.get(url, {headers: headers});
  }

  getAllShops(): Observable<any>{
    const url = this.apiUrl + '/api-around2/boutique/';
    return this.http.get(url, {headers: headers});
  } //ok

  updateShop(id: any): Observable<any>{
    const url = this.apiUrl + `/api-around2/boutique/update/${id}`;
    return this.http.patch(url, {headers: headers});
  }

  deleteShop(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/boutique/${id}`;
    return this.http.delete(url, { headers: headers });
  } //ok

  activateShop(id: any): Observable<any>{
    const url = this.apiUrl + `/api-around2/boutique/validate/${id}`;
    return this.http.patch(url, {headers: headers});
  }

  deactivateShop(id: any): Observable<any>{
    const url = this.apiUrl + `/api-around2/boutique/invalidate/${id}`;
    return this.http.patch(url, {headers: headers});
  }
}
