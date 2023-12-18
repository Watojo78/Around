import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

const token = sessionStorage.getItem('token');
const headers = new HttpHeaders()
  .set('Authorization', `Bearer ${token}`)

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  newAccountImage(data: any): Observable<any>{
    const url = this.apiUrl + '/api-around2/image/comptes/';
    return this.http.post(url, data, {headers: headers});
  }//ok

  getAccountImage(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/image/user/${id}`;
    return this.http.get(url, {headers: headers});
  }//ok

  newCatImage(data: any): Observable<any>{
    const url = this.apiUrl + '/api-around2/image/categorie/';
    return this.http.post(url, data, {headers: headers});
  }

  getCatImage(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/image/categorie/${id}`;
    return this.http.get(url, {headers: headers});
  }

  newShopImage(data: any): Observable<any>{
    const url = this.apiUrl + '/api-around2/image/boutique/';
    return this.http.post(url, data, {headers: headers});
  }

  getBoutiqueImage(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/image/boutique/${id}`;
    return this.http.get(url, {headers: headers});
  }

  getAllImages(): Observable<any>{
    const url = this.apiUrl + '/api-around2/image/';
    return this.http.get(url, {headers: headers});
  } 

  updateImage(id:number, data: any): Observable<any>{
    const url = this.apiUrl + `/api-around2/image/update/${id}/`;
    return this.http.put(url, data, {headers: headers});
  }

}
