import { Routes } from '@angular/router';
import { TheatreListComponent } from './components/theatre-list/theatre-list.component'; // Changed from TheaterListComponent
import { BookingComponent } from './components/booking/booking.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { LayoutComponent } from './components/layout/layout.component';
import { TheatreLayoutComponent } from './components/theatre-layout/theatre-layout.component';
import { HomeComponent } from './components/home/home.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';

export const routes: Routes = [
  { path: '', component: MovieListComponent },
  { path: 'movies', component: MovieListComponent },
  {
    path: 'theatres/:movieId',
    component: TheatreListComponent
  },
  {
    path: 'my-bookings',
    component: MyBookingsComponent
  },
  {
    path: 'booking/:movieId/:theatreId',
    component: BookingComponent
  },
  {
    path: 'theatre-layout',
    component: TheatreLayoutComponent
  },
  {
    path: 'seat-booking',
    loadComponent: () => import('./components/booking/booking.component').then(m => m.BookingComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
