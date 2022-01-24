import AbstractView from './abstract-view.js';
import dayjs from 'dayjs';
import he from 'he';

const createCommentTemplate = (comment) => (`<li class="film-details__comment">
<span class="film-details__comment-emoji">
    <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
  <div>
  <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
  <p class="film-details__comment-info">
  <span class="film-details__comment-author">${comment.author}</span>
  <span class="film-details__comment-day">${dayjs(comment.date).format('YYYY/MM/DD HH:mm')}</span>
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

  addRemoveControlEvent(movieData, popupComponent, commentToDel) {
    const deleteButtonElement = this.element.querySelector('.film-details__comment-delete');
    deleteButtonElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      const commentToDelete = movieData.comments.find((comment) => comment === this.comment.id);
      console.log(popupComponent);
      console.log(popupComponent.commentsModel);
      console.log(popupComponent.commentsModel.deleteComment);
      popupComponent.commentsModel.deleteComment(movieData, commentToDelete, 'PATCH');
      movieData.comments.splice([movieData.comments.indexOf(commentToDelete)], 1);
      popupComponent.changeData(
        movieData,
        popupComponent.scrollCoordinates,
        commentToDelete,
      );
    console.log(commentToDel);
      // popupComponent.deleteComment(this.element);

    });
  }

  // setCommentsCount(popupComponent, cardComponent) {
  //   const popupCommentsCountElement = popupComponent.element.querySelector('.film-details__comments-count');
  //   const comments = popupComponent.element.querySelectorAll('.film-details__comment');
  //   const newValue = comments.length;
  //   popupCommentsCountElement.textContent = newValue;
  //   const cardCommentsCountElement = cardComponent.element.querySelector('.film-card__comments');
  //   cardCommentsCountElement.textContent = `${newValue} comments`;
  // }
}
