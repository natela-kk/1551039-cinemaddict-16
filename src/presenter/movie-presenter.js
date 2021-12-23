import PopupView from '../view/popup-view';
import CommentView from '../view/comment-view';
import CardsView from '../view/cards-view.js';
import { renderElement, remove } from '../mock/render';
import { RenderPosition } from '../mock/generate.js';
import { replace } from '../mock/utils';
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

  const cardComponent = this.#cardComponent;
  const popupComponent = this.#popupComponent;

  this.#cardComponent = new CardsView(this.#movie);
  this.#popupComponent = new PopupView(this.#movie);

  this.#cardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  this.#cardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
  this.#cardComponent.setHistoryClickHandler(this.#handleHistoryClick);
  this.#popupComponent.setFormSubmitHandler(this.#handleFormSubmit);

  this.addPostClickHandler(this.#cardComponent, () => {
    console.log('tap');
    this.#popupComponent.postClickHandler(this.#movie, this.#cardComponent);
    // this.#popupComponent.addFavoriteClickHandler(this.#movieListPresenter.menuComponent, this.#cardComponent);
    // this.#popupComponent.addToWatchlistClickHandler(this.#movieListPresenter.menuComponent, this.#cardComponent);
    // this.#popupComponent.addToHistoryClickHandler(this.#movieListPresenter.menuComponent, this.#cardComponent);
  });

  if (cardComponent === null || popupComponent === null) {
    renderElement(this.#moviesContainer, this.#cardComponent, RenderPosition.BEFOREEND);
    return;
  }

  if (this.#moviesContainer.contains(cardComponent.element)) {
    replace(this.#cardComponent, cardComponent);
  }

  if (this.#moviesContainer.contains(popupComponent.element)) {
    replace(this.#popupComponent, popupComponent);
  }
}

addPostClickHandler(cardComponent, callback) {
  cardComponent._callback.postClick = callback;
  cardComponent.movieInfo = this.#movie;
  cardComponent.element.querySelector('a').addEventListener('click', cardComponent._callback.postClick);
}

destroy = () => {
  remove(this.#cardComponent);
}

#handleFavoriteClick = () => {
  this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}});
}

#handleWatchlistClick = () => {
  this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}});
}

#handleHistoryClick = () => {
  this.#changeData({...this.#movie, userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}});

}

#handleFormSubmit = (movie) => {
  this.#changeData(movie);
}

}


