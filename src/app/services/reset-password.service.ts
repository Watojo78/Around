import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const token = sessionStorage.getItem('token');
const headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('Authorization', `Bearer ${token}`)

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  initiatePassReset(email: string): Observable<string>{
    const url = this.apiUrl + `/api-around2/passReset/initiate?email=${email}`;
    return this.http.post<string>(url, {headers: headers})
  }

  verifyPassReset(data: any): Observable<any>{
    const url = this.apiUrl + `/api-around2/passReset/verify?email=${data.email}&code=${data.otp}`;
    return this.http.post(url, data, {headers: headers})
  }

  passReset(data: any): Observable<any>{
    const url = this.apiUrl + `/api-around2/passReset/reset?email=${data.email}&code=${data.otp}&newPassword=${data.newPassword}`;
    return this.http.post(url, data, {headers: headers})
  }
}
