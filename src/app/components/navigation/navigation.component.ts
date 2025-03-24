import { CommonModule, AsyncPipe, NgIf, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CitiesService } from '../../services/cities.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, LoginComponent, SignupComponent, RouterModule, NgFor],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
  navItems = [
    { name: 'Home', url: 'movie-list', active: true },
    { name: 'My Bookings', url: 'my-bookings' },
  ];

  cities: string[] = [];
  selectedCity: string = 'Bangalore';

  showLoginPopup = false;
  showSignupPopup = false;
  isLoggedIn = false;
  showCityDialog = false;

  constructor(
    private citiesService: CitiesService,
    public authService: AuthService,
    private router: Router
  ) {
    // Subscribe to auth state changes
    this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
        if (isAuthenticated) {
          // Close popups when user is authenticated
          this.showLoginPopup = false;
          this.showSignupPopup = false;
        }
      }
    );

    // Check if city was previously selected
    const hasSelectedCity = localStorage.getItem('hasSelectedCity');
    if (!hasSelectedCity) {
      this.showCityDialog = true;
    }
  }

  ngOnInit() {
    this.cities = this.citiesService.getAvailableCities();
    this.citiesService.getSelectedCity().subscribe(city => {
      this.selectedCity = city;
    });
  }

  onCityChange(event: any) {
    this.citiesService.setSelectedCity(event.target.value);
  }

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

  selectInitialCity(city: string) {
    this.citiesService.setSelectedCity(city);
    this.showCityDialog = false;
    localStorage.setItem('hasSelectedCity', 'true');
  }

  shouldShowCitySelector(): boolean {
    const currentRoute = this.router.url;
    return currentRoute === '/' || currentRoute.includes('/movies');
  }
}
