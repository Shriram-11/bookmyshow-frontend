import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitiesService } from '../../services/cities.service';
import { RouterModule } from '@angular/router';
interface Movie {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  city: string;
}

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];

  constructor(
    private citiesService: CitiesService
  ) { }

  ngOnInit() {
    this.citiesService.getSelectedCity().subscribe(city => {
      this.loadMovies(city);
    });
  }

  async loadMovies(city: string) {
    try {
      this.movies = (await this.get_movies()).filter(movie => movie.city === city);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  }

  private get_movies(): Promise<Movie[]> {
    return Promise.resolve([
      {
        id: 1,
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
        imageUrl: 'movie.png',
        city: 'Bangalore'
      },
      {
        id: 2,
        title: 'The Dark Knight',
        description: 'Batman fights against the chaos unleashed by the Joker.',
        imageUrl: 'movie.png',
        city: 'Mumbai'
      },
      {
        id: 3,
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space.',
        imageUrl: 'movie.png',
        city: 'Bangalore'
      },
      {
        id: 4,
        title: 'The Matrix',
        description: 'A computer programmer discovers a mysterious world.',
        imageUrl: 'movie.png',
        city: 'Bangalore'
      },
      {
        id: 5,
        title: 'Pulp Fiction',
        description: 'Various interconnected stories of criminals in Los Angeles.',
        imageUrl: 'movie.png',
        city: 'Bangalore'
      }
    ]);
  }
}
