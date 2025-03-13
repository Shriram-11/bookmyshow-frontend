import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  login(email: string, password: string): void {
    // Dummy login - always returns true
    this.isAuthenticated.next(true);
  }

  signup(email: string, password: string): void {
    // Dummy signup - always returns true
    this.isAuthenticated.next(true);
  }

  logout(): void {
    this.isAuthenticated.next(false);
  }

  getUserInfo(): any {
    return {
      name: 'John Doe',
      email: ''
    };
  }
}
