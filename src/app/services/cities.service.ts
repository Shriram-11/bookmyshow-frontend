import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  private cities = ['bangalore', 'mumbai','agara'];
  private selectedCity = new BehaviorSubject<string>('');
  private readonly STORAGE_KEY = 'selectedCity';

  constructor() {
    const savedCity = sessionStorage.getItem(this.STORAGE_KEY) || '';
    this.selectedCity.next(savedCity);
  }

  getAvailableCities() {
    return this.cities;
  }

  getSelectedCity() {
    return this.selectedCity.asObservable();
  }

  setSelectedCity(city: string) {
    sessionStorage.setItem(this.STORAGE_KEY, city);
    this.selectedCity.next(city);
  }
}
