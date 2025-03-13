import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe, LoginComponent, SignupComponent],
  template: `
    <header>
      <h1>BookMyShow</h1>
      <div class="auth-buttons">
        @if (!(authService.isAuthenticated$ | async)) {
          <button (click)="showLogin()">Login</button>
          <button (click)="showSignup()">Sign Up</button>
        } @else {
          <button (click)="logout()">Logout</button>
        }
      </div>
      @if (showLoginPopup) {
        <app-login />
      }
      @if (showSignupPopup) {
        <app-signup />
      }
    </header>
  `,
  styles: [`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: #f8f9fa;
    }
    .auth-buttons {
      display: flex;
      gap: 10px;
    }
  `]
})
export class HeaderComponent {
  showLoginPopup = false;
  showSignupPopup = false;

  constructor(public authService: AuthService) {}

  showLogin() {
    this.showLoginPopup = true;
    this.showSignupPopup = false;
  }

  showSignup() {
    this.showSignupPopup = true;
    this.showLoginPopup = false;
  }

  logout() {
    this.authService.logout();
  }
}
