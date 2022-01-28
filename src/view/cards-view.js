import AbstractView from './abstract-view.js';
import dayjs from 'dayjs';
import { getRunTime } from '../mock/utils/utils.js';


const getFilmDescription = (description) => description.length > 140 ? `${description.substr(0, 139)}...` : description;

const getWatchlistStatus = (userDetails) => userDetails.watchlist === true ? ('film-card__controls-item--active') : '';
const getWatchedStatus = (userDetails) => userDetails.alreadyWatched === true ? ('film-card__controls-item--active') : '';
const getFavoriteStatus = (userDetails) => userDetails.favorite === true ? ('film-card__controls-item--active') : '';

const createCardTemplate = (card) => {
  const {filmInfo, comments, userDetails} = card;
  return `<article class="film-card">
        <a class="film-card__link">
          <h3 class="film-card__title">${filmInfo.title}</h3>
          <p class="film-card__rating">${filmInfo.totalRating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${dayjs(filmInfo.release.date).format('YYYY')}</span>
            <span class="film-card__duration">${getRunTime(filmInfo.runtime)}</span>
            <span class="film-card__genre">${filmInfo.genre[0]}</span>
          </p>
          <img src="${filmInfo.poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${getFilmDescription(filmInfo.description)}</p>
          <span class="film-card__comments">${comments.length} comments</span>
        </a>
        <div class="film-card__controls">
          <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getWatchlistStatus(userDetails)}" type="button">Add to watchlist</button>
          <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${getWatchedStatus(userDetails)}" type="button">Mark as watched</button>
          <button class="film-card__controls-item film-card__controls-item--favorite ${getFavoriteStatus(userDetails)}" type="button">Mark as favorite</button>
        </div>
      </article>`;
};

export default class CardsView extends AbstractView {
  #movieInfo = null;

  constructor(movieInfo) {
    super();
    this.#movieInfo = movieInfo;
  }

  get template() {
    return createCardTemplate(this.#movieInfo);
  }

  setPostClickHandler = (callback) => {
    this._callback.postClick = callback;
    const cardComponent = this;
    this.element.querySelector('a').addEventListener('click', this.postClickHandler.bind(cardComponent));
  };

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.favoriteClickHandler.bind(this));
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.watchlistClickHandler.bind(this));
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.historyClickHandler.bind(this));
  }

  favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick(this.#movieInfo);
  }

  watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick(this.#movieInfo);
  }

  historyClickHandler(evt) {
    evt.preventDefault();
    this._callback.historyClick(this.#movieInfo);
  }

  postClickHandler(evt) {
    evt.preventDefault();
    this._callback.postClick();
  }
}

