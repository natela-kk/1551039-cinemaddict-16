import { createMenuTemplate } from './view/menu-view.js';
import { createFilterTemplate } from './view/filter-view.js';
import { createCardsContainerTemplate, createCardTemplate } from './cards-view.js';
import { createButtonTemplate } from './button-view.js';
import { createUserNameTemplate } from './view/user-name-view.js';
import { createPopupTemplate } from './view/popup.js';
import { getRandomInteger, getRandomPositiveFloat } from './mock/utils.js';
import { getRandomDescription, getCommentsList } from './mock/structure.js';
import dayjs from 'dayjs';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');

const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


const generateDate = () => {
  const randomNumber = getRandomInteger(1, 7);
  return dayjs().add(randomNumber, 'day').format('YYYY-MM-DDThh:mm:ss.Z');
};

const generateReleaseDate = () => {
  const randomNumber = getRandomInteger(20, 50);
  return dayjs().subtract(randomNumber, 'year');
};

const getRuntime = () => {
  let runtime = getRandomInteger(30, 90);
  if (runtime >= 60) {
    runtime = `1h ${runtime - 60}m`;
  }
  return `${runtime}m`;
};
const generateGenre = () => {
  const genres = ['Comedy', 'Western', 'Drama', 'Cartoon', 'Musical'];
  const genreList = [];
  for (let i = 1; i <= getRandomInteger(1, genres.length); i++) {
    const genre = genres[getRandomInteger(0, genres.length - 1)];
    if (!genreList.includes(genre)) {
      genreList.push(genre);
    }
  }
  return genreList;
};
const generateMovie = (id) => ({
  'id': id,
  'comments': getCommentsList(),
  'filmInfo': {
    'title': 'A Little Pony Without The Carpet',
    'alternative_title': 'Laziness Who Sold Themselves',
    'total_rating': getRandomPositiveFloat(0, 10, 1),
    'poster': './images/posters/the-great-flamarion.jpg',
    'age_rating': 0,
    'director': 'Tom Ford',
    'writers': [
      'Takeshi Kitano'
    ],
    'actors': [
      'Morgan Freeman'
    ],
    'release': {
      'date': generateReleaseDate(),
      'release_country': 'Finland'
    },
    'runtime': getRuntime(),
    'genre': generateGenre(),
    'description': getRandomDescription(),
  },
  'user_details': {
    'watchlist': Boolean(getRandomInteger(0, 1)),
    'already_watched': Boolean(getRandomInteger(0, 1)),
    'watching_date': generateDate(),
    'favorite': Boolean(getRandomInteger(0, 1)),
  }
});

const getMovieList = () => {
  const movies = [];
  for (let i = 1; i <= 20; i++) {
    movies.push(generateMovie(i));
  }
  return movies;
};

renderTemplate(headerElement, createUserNameTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createFilterTemplate(), RenderPosition.BEFOREEND);

renderTemplate(mainElement, createCardsContainerTemplate(), RenderPosition.BEFOREEND);
const cardsContainer = document.querySelector('.films-list__container');
const allMovies = getMovieList();
allMovies.forEach((card) => {
  renderTemplate(cardsContainer, createCardTemplate(card), RenderPosition.BEFOREEND);
});

renderTemplate(mainElement, createButtonTemplate(), RenderPosition.BEFOREEND);
const allPosts = document.querySelectorAll('.film-card');

let popup;
let closeButton;
let comments;

const documentKeydownHandler = (evt) => {
  if (evt.code === 'Escape') {
    closePopup();
  }
};

const closeButtonClickHandler = () => {
  closePopup();
};

function closePopup() {
  popup.remove();
  closeButton.removeEventListener('click', closeButtonClickHandler);
  document.removeEventListener('keydown', documentKeydownHandler);
}
let deleteCommentButtons;

const deleteButtonClickHandler = (deleteButton, buttonIndex) => {
  deleteCommentButtons = document.querySelectorAll('.film-details__comment-delete');
  // console.log(deleteCommentButtons);
  comments = document.querySelectorAll('.film-details__comment');
  if (comments.length === 1) {
    comments[0].remove();
  } else {
    const comment = comments[buttonIndex];
    comment.remove();
  }
  const commentsCount = popup.querySelector('.film-details__comments-count');
  commentsCount.textContent = comments.length - 1;
};

const postClickHandler = (index) => {
  renderTemplate(mainElement, createPopupTemplate(allMovies[index]), RenderPosition.BEFOREEND);
  popup = document.querySelector('.film-details');
  closeButton = document.querySelector('.film-details__close-btn');
  deleteCommentButtons = document.querySelectorAll('.film-details__comment-delete');
  deleteCommentButtons.forEach((deleteButton, buttonIndex) => {
    deleteButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      deleteButtonClickHandler(deleteButton, buttonIndex);
    });

  });
  closeButton.addEventListener('click', closeButtonClickHandler);
  document.addEventListener('keydown', documentKeydownHandler);
};


allPosts.forEach((post, index) => {
  post.addEventListener('click', () => {
    postClickHandler(index);
  });
});
