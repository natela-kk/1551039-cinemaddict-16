import { renderElement } from './mock/render.js';
import { RenderPosition } from './mock/generate.js';
import AvatarView from './view/user-name-view.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import { getMovieList } from './mock/generate.js';
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';

const headerElement = document.querySelector('.header');
export const mainElement = document.querySelector('.main');

export const allMovies = getMovieList();

const moviesModel = new MoviesModel();
moviesModel.movies = allMovies;

const filterModel = new FilterModel();

export const movieListPresenter = new MovieListPresenter(mainElement, moviesModel);

renderElement(headerElement, new AvatarView(), RenderPosition.BEFOREEND);
movieListPresenter.init();
