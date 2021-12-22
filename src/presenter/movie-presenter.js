import PopupView from '../view/popup-view';
import CommentView from '../view/comment-view';
import CardsView from '../view/cards-view.js';
import { renderElement, remove } from '../mock/render';
import { RenderPosition } from '../mock/generate.js';
// import { presenter } from '../main.js';

export default class MoviePresenter {
  #movie = null;
  #popupComponent = null;
  #movieListPresenter = null;
  #cardComponent = null;
  #commentComponent = new CommentView();
  #moviesContainer = null;
  #changeData = null;

  constructor(moviesContainer, movieListPresenter, changeData) {
    this.#moviesContainer = moviesContainer;
    this.#movieListPresenter = movieListPresenter;
    this.#changeData = changeData;

  }


init = (movie) => {
  this.#movie = movie;
  this.#cardComponent = new CardsView(this.#movie);
  this.#popupComponent = new PopupView(this.#movie);
  renderElement(this.#moviesContainer, this.#cardComponent, RenderPosition.BEFOREEND);
  this.addPostClickHandler(this.#cardComponent, () => {
    this.#popupComponent.postClickHandler(this.#movie, this.#cardComponent);
    this.#popupComponent.addFavoriteClickHandler(this.#movieListPresenter.menuComponent, this.#cardComponent);
    this.#popupComponent.addToWatchlistClickHandler(this.#movieListPresenter.menuComponent, this.#cardComponent);
    this.#popupComponent.addToHistoryClickHandler(this.#movieListPresenter.menuComponent, this.#cardComponent);
  });
  // this.addFavoriteClickHandler(this.#cardComponent);
  // this.addToWatchlistClickHandler(this.#cardComponent);
  // this.addToHistoryClickHandler(this.#cardComponent);
  ////////////////
  this.#cardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  this.#cardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
  this.#cardComponent.setHistoryClickHandler(this.#handleHistoryClick);
  this.#popupComponent.setFormSubmitHandler(this.#handleFormSubmit);
}

addFavoriteClickHandler(cardComponent) {
  const favoriteButtonInCard = cardComponent.element.querySelector('.film-card__controls-item--favorite');
  const favoriteButtonInPopup = this.#popupComponent.element.querySelector('.film-details__control-button--favorite');
  favoriteButtonInCard.addEventListener('click', () => {
    this.addToFavorite(favoriteButtonInPopup, cardComponent, favoriteButtonInCard);
  });
}

addToFavorite(popupButton, cardComponent, cardButtonIn) {
  const status = cardComponent.movieInfo.userDetails.favorite;
  cardComponent.movieInfo.userDetails.favorite = !status;
  popupButton.classList.toggle('film-details__control-button--active');
  cardButtonIn.classList.toggle('film-card__controls-item--active');
  this.#movieListPresenter.menuComponent.setFiltersCount();
}

addToWatchlistClickHandler(cardComponent) {
  const watchlistButtonInCard = cardComponent.element.querySelector('.film-card__controls-item--add-to-watchlist');
  const watchlistButtonInPopup = this.#popupComponent.element.querySelector('.film-details__control-button--watchlist');
  watchlistButtonInCard.addEventListener('click', () => {
    this.addToWatchlist(watchlistButtonInPopup, cardComponent, watchlistButtonInCard);
  });
}

addToWatchlist(popupButton, cardComponent, cardButtonIn) {
  const status = cardComponent.movieInfo.userDetails.watchlist;
  cardComponent.movieInfo.userDetails.watchlist = !status;
  popupButton.classList.toggle('film-details__control-button--active');
  cardButtonIn.classList.toggle('film-card__controls-item--active');
  this.#movieListPresenter.menuComponent.setFiltersCount();
}

addToHistoryClickHandler(cardComponent) {
  const alreadyWatchedButtonInCard = cardComponent.element.querySelector('.film-card__controls-item--mark-as-watched');
  const alreadyWatchedButtonInPopup = this.#popupComponent.element.querySelector('.film-details__control-button--watched');
  alreadyWatchedButtonInCard.addEventListener('click', () => {
    this.addToHistory(alreadyWatchedButtonInPopup, cardComponent, alreadyWatchedButtonInCard);
  });
}

addToHistory(popupButton, cardComponent, cardButtonIn) {
  const status = cardComponent.movieInfo.userDetails.alreadyWatched;
  cardComponent.movieInfo.userDetails.alreadyWatched = !status;
  popupButton.classList.toggle('film-details__control-button--active');
  cardButtonIn.classList.toggle('film-card__controls-item--active');
  this.#movieListPresenter.menuComponent.setFiltersCount();
}

addPostClickHandler(cardComponent, callback) {
  cardComponent._callback.postClick = callback;
  cardComponent.movieInfo = this.#movie;
  cardComponent.element.querySelector('a').addEventListener('click', cardComponent.postClickHandler);
}

destroy = () => {
  remove(this.#cardComponent);
}

#handleFavoriteClick = () => {
  console.log(this.#movie.favorite);
  this.#changeData({...this.#movie, favorite: !this.#movie.favorite});
  console.log(this.#movie.favorite);
}

#handleWatchlistClick = () => {
  console.log(this.#movie.watchlist);
  this.#changeData({...this.#movie, watchlist: !this.#movie.watchlist});
  console.log(this.#movie.watchlist);
}

#handleHistoryClick = () => {
  console.log(this.#movie.alreadyWatched);
  this.#changeData({...this.#movie, alreadyWatched: !this.#movie.alreadyWatched});
  console.log(this.#movie.alreadyWatched);

}

#handleFormSubmit = (movie) => {
  this.#changeData(movie);
}

}


