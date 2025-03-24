import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Theatre, TheatreShowResponse, ShowSelection, ShowTime,BookingDetails } from '../../models/booking.model';
import { CitiesService } from '../../services/cities.service';
import { TheatreService } from '../../services/theatre.service';
import { forkJoin, switchMap, map, catchError } from 'rxjs';

@Component({
  selector: 'app-theatre-list',
  imports: [CommonModule],
  templateUrl: './theatre-list.component.html',
  styleUrls: ['./theatre-list.component.scss'],
  standalone: true
})
export class TheatreListComponent implements OnInit {
  theatres: Theatre[] = [];
  movieId: string = '';
  city: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cityService: CitiesService,
    private theatreService: TheatreService
  ) {}

  ngOnInit() {
    console.log('TheatreListComponent initialized');
    
    this.cityService.getSelectedCity().pipe(
      switchMap(city => {
        this.city = city;
        return this.route.paramMap;
      }),
      switchMap(params => {
        const movieId = params.get('movieId');
        if (!movieId) throw new Error('No movieId provided');
        this.movieId = movieId;
        return this.theatreService.getShowTimes(movieId, this.city);
      }),
      switchMap((showResponse: TheatreShowResponse[]) => {
        const theatreRequests = showResponse.map(show => 
          this.theatreService.getTheatreDetails(show.theatreId).pipe(
            map(theatre => ({
              ...theatre,
              showTimes: show.showTimes.map(st => this.theatreService.processBookedSeats(st))
            }))
          )
        );
        return forkJoin(theatreRequests);
      })
    ).subscribe({
      next: (theatres) => this.theatres = theatres,
      error: (error) => console.error('Error loading theatres:', error)
    });
    console.log(this.theatres);
  }

  selectShow(theatre: Theatre, show: ShowTime) {
    if (!show.availableSeats || show.availableSeats === 0) {
      return;
    }
    
    const bookingDetails: BookingDetails = {
      movieId: this.movieId,
      theatreId: theatre.id,
      showTimeId: show.id,
      showTime: show.showTime,
      showDate: show.showDate,
      movieName: show.movieName,
      theatreName: theatre.name,
      bookedSeats: show.bookedSeatsArray || [],
      availableSeats: show.availableSeats,
      maxSeats: 10, // Maximum seats that can be booked at once
      totalSeats:0
    };

    // Change navigation path to '/seat-booking' to match your route configuration
    this.router.navigate(['/seat-booking'], { 
      state: { bookingDetails },
      replaceUrl: true // Add this to prevent back navigation issues
    });
  }
  goBack() {
    this.router.navigate(['/movies']);
  }
}
