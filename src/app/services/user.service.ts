import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
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
    return this.http.get(url, { headers: headers })
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

  initiateActivation(email: string): Observable<any>{
    const url = this.apiUrl + `/api-around2/activation/initiate?email=${email}`;
    return this.http.post(url, email, {headers: headers});
  } //?

  verifyActivation(email: string): Observable<any>{
    const url = this.apiUrl + `/api-around2/activation/verify?email=${email}`;
    return this.http.post(url, {headers: headers});
  }

  changePassword(email: string, data: any): Observable<any>{
    const url = this.apiUrl + `/api-around2/users/${email}/change-password?oldPassword=${data.oldPassword}&newPassword=${data.newPassword}`;
    return this.http.post(url, data, {headers: headers});
  }

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

  getUsersCreatedBetween(startDate: string, endDate: string): Observable<any>{
    const url = this.apiUrl + `/api-around2/comptes/createdBetween/${startDate}/${endDate}`;
    return this.http.get(url, {headers: headers});
  }

}
