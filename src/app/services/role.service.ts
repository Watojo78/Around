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
export class RoleService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  newRole(data: any): Observable<any>{
    const url = this.apiUrl + '/api-around2/role/';
    return this.http.post(url, data, {headers: headers});
  }

  getAllRoles(): Observable<any>{
    const url = this.apiUrl + '/api-around2/role/';
    return this.http.get(url, {headers: headers});
  } //ok

  updateRole(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/role/update/${id}`;
    return this.http.patch(url, {headers: headers});
  }

  delRole(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/role/${id}`;
    return this.http.delete(url, { headers: headers });
  }

}
