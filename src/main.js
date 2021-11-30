import './view/popup.js';
import { createCardTemplate } from './view/cards-view.js';
import { generateMovie, renderTemplate, RenderPosition } from './view/render-data.js';
const POSTSCOUNT = 20;

const getMovieList = () => {
  const movies = [];
  for (let i = 1; i <= POSTSCOUNT; i++) {
    movies.push(generateMovie(i));
  }
  return movies;
};

const cardsContainer = document.querySelector('.films-list__container');
export const allMovies = getMovieList();
allMovies.forEach((card) => {
  renderTemplate(cardsContainer, createCardTemplate(card), RenderPosition.BEFOREEND);
});
