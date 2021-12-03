import { createCardTemplate } from './cards-view.js';
import { generateMovie, renderTemplate, RenderPosition } from './render-data.js';
import { POSTSCOUNT } from './extra-view.js';

const NEXTPOSTS_COUNT = 5;
const EXTRA_COUNT = 2;

const getMovieList = () => {
  const movies = [];
  for (let i = 1; i <= POSTSCOUNT; i++) {
    movies.push(generateMovie(i));
  }
  return movies;
};

const cardsContainer = document.querySelector('.films-list__container');
export const allMovies = getMovieList();

const showMoreButton = document.querySelector('.films-list__show-more');

const createCards = (startFrom, endOn) => {
  for (let i = startFrom; i < endOn; i++) {
    renderTemplate(cardsContainer, createCardTemplate(allMovies[i]), RenderPosition.BEFOREEND);
  }
};

let start = 0;
let end = NEXTPOSTS_COUNT;

const createCard = (count) => {
  start += count;
  end += count;
  if (end <= POSTSCOUNT) {
    createCards(start, end);
  } else {
    createCards(start, POSTSCOUNT);
    showMoreButton.classList.add('visually-hidden');
  }
};
createCard(0);

showMoreButton.addEventListener('click', () => {
  createCard(NEXTPOSTS_COUNT);
});

const watchListCount = document.querySelector('a[href="#watchlist"]').querySelector('span');
const historyCount = document.querySelector('a[href="#history"]').querySelector('span');
const favoritesCount = document.querySelector('a[href="#favorites"]').querySelector('span');

const watchlistMovies = allMovies.filter((movie) =>
  movie.userDetails.watchlist);
watchListCount.textContent = watchlistMovies.length;

const historyMovies = allMovies.filter((movie) =>
  movie.userDetails.already_watched);
historyCount.textContent = historyMovies.length;

const favoritesMovies = allMovies.filter((movie) =>
  movie.userDetails.favorite);
favoritesCount.textContent = favoritesMovies.length;

const extraLists = document.querySelectorAll('.films-list--extra');
const topRated = extraLists[0].querySelector('.films-list__container');
for (let i = 0; i < EXTRA_COUNT; i++) {
  renderTemplate(topRated, createCardTemplate(allMovies[i]), RenderPosition.BEFOREEND);
}
const mostCommented = extraLists[1].querySelector('.films-list__container');
for (let i = 0; i < EXTRA_COUNT; i++) {
  renderTemplate(mostCommented, createCardTemplate(allMovies[i]), RenderPosition.BEFOREEND);
}

