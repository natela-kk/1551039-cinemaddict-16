import AbstractView from './abstract-view.js';

const createButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ButtonView extends AbstractView {
  get template() {
    return createButtonTemplate();
  }

  setClickHandler(callback) {
    this._callback.loadMoreButtonClick = callback;
    this.element.addEventListener('click', this.clickHandler.bind(this));
  }

  clickHandler(evt) {
    evt.preventDefault();
    this._callback.loadMoreButtonClick();
  }
}
