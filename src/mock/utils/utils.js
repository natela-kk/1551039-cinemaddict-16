import AbstractView from '../../view/abstract-view.js';
import dayjs from 'dayjs';

export const getRunTime = (mins) => {
  const hours = Math.trunc(mins/60);
  const minutes = mins % 60;
  return `${hours  }h ${  minutes}m`;
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
  const dateOne = dayjs(movieA.filmInfo.release.date).$y;
  const dateTwo = dayjs(movieB.filmInfo.release.date).$y;
  return dateTwo - dateOne;
};


export const sortMovieRatingDown = (movieA, movieB) => {
  const ratingOne = movieA.filmInfo.totalRating;
  const ratingTwo = movieB.filmInfo.totalRating;
  return ratingTwo - ratingOne;
};
