import { mainElement, RenderPosition, renderTemplate } from './render-data.js';
import { allMovies } from './cards-list.js';

const filmcontainers = document.querySelectorAll('.films-list__container');
const allPosts = filmcontainers[0].querySelectorAll('.film-card');
const topRatedPosts = filmcontainers[2].querySelectorAll('.film-card');
const mostCommentedPosts = filmcontainers[3].querySelectorAll('.film-card');

const createComment = (comment) => (`<li class="film-details__comment">
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

let documentFragment;
let checkedEmotion;
let allComments;
let deleteCommentButtons;
let emotionImages;
let popup;
let closeButton;


const getGenreWord = (genres) => genres.length > 1 ? 'Genres' : 'Genre';
const getWatchlistStatus = (userDetails) => userDetails.watchlist ? ('film-details__control-button--active') : '';
const getWatchedStatus = (userDetails) => userDetails.already_watched ? ('film-details__control-button--active') : '';
const getFavoriteStatus = (userDetails) => userDetails.favorite ? ('film-details__control-button--active') : '';
export const createCommentList = (comments) => {
  documentFragment = '';
  comments.forEach((comment) => {
    documentFragment += createComment(comment);
  });
  return documentFragment;
};

export const createPopupTemplate = (thePopup) => {
  const {filmInfo, comments, userDetails} = thePopup;
  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
    <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
        </div>
      <div class="film-details__info-wrap">
      <div class="film-details__poster">
      <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

      <p class="film-details__age">18+</p>
        </div>

        <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmInfo.title}</h3>
              <p class="film-details__title-original">Original: ${filmInfo.alternative_title}</p>
              </div>

              <div class="film-details__rating">
              <p class="film-details__total-rating">${filmInfo.total_rating}</p>
              </div>
          </div>

          <table class="film-details__table">
          <tr class="film-details__row">
          <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${filmInfo.writers}</td>
            </tr>
            <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${filmInfo.actors}</td>
              </tr>
            <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${filmInfo.release.date.format('DD MMMM YYYY')}</td>
              </tr>
            <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${filmInfo.runtime}</td>
              </tr>
              <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${filmInfo.release.release_country}</td>
              </tr>
            <tr class="film-details__row">
            <td class="film-details__term">${getGenreWord(filmInfo.genre)}</td>
              <td class="film-details__cell">
              <span class="film-details__genre">${filmInfo.genre.join(' ')}</span></td>
            </tr>
            </table>

            <p class="film-details__film-description">
          ${filmInfo.description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
      <button type="button" class="film-details__control-button film-details__control-button--watchlist ${getWatchlistStatus(userDetails)}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${getWatchedStatus(userDetails)}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite  ${getFavoriteStatus(userDetails)}" id="favorite" name="favorite">Add to favorites</button>
        </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
        ${createCommentList(comments)}
        </ul>

        <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
          </div>
          </div>
      </section>
    </div>
    </form>
    </section>`;
};

const setCommentsCount = (index) => {
  allComments = document.querySelectorAll('.film-details__comment');
  const commentsCount = document.querySelector('.film-details__comments-count');
  const newCommentsLength =  allComments.length;
  commentsCount.textContent = newCommentsLength;
  allPosts[index].querySelector('.film-card__comments').textContent = `${newCommentsLength} comments`;
};

const deleteButtonClickHandler = (deleteButton, buttonIndex, index) => {
  deleteCommentButtons = document.querySelectorAll('.film-details__comment-delete');
  allComments = document.querySelectorAll('.film-details__comment');
  if (allComments.length === 1) {
    allComments[0].remove();
  } else if (allComments.length > 1) {
    const comment = allComments[buttonIndex];
    comment.remove();
  }
  setCommentsCount(index);
};

const deleteNewComment = (index) => {
  const allPostComments = Array.from(document.querySelectorAll('.film-details__comment'));
  const createdComment = allPostComments[allPostComments.length - 1];
  const newDeleteButton = createdComment.querySelector('.film-details__comment-delete');
  newDeleteButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    createdComment.remove();
    setCommentsCount(index);
  });
};

const addEmojiListener = () => {
  const emotionOptions = document.querySelectorAll('input[type="radio"]');
  const emotionPreview = document.querySelector('.film-details__add-emoji-label');
  emotionOptions.forEach((option) => {
    option.addEventListener('change', () => {
      checkedEmotion = document.querySelector('input[type="radio"]:checked');
      emotionImages = Array.from(emotionPreview.children);
      if (emotionImages.length > 0) {
        emotionImages[0].remove();
      }
      emotionPreview.insertAdjacentHTML('beforeend', `<img src="./images/emoji/${checkedEmotion.value}.png" width="55" height="55" alt="emoji-${checkedEmotion.value}">`);
    });
  });
};

const addDeleteButtonListeners = (index) => {
  deleteCommentButtons = document.querySelectorAll('.film-details__comment-delete');
  deleteCommentButtons.forEach((deleteButton, buttonIndex) => {
    deleteButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      deleteButtonClickHandler(deleteButton, buttonIndex, index);
    });
  });
};

const inputKeydownHandler = (index, evt, commentInput) => {
  const form = document.querySelector('.film-details__inner');
  const commentList = document.querySelector('.film-details__comments-list');
  const userEmoji = document.querySelector('.film-details__add-emoji-label').querySelector('img');
  if (evt.code === 'Enter' && commentInput.value.trim() !== '' && userEmoji) {
    evt.preventDefault();
    const newComment = {};
    newComment.comment = commentInput.value;
    newComment.id = 1;
    newComment.author = 'Natela';
    newComment.date = 'rigth now';
    newComment.emotion = checkedEmotion.value;
    const newCommentTemplate = createComment(newComment);
    commentList.insertAdjacentHTML('beforeend', newCommentTemplate);
    form.reset();
    userEmoji.remove();
    setCommentsCount(index);
    deleteNewComment(index);
  }
};

const postComment = (index) => {
  const commentInput = document.querySelector('.film-details__comment-input');
  commentInput.addEventListener('keydown', (evt) => {
    inputKeydownHandler(index, evt, commentInput);
  });
};


const documentKeydownHandler = (evt) => {
  if (evt.code === 'Escape') {
    closePopup();
  }
};

const closeButtonClickHandler = () => {
  closePopup();
};

function closePopup() {
  popup.remove();
  closeButton.removeEventListener('click', closeButtonClickHandler);
  document.removeEventListener('keydown', documentKeydownHandler);
}

const postClickHandler = (index) => {
  popup = document.querySelector('.film-details');
  if (popup) {
    popup.remove();
  }
  renderTemplate(mainElement, createPopupTemplate(allMovies[index]), RenderPosition.BEFOREEND);
  popup = document.querySelector('.film-details');
  closeButton = document.querySelector('.film-details__close-btn');
  closeButton.addEventListener('click', closeButtonClickHandler);
  document.addEventListener('keydown', documentKeydownHandler);
};

allPosts.forEach((post, index) => {
  post.addEventListener('click', () => {
    postClickHandler(index);
    addEmojiListener();
    addDeleteButtonListeners(index);
    postComment(index);
  });
});

topRatedPosts.forEach((post, index) => {
  post.addEventListener('click', () => {
    postClickHandler(index);
    addEmojiListener();
    addDeleteButtonListeners(index);
    postComment(index);
  });
});

mostCommentedPosts.forEach((post, index) => {
  post.addEventListener('click', () => {
    postClickHandler(index);
    addEmojiListener();
    addDeleteButtonListeners(index);
    postComment(index);
  });
});
