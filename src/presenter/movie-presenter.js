import PopupView from '../view/popup-view';
import CommentView from '../view/comment-view';

export default class MoviePresenter {
  #movie = null;

#popupComponent = new PopupView();
#commentComponent = new CommentView();


constructor(movie) {
  this.#movie = movie;
}
}

