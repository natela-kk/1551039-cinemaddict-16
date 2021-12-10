import AbctractView from './abstract-view.js';

const createCommentTemplate = (comment) => (`<li class="film-details__comment">
<span class="film-details__comment-emoji">
    <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
  <div>
  <p class="film-details__comment-text">${comment.comment}</p>
  <p class="film-details__comment-info">
  <span class="film-details__comment-author">${comment.author}</span>
  <span class="film-details__comment-day">${comment.date}</span>
  <button class="film-details__comment-delete">Delete</button>
  </p>
  </div>
  </li>`);

export default class CommentView extends AbctractView{
#comment = null;

constructor(comment) {
  super();
  this.#comment = comment;
}

get template() {
  return createCommentTemplate(this.#comment);
}

addRemoveControlEvent(popupComponent, cardComponent) {
  const deleteButtonElement = this.element.querySelector('.film-details__comment-delete');
  deleteButtonElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    this.element.remove();
    this.setCommentsCount(popupComponent, cardComponent);
  });
}

setCommentsCount(popupComponent, cardComponent) {
  const popupElement = popupComponent instanceof AbctractView ? popupComponent.element : popupComponent;

  const popupCommentsCountElement = popupElement.querySelector('.film-details__comments-count');
  const comments = popupElement.querySelectorAll('.film-details__comment');
  const newValue = comments.length;
  popupCommentsCountElement.textContent = newValue;
  const cardCommentsCountElement =  cardComponent.element.querySelector('.film-card__comments');
  cardCommentsCountElement.textContent = `${newValue} comments`;
}
}
