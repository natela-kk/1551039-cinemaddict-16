import AbstractView from './abstract-view.js';
import {SortType} from '../const.js';

const ACTIVE_SORT_CLASS = 'sort__button--active';

const createSortTemplate = (currentSortType) => (
  `<ul class="sort">
  <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class="sort__button ${currentSortType === SortType.DATE ? 'sort__button--active' : ''}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
  <li><a href="#" class="sort__button ${currentSortType === SortType.RATING ? 'sort__button--active' : ''}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
</ul>`
);

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
    this.addSortButtonClickHandler();
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };

  addSortButtonClickHandler() {
    this.#currentSortType = this.element.querySelector(`.${ACTIVE_SORT_CLASS}`);
    this.element.addEventListener('click', (evt) => {
      if (evt.target.className === 'sort__button' && this.#currentSortType !== evt.target) {
        this.#currentSortType.classList.remove(ACTIVE_SORT_CLASS);
        this.#currentSortType = evt.target;
        this.#currentSortType.classList.add(ACTIVE_SORT_CLASS);
      }
    });
  }

}
