import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  private cities = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata'];
  private selectedCity = new BehaviorSubject<string>('Bangalore');

  getAvailableCities() {
    return this.cities;
  }

  getSelectedCity() {
    return this.selectedCity.asObservable();
  }

  setSelectedCity(city: string) {
    this.selectedCity.next(city);
  }
}
