import AbstractView from './abstract-view.js';
import {MenuItem} from '../const.js';

export const ACTIVE_CLASS = 'main-navigation__item--active';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return `<a href="#${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" name = ${type}>${name} ${type !== 'all' ? `<span class="main-navigation__item-count">${count}</span>` : ''}</a>`;
};

const createMenuTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');
  return (
    `<nav class="main-navigation">
  <div class="main-navigation__items">
  ${filterItemsTemplate}
  </div>
  <a href="#stats" class="main-navigation__additional" name = ${MenuItem.STATISTICS}>Stats</a>
  </nav>
  </section>`
  );
};

export default class MenuView extends AbstractView {
  #currentFilter = null;
  #filters = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;

    this.setActiveFilter();
  }

  get template() {
    return createMenuTemplate(this.#filters, this.#currentFilter);
  }

  setActiveFilter() {
    const locationHash = window.location.hash.split('#')[1];
    if (locationHash) {
      this.element.querySelector(`.${ACTIVE_CLASS}`).classList.remove(ACTIVE_CLASS);
      this.element.querySelector(`a[href="#${locationHash}"`).classList.add(ACTIVE_CLASS);
    }
    this._callback.setFilter = this.changeActiveFilter.bind(this);
    this.element.addEventListener('click', this._callback.setFilter);
  }

  changeActiveFilter(evt) {
    evt.preventDefault();
    this.#currentFilter = this.element.querySelector(`.${ACTIVE_CLASS}`);

    if ((evt.target.tagName === 'A' || evt.target.className === 'main-navigation__item-count') && this.#currentFilter !== evt.target) {
      this.#currentFilter.classList.remove(ACTIVE_CLASS);
      this.#currentFilter = evt.target.closest('.main-navigation__item');
      if (this.#currentFilter === null) {
        this.#currentFilter = evt.target;
      }
      this.#currentFilter.classList.add(ACTIVE_CLASS);
    }
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {

    if (evt.target.classList.contains('main-navigation__item') || evt.target.className === 'main-navigation__item-count') {
      evt.preventDefault();
      const filter = evt.target.closest('.main-navigation__item ');
      this._callback.filterTypeChange(filter.name);
    }
  };

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  };

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'A' || evt.target.className === 'main-navigation__item-count') {
      let filter;
      if (evt.target.className === 'main-navigation__item' || evt.target.className === 'main-navigation__item-count') {
        filter = evt.target.closest('.main-navigation__item ');
      } else {
        filter = evt.target;
      }
      this._callback.menuClick(filter.name.toUpperCase());
    }
  };
}

