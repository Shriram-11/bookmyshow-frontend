import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) {}

  loadMovies(city: string): Observable<any> {
    if (!city) {
      console.error('No city provided');
      return throwError(() => new Error('No city provided'));
    }

    console.log('Loading city based:', city);

    const url = `${environment.apiBaseUrl}/api/movies?location=${city}`;
    return this.http.get(url, { withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error loading movies:', error);
        return throwError(() => error);
      })
    );
  }
}