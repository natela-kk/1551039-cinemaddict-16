import {getRandomInteger, getRandomPositiveFloat} from './utils/utils.js';
import {getRandomDescription, getCommentsList} from './structure.js';
import dayjs from 'dayjs';
import dayjsRandom from 'dayjs-random';
import {POSTSCOUNT} from '../view/extra-view.js';
import {nanoid} from 'nanoid';

const MIN_RUNTIME = 10;
const MAX_RUNTIME = 30;
const HOUR = 60;
const MIN_RATING = 0;
const MAX_RATING = 10;
const RATING_DIGITS = 1;

dayjs.extend(dayjsRandom);

export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const getRuntime = () => {
  const randomNumber = getRandomInteger(MIN_RUNTIME, MAX_RUNTIME);
  let runtime = dayjs().subtract(randomNumber, 'minute').$m;
  const runtimeMinutes = `${runtime}m`;
  if (runtime >= HOUR) {
    runtime = `1h ${runtime - HOUR}m`;
    return runtime;
  }
  return runtimeMinutes;
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

export const generateMovie = () => ({
  'id': nanoid(),
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
      'date': dayjs.between('1970-06-10', '2021-03-02'),
      'release_country': 'Finland'
    },
    'runtime': getRuntime(),
    'genre': generateGenre(),
    'description': getRandomDescription(),
  },
  'userDetails': {
    'watchlist': Boolean(getRandomInteger(0, 1)),
    'alreadyWatched': Boolean(getRandomInteger(0, 1)),
    'watching_date': dayjs.between('2021-12-12', dayjs()),
    'favorite': Boolean(getRandomInteger(0, 1)),
  }
});

export const getMovieList = () => {
  const movies = [];
  for (let i = 1; i <= POSTSCOUNT; i++) {
    movies.push(generateMovie());
  }
  return movies;
};

