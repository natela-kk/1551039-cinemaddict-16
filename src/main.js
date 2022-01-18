import { renderElement } from './mock/render.js';
import { RenderPosition } from './mock/generate.js';
import AvatarView from './view/user-name-view.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import { getMovieList } from './mock/generate.js';
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import StatsView from './view/stats-view.js';
import { MenuItem } from './const.js';

const headerElement = document.querySelector('.header');
export const mainElement = document.querySelector('.main');

export const allMovies = getMovieList();

const moviesModel = new MoviesModel();
moviesModel.movies = allMovies;

const filterModel = new FilterModel();

const statsComponent = new StatsView();
const filterPresenter = new FilterPresenter(mainElement, filterModel, moviesModel, statsComponent);
export const movieListPresenter = new MovieListPresenter(mainElement, moviesModel, filterModel, filterPresenter);
renderElement(headerElement, new AvatarView(), RenderPosition.BEFOREEND);

export const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ALL:
      console.log('all');
      // Скрыть статистику
      // Показать доску
      if(!document.querySelector('.films-list__container')) {
        movieListPresenter.init();
      }
      statsComponent.element.classList.add('visually-hidden');
      break;
    case MenuItem.WATCHLIST:
      console.log('WATCHLIST');
      if(!document.querySelector('.films-list__container')) {
        movieListPresenter.init();
      } else {
        movieListPresenter.clearMoviesContainer();
        movieListPresenter.renderMoviesContainer();
      }
      statsComponent.element.classList.add('visually-hidden');
      // Скрыть статистику
      // Показать доску
      break;
    case MenuItem.HISTORY:
      console.log('HISTORY');
      if(!document.querySelector('.films-list__container')) {
        movieListPresenter.init();
      } else {
        movieListPresenter.clearMoviesContainer();
        movieListPresenter.renderMoviesContainer();
      }
      statsComponent.element.classList.add('visually-hidden');
      // Скрыть статистику
      // Показать доску
      break;
    case MenuItem.FAVORITES:
      console.log('FAVORITES');
      if(!document.querySelector('.films-list__container')) {
        movieListPresenter.init();
      } else {
        movieListPresenter.clearMoviesContainer();
        movieListPresenter.renderMoviesContainer();
      }
      statsComponent.element.classList.add('visually-hidden');
      // Показать доску
      // Скрыть статистику
      break;
    case MenuItem.STATISTICS:
      console.log('STATISTICS');
      movieListPresenter.destroy();
      // movieListPresenter.clearMoviesContainer();
      statsComponent.element.classList.remove('visually-hidden');
      statsComponent.showStatistic();
      // Скрыть фильтры
      // Скрыть доску
      // Показать статистику
      break;
  }
};
statsComponent.movies = movieListPresenter.movies;
// statsComponent.movies = 'ok';

filterPresenter.init();
movieListPresenter.init();
renderElement(mainElement, statsComponent, RenderPosition.BEFOREEND);
