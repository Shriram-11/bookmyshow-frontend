import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieListComponent } from '../movie-list/movie-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MovieListComponent],
  template: `
    <div class="container">
      <h2>Featured Movies</h2>
      <app-movie-list></app-movie-list>
    </div>
  `
})
export class HomeComponent {}
