import PopupView from '../view/popup-view';
import CommentView from '../view/comment-view';
import CardsView from '../view/cards-view.js';
import { renderElement } from '../mock/render';
import { RenderPosition } from '../mock/generate.js';

export default class MoviePresenter {
  #movie = null;

#popupComponent = new PopupView();
#commentComponent = new CommentView();
#moviesContainer = null;

constructor(moviesContainer) {
  this.#moviesContainer = moviesContainer;
}

///////////////////////////Сделала, сколько успела!))////////////////////////////////

init = (movie) => {
  const cardComponent = new CardsView(movie);
  renderElement(this.#moviesContainer, cardComponent, RenderPosition.BEFOREEND);
  cardComponent.addToFavorite();
  cardComponent.addToWatchlist();
  cardComponent.addToHistory();
  cardComponent.addClickHandler(movie, () => {
    new PopupView().postClickHandler(movie, cardComponent);
  });
}

}

