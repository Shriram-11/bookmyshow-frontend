import { Routes } from '@angular/router';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { TheaterListComponent } from './components/theater-list/theater-list.component';
import { BookingComponent } from './components/booking/booking.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'movie-list', pathMatch: 'full' },
      { path: 'movie-list', component: MovieListComponent },
      { path: 'theaters', component: TheaterListComponent },
      { path: 'my-bookings', component: MyBookingsComponent },
      { path: 'book', component: BookingComponent }
    ]
  }
];
