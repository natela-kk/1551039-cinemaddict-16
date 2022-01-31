import AbstractView from './abstract-view.js';
import {FilterType} from '../const.js';

const NoMoviesTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoMoviesTemplate = (filterType) => {
  const noTaskMovieValue = NoMoviesTextType[filterType];
  return (`<h2 class="films-list__title">${noTaskMovieValue}</h2>`);
};

export default class NoMoviesView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoMoviesTemplate(this._data);
  }
}
