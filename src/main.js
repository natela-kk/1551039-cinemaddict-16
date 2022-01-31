import {renderElement} from './mock/render.js';
import {RenderPosition} from './const.js';
import AvatarView from './view/user-name-view.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import StatsView from './view/stats-view.js';
import {MenuItem} from './const.js';
import {filter} from './mock/utils/filter.js';
import {FilterType} from './const.js';
import ApiService from './api-service.js';

export const AUTHORIZATION = 'Basic ghcfk6r64ft';
export const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict/';

export const moviesModel = new MoviesModel(new ApiService(END_POINT, AUTHORIZATION));
const headerElement = document.querySelector('.header');
export const mainElement = document.querySelector('.main');


const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(mainElement, filterModel, moviesModel);
export const movieListPresenter = new MovieListPresenter(mainElement, moviesModel, filterModel, filterPresenter);
renderElement(headerElement, new AvatarView(), RenderPosition.BEFOREEND);


export const handleSiteMenuClick = (menuItem) => {
  const watchedMovies = filter[FilterType.HISTORY](movieListPresenter.movies);
  if (menuItem === MenuItem.STATISTICS && document.querySelector('.statistic__chart')) {
    return;
  } if (menuItem === MenuItem.STATISTICS) {
    const statsComponent = new StatsView(watchedMovies, 'all-time');
    movieListPresenter.destroy();
    movieListPresenter.extraComponent.element.remove();
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
    }
    movieListPresenter.clearMoviesContainer({
      resetRenderedMoviesCount: true,
      resetSortType: true
    });
    movieListPresenter.renderMoviesContainer();
    filterPresenter.filterComponent.setMenuClickHandler(handleSiteMenuClick);
    if(!document.querySelector('.films-list--extra')) {
      movieListPresenter.renderExtraElement();
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
movieListPresenter.init();

moviesModel.init();
