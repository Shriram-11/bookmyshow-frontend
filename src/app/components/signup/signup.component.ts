import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  userName: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  phoneNumber: string = '';
  location: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const userData = {
      userName: this.userName,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      location: this.location
    };

    this.authService.signup(userData).subscribe({
      next: (response) => {
        // Handle successful signup without closing popup
        this.isLoading = false;
        // Clear form fields
        this.userName = '';
        this.password = '';
        this.confirmPassword = '';
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.phoneNumber = '';
        this.location = '';
        // Show success message
        this.errorMessage = 'Signup successful! You can now log in.';
      },
      error: (error) => {
        this.errorMessage = error.message || 'Signup failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private isFormValid(): boolean {
    if (!this.userName || !this.password || !this.confirmPassword || 
        !this.firstName || !this.lastName || !this.email || 
        !this.phoneNumber || !this.location) {
      this.errorMessage = 'Please fill in all fields';
      return false;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }
    return true;
  }

  cancel() {
  
    this.router.navigate(['/movies']);
  }
}
