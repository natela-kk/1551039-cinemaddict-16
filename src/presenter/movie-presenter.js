import PopupView from '../view/popup-view';
import CommentView from '../view/comment-view';
import CardsView from '../view/cards-view.js';
import { renderElement } from '../mock/render';
import { RenderPosition } from '../mock/generate.js';
// import { presenter } from '../main.js';

export default class MoviePresenter {
  #movie = null;
  #popupComponent = null;
  #movieListPresenter = null;

#commentComponent = new CommentView();
#moviesContainer = null;

constructor(moviesContainer, movie, movieListPresenter) {
  this.#moviesContainer = moviesContainer;
  this.#movie = movie;
  this.#movieListPresenter = movieListPresenter;
}


init = () => {
  const cardComponent = new CardsView(this.#movie);
  renderElement(this.#moviesContainer, cardComponent, RenderPosition.BEFOREEND);
  this.addToFavorite(this.#movieListPresenter, cardComponent);
  this.addToWatchlist(this.#movieListPresenter, cardComponent);
  this.addToHistory(this.#movieListPresenter, cardComponent);
  this.addPostClickHandler(cardComponent, () => {
    this.#popupComponent = new PopupView(this.#movie);
    this.#popupComponent.postClickHandler(this.#movie, cardComponent);
  });
}

addToFavorite(presenter, cardComponent) {
  const favoriteButton = cardComponent.element.querySelector('.film-card__controls-item--favorite');
  favoriteButton.addEventListener('click', () => {
    const favoriteSign = cardComponent.movieInfo.userDetails.favorite;
    cardComponent.movieInfo.userDetails.favorite = !favoriteSign;
    favoriteButton.classList.toggle('film-card__controls-item--active');
    presenter.menuComponent.setFiltersCount();
  });
}

addToWatchlist(presenter, cardComponent) {
  const watchlistButton = cardComponent.element.querySelector('.film-card__controls-item--add-to-watchlist');
  watchlistButton.addEventListener('click', () => {
    const watchlistSign = cardComponent.movieInfo.userDetails.watchlist;
    cardComponent.movieInfo.userDetails.watchlist = !watchlistSign;
    watchlistButton.classList.toggle('film-card__controls-item--active');
    presenter.menuComponent.setFiltersCount();
  });
}

addToHistory(presenter, cardComponent) {
  const alreadyWatchedButton = cardComponent.element.querySelector('.film-card__controls-item--mark-as-watched');
  alreadyWatchedButton.addEventListener('click', () => {
    const alreadyWatchedSign = cardComponent.movieInfo.userDetails.alreadyWatched;
    cardComponent.movieInfo.userDetails.alreadyWatched = !alreadyWatchedSign;
    alreadyWatchedButton.classList.toggle('film-card__controls-item--active');
    presenter.menuComponent.setFiltersCount();
  });
}

addPostClickHandler(cardComponent, callback) {
  cardComponent._callback.postClick = callback;
  cardComponent.movieInfo = this.#movie;
  cardComponent.element.querySelector('a').addEventListener('click', cardComponent.postClickHandler);
}


}

