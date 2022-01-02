import { mainElement } from '../main.js';
import CommentView from './comment-view.js';
import { PopupMode } from '../presenter/movie-presenter.js';
import SmartView from './smart-view.js';

let checkedEmotion;
// let emotionImages;
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

export default class PopupView extends SmartView{
  #changePopupMode = null;
  #moviePresenter = null;


  constructor(movieInfo, changePopupMode, moviePresenter, cardComponent) {
    super();
    this.cardComponent = cardComponent;

    this._data = movieInfo;
    this.addCommentsList(this._data);

    this.#moviePresenter = moviePresenter;
    this.#changePopupMode = changePopupMode;
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupTemplate(this._data);
  }


  inputKeydownHandler (evt, commentInput, popupComponent) {
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
      const newCommentComponent = new CommentView(newComment);
      commentList.appendChild(newCommentComponent.element);
      form.reset();
      userEmoji.remove();
      newCommentComponent.setCommentsCount(popupComponent, this.cardComponent);
      newCommentComponent.addRemoveControlEvent(popupComponent, this.cardComponent);
    }
  }

  emojiChangeHandler(evt) {
    evt.preventDefault();
    checkedEmotion = this.element.querySelector('input[type="radio"]:checked');
    const checkedEmotionId = checkedEmotion.id;

    this.updateData({selectedEmoji: checkedEmotion.value});
    checkedEmotion = this.element.querySelector(`#${checkedEmotionId}`);
    checkedEmotion.checked = true;

    const commentInput = this.element.querySelector('.film-details__comment-input');
    commentInput.value = this._data.comment ? this._data.comment : '';
    this.addCommentsList(this._data);
    this.element.scrollTo(this.scrollX, this.scrollY);
  }

  addInputKeydownControl() {
    const commentInput = this.element.querySelector('.film-details__comment-input');
    commentInput.addEventListener('keydown', (evt) => {
      this.inputKeydownHandler(evt, commentInput, this.element);
    });
  }

  addCloseButtonClickControl(callback) {
    this._callback.closeButtonclick = callback;
    closeButton = this.element.querySelector('.film-details__close-btn');
    closeButton.addEventListener('click', this.#closeButtonClickHandler);
  }

  #closeButtonClickHandler = () => {
    this._callback.closeButtonclick();
  }

    documentKeydownHandler = (evt) => {
      if (evt.code === 'Escape') {
        this.closePopup();
      }
    };

    closeButtonClickHandler = () => {
      this.closePopup();
    };

    closePopup() {
      this.element.remove();
      closeButton.removeEventListener('click', this.closeButtonClickHandler);
      document.removeEventListener('keydown', this.documentKeydownHandler);
      document.body.classList.remove('hide-overflow');
      this.#moviePresenter.popupMode = PopupMode.CLOSED;
    }

    postClickHandler(movie, moviePresenter) {

      this.#changePopupMode();
      moviePresenter.popupMode = PopupMode.OPENED;
      document.body.classList.add('hide-overflow');

      this._data = movie;

      this.addCloseButtonClickControl(this.closeButtonClickHandler);
      mainElement.appendChild(this.element);

      this.addInputKeydownControl();
      document.addEventListener('keydown', this.documentKeydownHandler);
    }

    addCommentsList(movie) {
      movie.comments.forEach((comment) => {
        const commentComponent = new CommentView(comment);
        this.element.querySelector('.film-details__comments-list').appendChild(commentComponent.element);
        commentComponent.addRemoveControlEvent(this.element, this.cardComponent);
      });
    }

    setFormSubmitHandler(callback) {
      this._callback.formSubmit = callback;

      this.element.querySelector('form').addEventListener('keydown', this.formSubmitHandler.bind(this));
    }

    formSubmitHandler(evt) {
      if(evt.code === 'Enter') {
        evt.preventDefault();
        const commentText = this.element.querySelector('.film-details__comment-input').value;
        const emojiValue = this.element.querySelector('input[type="radio"]:checked').value;
        PopupView.parseDataToMovie(this._data, commentText, emojiValue);
        this._callback.formSubmit(this._data);
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
      this._callback.favoriteClick();
    }

    watchlistClickHandler(evt) {
      evt.preventDefault();
      this._callback.watchlistClick();
    }

    historyClickHandler(evt) {
      evt.preventDefault();
      this._callback.historyClick();
    }

    static parseDataToMovie = (movie, comment, emoji) => {
      if(movie.selectedEmoji) {
        movie.selectedEmoji.delete();
      }
      if(movie.comment) {
        movie.comment.delete();
      }
      return ({...movie, ok: comment, emoji});
    }

    #setInnerHandlers = () => {
      this.element.addEventListener('scroll', () => {
        this.scrollX = this.element.scrollLeft;
        this.scrollY = this.element.scrollTop;
      });

      this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.emojiChangeHandler.bind(this));
      this.element.querySelector('.film-details__comment-input').addEventListener('input', this.commentInputHandler.bind(this));

      this.setFormSubmitHandler(this.#moviePresenter.handleFormSubmit);

      this.setFavoriteClickHandler(this.#moviePresenter.handleFavoriteClick);
      this.setWatchlistClickHandler(this.#moviePresenter.handleWatchlistClick);
      this.setHistoryClickHandler(this.#moviePresenter.handleHistoryClick);
    }

    restoreHandlers = () => {
      this.#setInnerHandlers();
    }

    commentInputHandler(evt) {
      evt.preventDefault();
      this.updateData({ comment: evt.target.value }, true);
    }
}

