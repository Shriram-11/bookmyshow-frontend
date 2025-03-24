import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingDetails, BookingRequest } from '../../models/booking.model';
import { environment } from '../../../environments/environment';
import confetti from 'canvas-confetti';
import { BookingSuccessDialogComponent } from '../booking-success-dialog/booking-success-dialog.component';
import { BookingConfirmationDialogComponent } from '../booking-confirmation-dialog/booking-confirmation-dialog.component';

@Component({
  selector: 'app-theatre-layout',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './theatre-layout.component.html',
  styleUrls: ['./theatre-layout.component.scss']
})
export class TheatreLayoutComponent implements OnInit {
  isloading = false;
  movieTitle = 'Inception';
  screen = 'Screen 1';
  time = '10:30 AM';
  rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H','I','J'];
  cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selected: string[] = [];
  reserved: string[] = [];
  ticketPrice = 250;
  convFee = 30;
  currency = '₹';
  bookingDetails!: BookingDetails;
  maxSeats: number = 0;
  baseUrl = environment.apiBaseUrl;
  requiredSeats: number = 0;

  constructor(
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { bookingDetails: BookingDetails };
    
    if (state?.bookingDetails) {
      this.bookingDetails = state.bookingDetails;
      this.movieTitle = this.bookingDetails.movieName;
      this.time = this.bookingDetails.showTime;
      this.maxSeats = this.bookingDetails.totalSeats;
      this.requiredSeats = this.bookingDetails.totalSeats;
      this.reserved = this.bookingDetails.bookedSeats;
    } else {
      this.router.navigate(['/movies']); // Redirect if no booking details
    }
  }

  ngOnInit(): void {
    console.log(this.bookingDetails.bookedSeats)
    // Initialize with some reserved seats for testing
    this.reserved =this.bookingDetails.bookedSeats;
    // Make sure cols is correctly defined
    this.cols = Array.from({length: 10}, (_, i) => i + 1);
  }

  getStatus(seatId: string): any {
    if (this.selected.includes(seatId)) return 'selected';
    if (this.reserved.includes(seatId)) return 'reserved';
    if (this.selected.length >= this.requiredSeats) return 'disabled free';
    return 'free';
  }

  seatClicked(seatId: string): void {
    const status = this.getStatus(seatId);
    console.log(seatId);
    if (status === 'reserved') {
      return;
    }
    
    const index = this.selected.indexOf(seatId);
    if (index !== -1) {
      this.selected.splice(index, 1);
    } else {
      if (this.selected.length < this.requiredSeats) {
        this.selected.push(seatId);
        this.selected.sort();
      }
    }
  }

  clearSelected(): void {
    this.selected = [];
  }

  showSelected(): void {
    if (this.selected.length !== this.requiredSeats) {
      alert(`Please select exactly ${this.requiredSeats} seats`);
      return;
    }

    const totalAmount = this.selected.length * this.ticketPrice + this.convFee;
    
    // Show confirmation dialog
    const dialogRef = this.dialog.open(BookingConfirmationDialogComponent, {
      width: '400px',
      data: {
        movieTitle: this.movieTitle,
        seats: this.selected,
        totalAmount: totalAmount
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.proceedWithBooking(totalAmount);
      }
    });
  }

  private proceedWithBooking(totalAmount: number): void {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.isloading = true;
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  
    const bookingRequest: BookingRequest = {
      showTimeId: this.bookingDetails.showTimeId,
      seats: String(this.selected.join(',')),
      amount: totalAmount,
      count: this.selected.length
    };
  
    this.http.post(`${this.baseUrl}/api/user/bookings`, bookingRequest, {
      headers,
      responseType: 'text'
    })
      .subscribe({
        next: (response) => {
          console.log('Booking created:', response);
          console.log('Selected seats:', this.selected);
          
          // Perform the PUT request to update booked seats
          const updateBookedSeatsUrl = `${this.baseUrl}/api/movies/${this.bookingDetails.showTimeId}/update-booked-seats`;
          const updateRequestBody = {
            bookedSeats: this.selected.join(',')
          };
  
          this.http.put(updateBookedSeatsUrl, updateRequestBody, { headers })
            .subscribe({
              next: (updateResponse) => {
                console.log('Booked seats updated:', updateResponse);
                this.isloading = false;
                this.showSuccessDialog();
              },
              error: (updateError) => {
                console.error('Failed to update booked seats:', updateError);
                this.isloading = false
                alert('Booking successful but failed to update booked seats. Please contact support.');
              }
            });
        },
        error: (error) => {
          console.error('Booking failed:', error);
          this.isloading = false;
          alert('Failed to create booking. Please try again.');
        }
      });
  }

  showSuccessDialog(): void {
    // Trigger confetti effect
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const myConfetti = confetti.create(canvas, {
      resize: true,
    });

    if (myConfetti) {
      void myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
      });

      // Remove canvas after animation
      setTimeout(() => {
        document.body.removeChild(canvas);
      }, 3000);
    }

    const dialogRef = this.dialog.open(BookingSuccessDialogComponent, {
      width: '400px',
      disableClose: true,
      backdropClass: 'backdropBackground'

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'home') {
        this.router.navigate(['']);
      } else {
        this.router.navigate(['my-bookings']);
      }
    });
  }

  cancel() {
    
    const movieId = this.bookingDetails.movieId;
    this.router.navigate(['/theatres', movieId]);
  }
  
}
