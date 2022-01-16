import AbstractView from './abstract-view.js';
import he from 'he';
import { UserAction, UpdateType } from '../const.js';

const createCommentTemplate = (comment) => (`<li class="film-details__comment">
<span class="film-details__comment-emoji">
    <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
  <div>
  <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
  <p class="film-details__comment-info">
  <span class="film-details__comment-author">${comment.author}</span>
  <span class="film-details__comment-day">${comment.date}</span>
  <button class="film-details__comment-delete">Delete</button>
  </p>
  </div>
  </li>`);

export default class CommentView extends AbstractView{
  comment = null;

  constructor(comment) {
    super();
    this.comment = comment;
  }

  get template() {
    return createCommentTemplate(this.comment);
  }

  addRemoveControlEvent(movieData, popupComponent) {
    const deleteButtonElement = this.element.querySelector('.film-details__comment-delete');
    deleteButtonElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      const commentToDelete = movieData.comments.find((comment) => comment === this.comment);
      movieData.comments.splice([movieData.comments.indexOf(commentToDelete)], 1);
      popupComponent.changeData(
        movieData,
        popupComponent.scrollCoordinates,
      );
    });
  }

  setCommentsCount(popupComponent, cardComponent) {
    const popupCommentsCountElement = popupComponent.querySelector('.film-details__comments-count');
    const comments = popupComponent.querySelectorAll('.film-details__comment');
    const newValue = comments.length;
    popupCommentsCountElement.textContent = newValue;
    const cardCommentsCountElement =  cardComponent.element.querySelector('.film-card__comments');
    cardCommentsCountElement.textContent = `${newValue} comments`;
  }
}
