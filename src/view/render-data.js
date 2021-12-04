import { createMenuTemplate } from './menu-view.js';
import { createFilterTemplate } from './filter-view.js';
import { createCardsContainerTemplate } from './cards-view.js';
import { createButtonTemplate } from './button-view.js';
import { createUserNameTemplate } from './user-name-view.js';
import { getRandomInteger, getRandomPositiveFloat } from '../mock/utils.js';
import { getRandomDescription, getCommentsList } from '../mock/structure.js';
import { createExtraTemplate, createFooterTemplate } from './extra-view.js';
import dayjs from 'dayjs';

const RANDOM_MIN_DATE = 1;
const RANDOM_MAX_DATE = 7;
const RANDOM_MIN_RELEASE_DATE = 20;
const RANDOM_MAX_RELEASE_DATE = 50;
const MIN_RUNTIME = 30;
const MAX_RUNTIME = 90;
const HOUR = 60;
const MIN_RATING = 0;
const MAX_RATING = 10;
const RATING_DIGITS = 1;
const footer = document.querySelector('.footer');

export const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');

export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


const generateDate = () => {
  const randomNumber = getRandomInteger(RANDOM_MIN_DATE, RANDOM_MAX_DATE);
  return dayjs().add(randomNumber, 'day').format('YYYY-MM-DDThh:mm:ss.Z');
};

const generateReleaseDate = () => {
  const randomNumber = getRandomInteger(RANDOM_MIN_RELEASE_DATE, RANDOM_MAX_RELEASE_DATE);
  return dayjs().subtract(randomNumber, 'year');
};

const getRuntime = () => {
  let runtime = getRandomInteger(MIN_RUNTIME, MAX_RUNTIME);
  if (runtime >= HOUR) {
    runtime = `1h ${runtime - HOUR}m`;
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

export const generateMovie = (id) => ({
  'id': id,
  'comments': getCommentsList(),
  'filmInfo': {
    'title': 'A Little Pony Without The Carpet',
    'alternative_title': 'Laziness Who Sold Themselves',
    'total_rating': getRandomPositiveFloat(MIN_RATING, MAX_RATING, RATING_DIGITS),
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
  'userDetails': {
    'watchlist': Boolean(getRandomInteger(0, 1)),
    'already_watched': Boolean(getRandomInteger(0, 1)),
    'watching_date': generateDate(),
    'favorite': Boolean(getRandomInteger(0, 1)),
  }
});
renderTemplate(headerElement, createUserNameTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createFilterTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createCardsContainerTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createButtonTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createExtraTemplate(), RenderPosition.BEFOREEND);
renderTemplate(footer, createFooterTemplate(), RenderPosition.BEFOREEND);


