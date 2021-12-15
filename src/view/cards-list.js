// import CardsView from './cards-view.js';
// import { allMovies } from './render-data.js';
// import { RenderPosition } from './render-data.js';
// // import { POSTSCOUNT } from './extra-view.js';
// import { renderElement } from '../mock/render.js';
// // import PopupView from './popup-view.js';
// import { renderMovies, addCard } from './render-data.js';
// const NEXT_POSTS_COUNT = 5;
// const EXTRA_COUNT = 2;


// if(allMovies.length > 0) {
//   // renderMovies(0, NEXT_POSTS_COUNT);

//   const watchListCount = document.querySelector('a[href="#watchlist"]').querySelector('span');
//   const historyCount = document.querySelector('a[href="#history"]').querySelector('span');
//   const favoritesCount = document.querySelector('a[href="#favorites"]').querySelector('span');

//   const watchlistMovies = allMovies.filter((movie) =>
//     movie.userDetails.watchlist);
//   watchListCount.textContent = watchlistMovies.length;

//   const historyMovies = allMovies.filter((movie) =>
//     movie.userDetails.already_watched);
//   historyCount.textContent = historyMovies.length;

//   const favoritesMovies = allMovies.filter((movie) =>
//     movie.userDetails.favorite);
//   favoritesCount.textContent = favoritesMovies.length;

//   const extraLists = document.querySelectorAll('.films-list--extra');
//   // const topRated = extraLists[0].querySelector('.films-list__container');

//   // for (let i = 0; i < EXTRA_COUNT; i++) {
//   //   addCard(topRated, allMovies[i], i);
//   // }
//   const mostCommented = extraLists[1].querySelector('.films-list__container');
//   for (let i = 0; i < EXTRA_COUNT; i++) {
//     addCard(mostCommented, allMovies[i], i);
//   }
// }


