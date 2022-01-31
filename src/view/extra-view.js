import AbstractView from './abstract-view.js';
// import moviesModel from '../model/movies-model.js';
import MoviePresenter from '../presenter/movie-presenter.js';

import { renderElement } from '../mock/render.js';
import { RenderPosition } from '../const.js';
import {  sortMovieCommmentsDown,
  sortMovieRatingDown
} from '../mock/utils/utils.js';
export const POSTSCOUNT = 22;

const createExtraTemplate = () => (
  `<div class="films-list__container">
  <section class="films-list films-list--extra">
  <h2 class="films-list__title">Top rated</h2>
  <div class="films-list__container top-rated">
  </div>
</section>

<section class="films-list films-list--extra">
  <h2 class="films-list__title">Most commented</h2>

  <div class="films-list__container most-commented">
  </div>
</section>
</div>`
);

export default class ExtraView extends AbstractView {
  get template() {
    return createExtraTemplate();
  }

  constructor(movies, movieListPreseter) {
    super();
    this.movies = movies;
    this.movieListPreseter = movieListPreseter;
    this.init();
  }

  init() {
    this.renderTopRatedCards();
    this.renderMostCommentedCards();
  }

  renderTopRatedCards() {
    this.raitingSortedMovies = this.movies.sort(sortMovieRatingDown);
    this.topRatedMovies = [this.raitingSortedMovies[0], this.raitingSortedMovies[1]];
    this.topRatedMovies.forEach((movie) => {
      this.renderMovie(movie, null, 'top-rated');
    });
  }

  renderMostCommentedCards() {
    this.commentsLengthSortedMovies = this.movies.sort(sortMovieCommmentsDown);
    this.mostCommentedMovies = [this.commentsLengthSortedMovies[0], this.commentsLengthSortedMovies[1]];
    this.mostCommentedMovies.forEach((movie) => {
      this.renderMovie(movie, null, 'most-commented');
    });
  }

  renderMovie = (movie, commentToDelete, extraList) => {
    console.log(this.element);
    console.log(extraList);
    console.log(this.element.querySelector('.top-rated'));
    const extraListContainer = extraList === 'top-rated' ? this.element.querySelector('.top-rated') : this.element.querySelector('.most-commented');
    const moviePresenter = new MoviePresenter(extraListContainer, this.movieListPreseter, this.movieListPreseter.handleViewAction, this.movieListPreseter.handleModeChange);
    moviePresenter.initCard(movie);
    moviePresenter.initPopup(movie, commentToDelete, this.movieListPreseter.filterPresenter);
    // this.moviePresenter.set(movie.id, moviePresenter);
  };

}
