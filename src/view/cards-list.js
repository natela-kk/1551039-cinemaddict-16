import { createCardTemplate } from './cards-view.js';
import { generateMovie, renderTemplate, RenderPosition } from './render-data.js';
const POSTSCOUNT = 22;
const NEXTPOSTS_COUNT = 5;
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
