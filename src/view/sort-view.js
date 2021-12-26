import AbstractView from './abstract-view.js';

export const ACTIVE_SORT_CLASS = 'sort__button--active';

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date-down',
  RATING: 'rating-down',
};

const createFilterTemplate = () => (
  `<ul class="sort">
  <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
  <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
</ul>`
);

export default class SortView extends AbstractView{
  get template() {
    return createFilterTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
