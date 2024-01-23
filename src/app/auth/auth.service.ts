import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

interface CurrentUser {
  email: string;
  token: string;
}

@Injectable({providedIn: 'root'})

export class AuthService {
  apiUrl = environment.apiUrl;
  user$: BehaviorSubject<CurrentUser | null> = new BehaviorSubject<CurrentUser | null>(null);

  constructor(
    private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    const url = this.apiUrl + '/api-around2/generate-token';
    return this.http.post(url, { email, password })
      .pipe(
        tap(response => {
          if ('token' in response && response.token) {
            const user: CurrentUser = {
              email,
              token: response.token as string,
            };
            this.user$.next(user);
            sessionStorage.setItem('email', user.email)
            sessionStorage.setItem('token', user.token);
          }
        })
      );
  }

  isLoggedIn(): boolean {
    // Check if the token exists and hasn't expired
    const token = this.getToken();
    if (!token) {
      return false;
    }
  
    // Implement token expiration check if needed (e.g., based on token payload)
    // ...
  
    return true;
  }

  
  logout(): void {
    this.user$.next(null);
    this.router.navigate(['/admauth/login']);
    sessionStorage.removeItem('token');
  }

  getToken(): string | null {
    // Retrieve the token from the chosen storage location
    const token = sessionStorage.getItem('token');
    return token ? token : null;
  }
  
}
