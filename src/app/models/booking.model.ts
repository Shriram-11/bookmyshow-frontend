export interface Booking {
    bookingId: string;
    movieName: string;
    showDate: Date;
    showTime: string;
    seats: string[];
    totalAmount: number;
    theaterName: string;
    bookingDate: Date;
}

export interface Movie {
  id: string;
  name: string;
  genre: string;
  cast: string;
  likes: number;
  rating: number;
  description: string;
  posterUrl: string;
  releaseDate: string;
  created: string;
  updated: string;
}

export interface ShowTime {
  id: string;
  movieName: string;
  showTime: string;
  showDate: string;
  screenId: string;
  bookedSeats: string;
  bookedSeatsArray?: string[];
  availableSeats?: number;
}

export interface TheatreShowResponse {
  theatreId: string;
  showTimes: ShowTime[];
}

export interface Theatre {
  id: string;
  name: string;
  address: string;
  showTimes?: ShowTime[];
}

export interface BookingDetails {
  movieId: string;
  theatreId: string;
  showTimeId: string;
  showTime: string;
  showDate: string;
  movieName: string;
  theatreName: string;
  bookedSeats: string[];
  availableSeats: number;
  maxSeats: number;
  totalSeats: number;
}

export interface ShowSelection {
  movieId: string;
  theatreId: string;
  showTimeId: string;
  showDate: string;
  showTime: string;
  movieName: string;
  theatreName: string;
  screenId: string;
  ticketPrice: number;
  bookedSeats: string[];
  availableSeats: number;
}

export interface BookingRequest {
  showTimeId: string;
  seats: string;
  amount: number;
  count: number;

}

export interface BookingResponse {
  bookingId: string;
  status: 'CONFIRMED' | 'PENDING' | 'FAILED';
  showDetails: ShowSelection;
  transactionId?: string;
  bookingTime: string;
  paymentStatus: string;
}

export interface UserBookingDetails {
  bookingId: string;
  userId: string;
  moviName: string;
  totalAmount: number;
  theatreName: string;
  theatreLocation: string;
  bookingDate: string;
  showDate: string;
  showTime: string;
  seats: string;
  count: number;
}
