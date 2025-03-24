import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitiesService } from '../../services/cities.service';
import { RouterModule, Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { Movie } from '../../models/booking.model';
import { environment } from '../../../environments/environment';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  @Input() limit?: number;
  movies: Movie[] = [];
  showRatingPopup = false;
  selectedMovie?: Movie;
  hoverRating = 0;
  nomovies = false;
  currentCity: string = '';  // Add this line
  displayCount = 3;  // Initial number of movies to display
  movieChunks: Movie[][] = [];  // To store movie chunks

  constructor(
    private citiesService: CitiesService,
    private router: Router,
    private authService: AuthService,
    private movieService: MovieService
  ) { }

  ngOnInit() {
    this.citiesService.getSelectedCity().subscribe(city => {
      this.currentCity = city;  // Add this line
      this.loadMovies(city);
    });
  }

  async loadMovies(city: string) {
    try {
      this.movieService.loadMovies(city).subscribe({
        next: (allMovies: any[]) => {
          this.movies = this.limit ? allMovies.slice(0, this.limit) : allMovies;
          this.initializeMovieChunks();
          this.nomovies = this.movies.length === 0;
        },
        error: (error: any) => {
          this.nomovies = true;
          console.error('Error loading movies:', error);
        }
      });
    } catch (error) {
      this.nomovies = true;
      console.error('Error loading movies:', error);
    }
  }

  initializeMovieChunks() {
    const chunkSize = 3;
    this.movieChunks = [];
    for (let i = 0; i < this.movies.length; i += chunkSize) {
      this.movieChunks.push(this.movies.slice(i, i + chunkSize));
    }
  }

  loadMore() {
    if (this.displayCount + 3 <= this.movies.length) {
      this.displayCount += 3;
    } else {
      this.displayCount = this.movies.length;
    }
  }

  shouldShowLoadMore(): boolean {
    return this.displayCount < this.movies.length;
  }

  isMovieLiked(movieId: string): boolean {
    const likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    return likedMovies.includes(movieId);
  }

  toggleLike(movie: Movie): void {
    const likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    const index = likedMovies.indexOf(movie.id);
    
    if (index === -1) {
      likedMovies.push(movie.id);
      movie.likes++;
    } else {
      likedMovies.splice(index, 1);
      movie.likes--;
      if (movie.likes < 0) {
        movie.likes = 0;}
    }
    
    localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
  }

  onBookClick(movieId: string): void {
    if (this.authService.getCurrentAuthStatus()) {
      console.log('Navigating to theatres with movieId:', movieId);
      this.router.navigate(['/theatres', movieId]).then(
        success => console.log('Navigation success:', success),
        error => console.error('Navigation error:', error)
      );
    } else {
      alert('Please login to book tickets');
    }
  }

  isBookingAllowed(): boolean {
    return this.currentCity !== 'All';
  }

  openRatingPopup(movie: Movie): void {
    this.selectedMovie = movie;
    this.showRatingPopup = true;
  }

  closeRatingPopup(): void {
    this.showRatingPopup = false;
    this.selectedMovie = undefined;
    this.hoverRating = 0;
  }

  setHoverRating(rating: number): void {
    this.hoverRating = rating;
  }

  submitRating(rating: number): void {
    if (this.selectedMovie) {
      this.selectedMovie.rating = rating;
      // Here you would typically make an API call to save the rating
      this.closeRatingPopup();
    }
  }

  dummygetmovies(){
    return this.movies=[{
      id: '1',
      name: 'Inception',
      genre: 'Sci-Fi', 
      cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page',
      rating: 4,
      likes: 100,
      posterUrl: 'movie.png',
      description: 'Inception is a 2010 science fiction action film written and directed by Christopher Nolan, who also produced the film with Emma Thomas, his wife. The film stars Leonardo DiCaprio as a professional thief who steals information by infiltrating the subconscious of his targets.',
      releaseDate: '2010-07-16',
      created:'2021-07-16',
      updated:'2021-07-16'}]
  }

  

}
