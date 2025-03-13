import { CommonModule, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CitiesService } from '../../services/cities.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, AsyncPipe, LoginComponent, SignupComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
  navItems = [
    { name: 'Home', url: '/movie-list', active: true },
    { name: 'Features', url: '/home-list' },
    { name: 'My Bookings', url: '/my-bookings' },
  ];

  cities: string[] = [];
  selectedCity: string = 'Bangalore';

  showLoginPopup = false;
  showSignupPopup = false;

  constructor(
    private citiesService: CitiesService,
    public authService: AuthService
  ) {}

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
}
