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
export class UserService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<any>{
    const url = this.apiUrl + '/api-around2/current-user';
    return this.http.get(url, { headers: headers });
  } //ok

  newUser(data: any): Observable<any>{
    const url = this.apiUrl + '/api-around2/register';
    return this.http.post(url, data, {headers: headers});
  } //ok

  getUser(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/comptes/${id}`;
    return this.http.get(url, {headers: headers});
  } //ok

  getAllUsers(): Observable<any>{
    const url = this.apiUrl + '/api-around2/comptes/all/';
    return this.http.get(url, {headers: headers});
  } //ok

  updateUser(id: number, data: any): Observable<any>{
    const url = this.apiUrl + `/api-around2/comptes/update/${id}`;
    return this.http.patch(url, data, {headers: headers});
  } //ok

  deleteAccount(id:number): Observable<any>{
    const url = this.apiUrl + `/api-around2/comptes/delete2/${id}`;
    return this.http.delete(url, { headers: headers });
  } //ok

  activateUser(id: number): Observable<any>{
    const url = this.apiUrl + `/api-around2/comptes/activate/${id}`;
    return this.http.put(url, {headers: headers});
  } //?

  changePassword(userEmail: string): Observable<any>{
    const url = this.apiUrl + `/api-around2/users/${userEmail}/change-password?oldPassword=&newPassword=`;
    return this.http.post(url, headers)
  } //implicate session reset, then relogin superAdmin

  getCurrentUserToken(): Observable<any> {
    // Retrieve the token from the chosen storage location
    const token:any = sessionStorage.getItem('token');
    return token;
  }

  decodeCurrrentUserToken(token: any): any {
    const tokenParts = token.split('.');
    const payloadBase64 = tokenParts[1];
    const payloadJson = JSON.parse(atob(payloadBase64));
    return payloadJson;
  }

}
