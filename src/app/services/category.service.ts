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
export class CategoryService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  newCategorie(data: any): Observable<any>{
    const url = this.apiUrl + '/api-around2/categorie/';
    return this.http.post(url, data, {headers: headers});
  } //ok

  getCategorie(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/categorie/${id}`;
    return this.http.get(url, {headers: headers});
  }

  getAllCategories(): Observable<any>{
    const url = this.apiUrl + '/api-around2/categorie/';
    return this.http.get(url, {headers: headers});
  } //ok

  updateCategorie(id: any): Observable<any>{
    const url = this.apiUrl + `/api-around2/categorie/update/${id}`;
    return this.http.patch(url, {headers: headers});
  }

  delCategorie(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/categorie/${id}`;
    return this.http.delete(url, { headers: headers });
  } //ok
}
