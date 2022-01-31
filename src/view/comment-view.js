import AbstractView from './abstract-view.js';
import dayjs from 'dayjs';
import he from 'he';
import * as relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const createCommentTemplate = (comment) => (`<li class="film-details__comment">
<span class="film-details__comment-emoji">
    <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
  <div>
  <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
  <p class="film-details__comment-info">
  <span class="film-details__comment-author">${comment.author}</span>
  <span class="film-details__comment-day">${dayjs(comment.date).fromNow()}</span>
  <button class="film-details__comment-delete">Delete</button>
  </p>
  </div>
  </li>`);

export default class CommentView extends AbstractView {
  comment = null;

  constructor(comment, cardComponent) {
    super();
    this.comment = comment;
    this.cardComponent = cardComponent;
  }

  get template() {
    return createCommentTemplate(this.comment);
  }

  addRemoveControlEvent(movieData, popupComponent) {
    const deleteButtonElement = this.element.querySelector('.film-details__comment-delete');
    deleteButtonElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      const commentToDelete = movieData.comments.find((comment) => comment === this.comment.id);

      popupComponent.commentsModel.deleteComment(commentToDelete, deleteButtonElement).then(() => {
        movieData.comments.splice([movieData.comments.indexOf(commentToDelete)], 1);
        popupComponent.changeData(
          movieData,
          popupComponent.scrollCoordinates,
          commentToDelete,
        );
      });
    });
  }

}
