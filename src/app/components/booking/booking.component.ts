import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

interface ShowTime {
  time: string;
  availableSeats: number;
}

@Component({
  selector: 'app-booking',
  imports: [CommonModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  selectedMovie: any;
  selectedTime: ShowTime | null = null;
  selectedSeats: number = 1;
  showTimes: ShowTime[] = [];
  userInfo: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userInfo = this.authService.getUserInfo();
    this.getMovie();
  }

  getMovie() {
    // Dummy movie data with dynamic show times
    this.selectedMovie = {
      title: 'Sample Movie',
      poster: 'movie.png',
      price: 200,
      theatre: {
        name: 'INOX Multiplex',
        location: 'Phoenix Mall, Mumbai',
        facilities: ['Parking', 'Food Court', 'Dolby Atmos', '4K'],
      },
      showTimes: [
        { time: '10:00 AM', availableSeats: 12 },
        { time: '1:00 PM', availableSeats: 80 },
        { time: '4:00 PM', availableSeats: 150 },
        { time: '7:00 PM', availableSeats: 30 },
        { time: '10:00 PM', availableSeats: 100 }
      ]
    };
    this.showTimes = this.selectedMovie.showTimes;
  }

  selectTime(time: ShowTime) {
    this.selectedTime = time;
    this.selectedSeats = 1; // Reset seats when show time changes
  }

  increaseSeats() {
    if (this.selectedTime && this.selectedSeats < this.selectedTime.availableSeats) {
      this.selectedSeats++;
    }
  }

  decreaseSeats() {
    if (this.selectedSeats > 1) {
      this.selectedSeats--;
    }
  }

  canBook(): boolean {
    return this.selectedMovie && this.selectedTime && this.selectedSeats > 0;
  }

  bookTickets() {
    if (this.canBook()) {
      console.log('Booking tickets:', {
        movie: this.selectedMovie,
        time: this.selectedTime,
        seats: this.selectedSeats,
        user: this.userInfo
      });
    }
  }
}
