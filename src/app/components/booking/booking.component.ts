import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingDetails } from '../../models/booking.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  bookingDetails!: BookingDetails;
  selectedSeats: number = 1;
  maxAllowedSeats: number = 10;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { bookingDetails: BookingDetails };
    
    if (state?.bookingDetails) {
      this.bookingDetails = state.bookingDetails;
      this.maxAllowedSeats = Math.min(this.bookingDetails.maxSeats || 10, this.bookingDetails.availableSeats);
    } else {
      this.router.navigate(['/movies']);
    }
  }

  ngOnInit(): void {}

  increaseSeats() {
    if (this.selectedSeats < this.maxAllowedSeats) {
      this.selectedSeats++;
    }
  }

  decreaseSeats() {
    if (this.selectedSeats > 1) {
      this.selectedSeats--;
    }
  }

  canProceed(): boolean {
    return this.selectedSeats > 0 && this.selectedSeats <= this.maxAllowedSeats;
  }

  proceedToSeatLayout() {
    this.router.navigate(['/theatre-layout'], {
      state: { 
        bookingDetails: {
          ...this.bookingDetails,
          totalSeats: this.selectedSeats
        }
      }
    });
  }

  cancel() {
    const movieId = this.bookingDetails.movieId;
    this.router.navigate(['/theatres', movieId]);
  }
}
