import { renderElement } from './mock/render.js';
import { RenderPosition } from './mock/generate.js';
import AvatarView from './view/user-name-view.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import { getMovieList } from './mock/generate.js';

const headerElement = document.querySelector('.header');
export const mainElement = document.querySelector('.main');
export const movieListPresenter = new MovieListPresenter(mainElement);

export const allMovies = getMovieList();


renderElement(headerElement, new AvatarView(), RenderPosition.BEFOREEND);

movieListPresenter.init(allMovies);
