import { renderElement } from './mock/render.js';
import { RenderPosition } from './mock/generate.js';
// import './view/popup-view.js';
// import './view/cards-list.js';
import AvatarView from './view/user-name-view.js';
import CardsView from './view/cards-view.js';
import PopupView from './view/popup-view.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import { getMovieList } from './mock/generate.js';

const headerElement = document.querySelector('.header');
export const mainElement = document.querySelector('.main');

export const allMovies = getMovieList();


renderElement(headerElement, new AvatarView(), RenderPosition.BEFOREEND);

export const addCard = (movie) => {
  const cardsContainer = document.querySelector('.films-list__container');

  const cardComponent = new CardsView(movie);
  cardComponent.addClickHandler(movie, () => {
    new PopupView(movie).postClickHandler(movie, cardComponent);
  });

  renderElement(cardsContainer, cardComponent, RenderPosition.BEFOREEND);
};


export const renderMovies = (start, end) => {
  allMovies.slice(start, end)
    .forEach((movie) => {
      addCard( movie);
    });
};


export const presenter = new MovieListPresenter(mainElement);
presenter.init(allMovies);
