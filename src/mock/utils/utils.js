import AbstractView from '../../view/abstract-view.js';

export const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

export const getRandomPositiveFloat = (min, max, digits) => {
  const lower = Math.min(Math.abs(min), Math.abs(max));
  const upper = Math.max(Math.abs(min), Math.abs(max));
  const result = Math.random() * (upper - lower) + lower;
  return result.toFixed(digits);
};

export const replace = (newElement, oldElement) => {
  if (newElement === null || oldElement === null) {
    throw new Error('Can\'t replace unexisting elements');
  }
  const newChild = newElement instanceof AbstractView ? newElement.element : newElement;
  const oldChild = oldElement instanceof AbstractView ? oldElement.element : oldElement;

  const parent = oldChild.parentElement;

  if (parent === null) {
    throw new Error('Parent element doesn\'t exist');
  }
  parent.replaceChild(newChild, oldChild);
};


export const sortMovieDateDown = (movieA, movieB) => {
  const dateOne = movieA.filmInfo.release.date.$y;
  const dateTwo = movieB.filmInfo.release.date.$y;
  return dateTwo - dateOne;
};


export const sortMovieRatingDown = (movieA, movieB) => {
  const dateOne = movieA.filmInfo.total_rating;
  const dateTwo = movieB.filmInfo.total_rating;
  return dateTwo - dateOne;
};

export const isFavorite = (favorite, updatedFavorite) => (favorite === updatedFavorite);
export const isWatchlistAdded = (favorite, updatedFavorite) => (favorite === updatedFavorite);
export const isAlreadyWatched = (favorite, updatedFavorite) => (favorite === updatedFavorite);
