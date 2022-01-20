import {renderElement} from './mock/render.js';
import {RenderPosition} from './mock/generate.js';
import AvatarView from './view/user-name-view.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import {getMovieList} from './mock/generate.js';
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import StatsView from './view/stats-view.js';
import {MenuItem} from './const.js';
import {filter} from './mock/utils/filter.js';
import {FilterType} from './const.js';

const headerElement = document.querySelector('.header');
export const mainElement = document.querySelector('.main');

export const allMovies = getMovieList();

const moviesModel = new MoviesModel();
moviesModel.movies = allMovies;

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(mainElement, filterModel, moviesModel);
export const movieListPresenter = new MovieListPresenter(mainElement, moviesModel, filterModel, filterPresenter);
renderElement(headerElement, new AvatarView(), RenderPosition.BEFOREEND);


export const handleSiteMenuClick = (menuItem) => {
  const watchedMovies = filter[FilterType.HISTORY](movieListPresenter.movies);
  if (menuItem === MenuItem.STATISTICS) {
    const statsComponent = new StatsView(watchedMovies, 'all-time');
    movieListPresenter.destroy();
    renderElement(mainElement, statsComponent, RenderPosition.BEFOREEND);
    statsComponent.element.classList.remove('visually-hidden');
    statsComponent.init();
  } else {
    const statisticElement = document.querySelector('.statistic');
    if (statisticElement) {
      statisticElement.remove();
    }

    if (!document.querySelector('.films-list__container')) {
      movieListPresenter.init();
    } else {
      movieListPresenter.clearMoviesContainer();
      movieListPresenter.renderMoviesContainer();
      filterPresenter.filterComponent.setMenuClickHandler(handleSiteMenuClick);
    }
  }
};

export const updateStatistic = (movies, currentFilter) => {
  const newStatsComponent = new StatsView(movies, currentFilter);
  document.querySelector('.statistic').remove();
  renderElement(mainElement, newStatsComponent, RenderPosition.BEFOREEND);
  newStatsComponent.element.classList.remove('visually-hidden');
  newStatsComponent.init();
  newStatsComponent.setStaticFilterChange();
};

filterPresenter.init();
movieListPresenter.init();
