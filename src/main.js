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
export const movieListPresenter = new MovieListPresenter(mainElement, moviesModel, filterModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, moviesModel, statsComponent, movieListPresenter);
renderElement(headerElement, new AvatarView(), RenderPosition.BEFOREEND);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ALL:
      // Скрыть статистику
      // Показать фильтры
      // Показать доску
      // Показать форму добавления новой задачи
      // Убрать выделение с ADD NEW TASK после сохранения
      break;
    case MenuItem.WATCHLIST:
      // Скрыть статистику
      // Показать фильтры
      // Показать доску
      // Показать форму добавления новой задачи
      // Убрать выделение с ADD NEW TASK после сохранения
      break;
    case MenuItem.HISTORY:
      // Скрыть статистику
      // Показать фильтры
      // Показать доску
      // Показать форму добавления новой задачи
      // Убрать выделение с ADD NEW TASK после сохранения
      break;
    case MenuItem.FAVORITES:
      // Показать фильтры
      // Показать доску
      // Скрыть статистику
      break;
    case MenuItem.STATISTICS:
      // Скрыть фильтры
      // Скрыть доску
      // Показать статистику
      break;
  }
};

filterPresenter.init();
movieListPresenter.init();
renderElement(mainElement, statsComponent, RenderPosition.BEFOREEND);
filterPresenter.filterComponent.setMenuClickHandler(handleSiteMenuClick);

// filterPresenter.filterComponent.setShowStats(movieListPresenter);
