import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl;
  private apiUrl = this.baseUrl+'/api/auth';
  private tokenKey = 'jwt_token';
  private testMode = false; // Add test mode flag
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.testMode);
  public isLoggedIn = false;
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check token and set authentication state on initialization
    const token = this.getToken();
    if (token) {
      this.isAuthenticatedSubject.next(true);
      this.isLoggedIn = true;
    }

    // Subscribe to authentication changes to keep isLoggedIn in sync
    this.isAuthenticatedSubject.subscribe(
      (authenticated) => this.isLoggedIn = authenticated
    );

    if (this.testMode) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  signup(userData: {
    userName: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    location: string
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData)
      .pipe(tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
        }
      }));
  }

  login(credentials: { emailOrUsername: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials)
      .pipe(tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
          console.log(response);
        }
      }));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('isAuthenticated'); // Add this line
    localStorage.removeItem('hasSelectedCity');

    this.isAuthenticatedSubject.next(false);
    this.isLoggedIn = false;
  }

  setAuthData(token: string): void {
    this.setToken(token);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem('isAuthenticated', 'true');
    this.isAuthenticatedSubject.next(true);
    this.isLoggedIn = true;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey) && localStorage.getItem('isAuthenticated') === 'true';
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

 

  getCurrentAuthStatus(): boolean {
    return this.isLoggedIn;
  }

  getUserInfo() {
    return {
      email: localStorage.getItem('user_email') || '',
      name: localStorage.getItem('user_name') || ''
    };
  }
}
