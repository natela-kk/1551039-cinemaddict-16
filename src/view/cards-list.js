import CardsView from './cards-view.js';
// import { generateMovie } from './render-data.js';
import { RenderPosition } from './render-data.js';
// import { POSTSCOUNT } from './extra-view.js';
import { renderElement } from '../mock/render.js';
import { postClickHandler } from './popup-view.js';

const EXTRA_COUNT = 2;

// const getMovieList = () => {
//   const movies = [];
//   for (let i = 1; i <= POSTSCOUNT; i++) {
//     movies.push(generateMovie(i));
//   }
//   return movies;
// };

const cardsContainer = document.querySelector('.films-list__container');
// export const allMovies = getMovieList();
export const allMovies = [];

const addClickHandler = (place, movie) => {

  const cardComponent = new CardsView(movie);
  // cardComponent.element.querySelector('a').addEventListener('click', () => {
  //   postClickHandler(movie, cardComponent);
  // });

  ///метод
  cardComponent.addClickHandler(movie, () => {
    postClickHandler(movie, cardComponent);
  });
  ///
  renderElement(place, cardComponent, RenderPosition.BEFOREEND);
};

export const renderMovies = (start, end) => {
  allMovies.slice(start, end)
    .forEach((movie, index) => {
      addClickHandler(cardsContainer, movie, index);
    });
};

if(allMovies.length > 0) {
  // renderMovies(0, NEXT_POSTS_COUNT);

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
    addClickHandler(topRated, allMovies[i], i);
  }
  const mostCommented = extraLists[1].querySelector('.films-list__container');
  for (let i = 0; i < EXTRA_COUNT; i++) {
    addClickHandler(mostCommented, allMovies[i], i);
  }
}


