import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Theatre, 
  TheatreShowResponse, 
  ShowTime,
  BookingRequest,
  BookingResponse,
  ShowSelection 
} from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class TheatreService {
  private apiUrl = environment.apiBaseUrl;
  private TOTAL_SEATS = 100;

  constructor(private http: HttpClient) {}

  getShowTimes(movieId: string, city: string): Observable<TheatreShowResponse[]> {
    return this.http.get<TheatreShowResponse[]>(`${this.apiUrl}/api/shows?movieId=${movieId}&location=${city}`);
  }

  getTheatreDetails(id: string): Observable<Theatre> {
    return this.http.get<Theatre>(`${this.apiUrl}/api/theatres/${id}`);
  }


  processBookedSeats(showTime: ShowTime): ShowTime {
    try {
      console.log('Processing booked seats:', showTime.bookedSeats);
      const bookedSeatsArray = showTime.bookedSeats
        ? showTime.bookedSeats.match(/[a-zA-Z]\d+/g)?.map(seat => seat.toUpperCase()) || []
        : [];
      
      const availableSeats = Math.max(0, this.TOTAL_SEATS - bookedSeatsArray.length);

      return {
        ...showTime,
        bookedSeatsArray,
        availableSeats
      };
    } catch (error) {
      console.error('Error processing booked seats:', error);
      return {
        ...showTime,
        bookedSeatsArray: [],
        availableSeats: this.TOTAL_SEATS
      };
    }
  }

  getShowStatus(showTimeId: string): Observable<{
    availableSeats: number;
    bookedSeats: string[];
  }> {
    return this.http.get<{
      availableSeats: number;
      bookedSeats: string[];
    }>(`${this.apiUrl}/shows/${showTimeId}/status`);
  }
}
