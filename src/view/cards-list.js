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

const createCard = (count) => {
  let start = 0;
  start += count;
  let end = NEXTPOSTS_COUNT;
  end += count;
  const createdCards = document.querySelectorAll('.film-card');
  if (end <= POSTSCOUNT) {
    for (let i = start; i < end; i++) {
      renderTemplate(cardsContainer, createCardTemplate(allMovies[i]), RenderPosition.BEFOREEND);
    }
  } else {
    const difference = (POSTSCOUNT - createdCards.length - 1);
    for (let i = start; i < end + difference; i++) {
      renderTemplate(cardsContainer, createCardTemplate(allMovies[i]), RenderPosition.BEFOREEND);
    }
    showMoreButton.classList.add('visually-hidden');
  }
};
createCard(0);


let addNumber = 0;
showMoreButton.addEventListener('click', () => {
  addNumber += NEXTPOSTS_COUNT;
  createCard(addNumber);
});

const watchListCount = document.querySelector('a[href="#watchlist"]').querySelector('span');
const historyCount = document.querySelector('a[href="#history"]').querySelector('span');
const favoritesCount = document.querySelector('a[href="#favorites"]').querySelector('span');

const watchlistMovies = allMovies.filter((movie) =>
  movie.userDetails.watchlist === true);
watchListCount.textContent = watchlistMovies.length;

const historyMovies = allMovies.filter((movie) =>
  movie.userDetails.already_watched === true);
historyCount.textContent = historyMovies.length;

const favoritesMovies = allMovies.filter((movie) =>
  movie.userDetails.favorite === true);
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

