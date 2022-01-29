import {mainElement} from '../main.js';
import CommentView from './comment-view.js';
import {PopupMode} from '../presenter/movie-presenter.js';
import SmartView from './smart-view.js';
import dayjs from 'dayjs';
import ApiService from '../api-service.js';
import { AUTHORIZATION, END_POINT } from '../main.js';
import CommentsModel from '../model/comments-model.js';
import { getRunTime } from '../mock/utils/utils.js';

let checkedEmotion;
let closeButton;

const getGenreWord = (genres) => genres.length > 1 ? 'Genres' : 'Genre';
const getWatchlistStatus = (userDetails) => userDetails.watchlist ? ('film-details__control-button--active') : '';
const getWatchedStatus = (userDetails) => userDetails.alreadyWatched ? ('film-details__control-button--active') : '';
const getFavoriteStatus = (userDetails) => userDetails.favorite ? ('film-details__control-button--active') : '';

const createPopupTemplate = (movieInfo) => {
  const {filmInfo, comments, userDetails, selectedEmoji} = movieInfo;
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
              <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
              <p class="film-details__total-rating">${filmInfo.totalRating}</p>
              </div>
              </div>

          <table class="film-details__table">
          <tr class="film-details__row">
          <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmInfo.director}</td>
              </tr>
            <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
              </tr>
            <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${dayjs(filmInfo.release.date).format('DD MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${getRunTime(filmInfo.runtime)}</td>
            </tr>
            <tr class="film-details__row">
            <td class="film-details__term">Country</td>
              <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
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
        </ul>

        <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label"> ${selectedEmoji ? `<img src="./images/emoji/${selectedEmoji}.png" width="55" height="55" alt="emoji-${selectedEmoji}">` : ''}</div>

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

export default class PopupView extends SmartView {
  #changePopupMode = null;
  #moviePresenter = null;
  #filterPresenter = null;
  changeData = null;
  scrollCoordinates = [0, 0];
  #comments = [];

  constructor(movieInfo, changePopupMode, moviePresenter, changeData, cardComponent, filterPresenter) {
    super();
    this.changeData = changeData;
    this._data = movieInfo;
    this.#moviePresenter = moviePresenter;
    this.#changePopupMode = changePopupMode;
    this.cardComponent = cardComponent;
    this.commentsModel = new CommentsModel(new ApiService(`${END_POINT}comments/${this._data.id}`, AUTHORIZATION));
    this.#filterPresenter = filterPresenter;
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupTemplate(this._data);
  }

  emojiChangeHandler(evt) {
    evt.preventDefault();
    checkedEmotion = this.element.querySelector('input[type="radio"]:checked');
    const checkedEmotionId = checkedEmotion.id;
    document.removeEventListener('click', this.documentBindedClickHandler);

    this.updateData({selectedEmoji: checkedEmotion.value});

    this.setDocumentClickHandler();

    checkedEmotion = this.element.querySelector(`#${checkedEmotionId}`);
    checkedEmotion.checked = true;

    const commentInput = this.element.querySelector('.film-details__comment-input');
    commentInput.value = this._data.comment ? this._data.comment : '';
    this.setComments(this.#moviePresenter.comments);
    this.element.scrollTo(...this.scrollCoordinates);

  }

  updateUserInputInfo() {

    if(this._data.selectedEmoji) {
      const checkedEmoji = this.element.querySelector(`#emoji-${this._data.selectedEmoji}`);
      checkedEmoji.checked = true;
      const checkedEmojiContainer = this.element.querySelector('.film-details__add-emoji-label');
      checkedEmojiContainer.innerHTML = `<img src="./images/emoji/${this._data.selectedEmoji}.png" width="55" height="55" alt="emoji-${this._data.selectedEmoji}">`;

    } if(this._data.comment) {
      const commentInput = this.element.querySelector('.film-details__comment-input');
      commentInput.value = this._data.comment;
    }
  }

  addCloseButtonClickControl(callback) {
    this._callback.closeButtonclick = callback;
    closeButton = this.element.querySelector('.film-details__close-btn');
    closeButton.addEventListener('click', this.#closeButtonClickHandler);
  }

  #closeButtonClickHandler = () => {
    this._callback.closeButtonclick();
  };

  documentKeydownHandler = (evt) => {
    if (evt.code === 'Escape') {
      this.closePopup();
    }
  };

  closeButtonClickHandler = () => {
    this.closePopup();
  };

  closePopup() {
    if(this.element.querySelector('.film-details__add-emoji-label')) {
      const checkedEmoji = this.element.querySelector('.film-details__add-emoji-label');
      if(checkedEmoji.querySelector('img')) {
        checkedEmoji.querySelector('img').remove();
      }
    }
    delete this._data.selectedEmoji;
    delete this._data.comment;
    this.element.remove();

    closeButton.removeEventListener('click', this.closeButtonClickHandler);
    document.removeEventListener('keydown', this.documentKeydownHandler);
    document.removeEventListener('click', this.documentBindedClickHandler);
    document.body.classList.remove('hide-overflow');
    this.#moviePresenter.popupMode = PopupMode.CLOSED;
  }

  postClickHandler(movie, moviePresenter, commentToDelete, oldPresenter, scrollCoordinates) {
    this.element.querySelector('form').reset();

    this.commentsModel.comments = moviePresenter.comments;

    if(this.#moviePresenter.comments !== null && commentToDelete) {
      const removedCommentIndex = this.#moviePresenter.comments.findIndex((current) => current.id === commentToDelete);
      this.#moviePresenter.comments.splice(removedCommentIndex, 1);
    }

    if(oldPresenter) {
      this.#moviePresenter.comments = oldPresenter.comments;
    }

    const userInputInfo = {};
    userInputInfo.selectedEmoji = movie.selectedEmoji;
    userInputInfo.comment = movie.comment;

    this.#changePopupMode();

    if(userInputInfo.selectedEmoji) {
      movie = {...movie, selectedEmoji: userInputInfo.selectedEmoji};
    }

    if(userInputInfo.comment) {
      movie = {...movie, comment: userInputInfo.comment};
    }

    moviePresenter.popupMode = PopupMode.OPENED;

    if(this.#moviePresenter.comments === null) {
      this.addCommentsList(scrollCoordinates);
    } else if (!this.element.querySelector('.film-details__comment')){
      this.setComments(this.#moviePresenter.comments, scrollCoordinates);
    }

    document.body.classList.add('hide-overflow');

    this._data = movie;

    this.addCloseButtonClickControl(this.closeButtonClickHandler);

    mainElement.appendChild(this.element);
    this.updateUserInputInfo();

    document.addEventListener('keydown', this.documentKeydownHandler);

    this.setDocumentClickHandler();

  }

  setComments(comments, scrollCoordinates) {
    this.#moviePresenter.comments = comments;
    comments.forEach((comment) => {
      const commentComponent = new CommentView(comment, this.cardComponent);
      this.#comments.push(commentComponent);
      this.element.querySelector('.film-details__comments-list').appendChild(commentComponent.element);
      commentComponent.addRemoveControlEvent(this._data, this);
    });
    if(scrollCoordinates) {
      this.element.scrollTo(...scrollCoordinates);
    }
  }

  addCommentsList(scrollCoordinates) {
    this.commentsModel.init().then(this.setComments.bind(this), scrollCoordinates);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('keydown', this.formSubmitHandler.bind(this));
  }

  formSubmitHandler(evt) {
    const emoji = this.element.querySelector('input[type="radio"]:checked');
    if ((evt.code === 'Enter' && (evt.ctrlKey || evt.metaKey)) && emoji) {
      evt.preventDefault();
      const commentText = this.element.querySelector('.film-details__comment-input').value;
      const newComment = {
        comment: commentText,
        emotion: emoji.value,
      };
      this._callback.formSubmit(this._data, newComment);
    }
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.favoriteClickHandler.bind(this));
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.watchlistClickHandler.bind(this));
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.historyClickHandler.bind(this));
  }

  favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick(this._data);
  }

  watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick(this._data);
  }

  historyClickHandler(evt) {
    evt.preventDefault();
    this._callback.historyClick(this._data);
  }

  setDocumentClickHandler() {
    this.documentBindedClickHandler = this.closePopup.bind(this);

    const documentAddEventListener = () => {
      document.addEventListener('click', this.documentBindedClickHandler);
    };

    this.element.addEventListener('click', (evt) => {
      evt.stopPropagation();
    });

    setTimeout(documentAddEventListener, 1);
  }

  #setInnerHandlers = () => {
    this.element.addEventListener('scroll', () => {
      this.scrollCoordinates = [this.element.scrollLeft, this.element.scrollTop];
    });
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.emojiChangeHandler.bind(this));
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.commentInputHandler.bind(this));

    this.setFormSubmitHandler(this.#moviePresenter.handleFormSubmit);

    this.setFavoriteClickHandler(this.#moviePresenter.handleFavoriteClick);
    this.setWatchlistClickHandler(this.#moviePresenter.handleWatchlistClick);
    this.setHistoryClickHandler(this.#moviePresenter.handleHistoryClick);
  };

  restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({comment: evt.target.value}, true);
  }
}

