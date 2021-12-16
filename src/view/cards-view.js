import AbctractView from './abstract-view.js';
import { presenter } from '../main.js';

const getFilmDescription = (description) => {
  const text = description.join(' ');
  return text.length > 140 ? `${text.substr(0, 139)}...` : text;
};

const getWatchlistStatus = (userDetails) => userDetails.watchlist === true ? ('film-card__controls-item--active') : '';
const getWatchedStatus = (userDetails) => userDetails.already_watched === true ? ('film-card__controls-item--active') : '';
const getFavoriteStatus = (userDetails) => userDetails.favorite === true ? ('film-card__controls-item--active') : '';


const createCardTemplate = (card) => {
  const {filmInfo, comments, userDetails} = card;
  return `<article class="film-card">
        <a class="film-card__link">
          <h3 class="film-card__title">${filmInfo.title}</h3>
          <p class="film-card__rating">${filmInfo.total_rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${filmInfo.release.date.format('YYYY')}</span>
            <span class="film-card__duration">${filmInfo.runtime}</span>
            <span class="film-card__genre">${filmInfo.genre.join(' ')}</span>
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

export default class CardsView extends AbctractView{
  #movieInfo = null;

  constructor(movieInfo) {
    super();
    this.#movieInfo = movieInfo;
  }

  get template() {
    return createCardTemplate(this.#movieInfo);
  }

  addClickHandler(movie, callback) {
    this._callback.postClick = callback;
    this.#movieInfo = movie;
    this.element.querySelector('a').addEventListener('click', this.#postClickHandler);
  }

  #postClickHandler = () => {
    this._callback.postClick();
  }

  addToFavorite() {
    const favoriteButton = this.element.querySelector('.film-card__controls-item--favorite');
    favoriteButton.addEventListener('click', () => {
      const favoriteSign = this.#movieInfo.userDetails.favorite;
      this.#movieInfo.userDetails.favorite = !favoriteSign;
      favoriteButton.classList.toggle('film-card__controls-item--active');
      presenter.menuComponent.setFiltersCount();
    });
  }

  addToWatchlist() {
    const watchlistButton = this.element.querySelector('.film-card__controls-item--add-to-watchlist');
    watchlistButton.addEventListener('click', () => {
      const watchlistSign = this.#movieInfo.userDetails.watchlist;
      this.#movieInfo.userDetails.watchlist = !watchlistSign;
      watchlistButton.classList.toggle('film-card__controls-item--active');
      presenter.menuComponent.setFiltersCount();
    });
  }

  addToHistory() {
    const alreadyWatchedButton = this.element.querySelector('.film-card__controls-item--mark-as-watched');
    alreadyWatchedButton.addEventListener('click', () => {
      const alreadyWatchedSign = this.#movieInfo.userDetails.alreadyWatched;
      this.#movieInfo.userDetails.alreadyWatched = !alreadyWatchedSign;
      alreadyWatchedButton.classList.toggle('film-card__controls-item--active');
      presenter.menuComponent.setFiltersCount();
    });
  }

}

