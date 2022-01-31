import MenuView from '../view/menu-view.js';
import {remove, renderElement} from '../mock/render.js';
import {RenderPosition} from '../const.js';
import {replace} from '../mock/utils/utils.js';
import {filter} from '../mock/utils/filter.js';
import {FilterType, UpdateType} from '../const.js';
import { handleSiteMenuClick } from '../main.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #moviesModel = null;
  filterComponent = null;

  constructor(filterContainer, filterModel, moviesModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;
  }

  get filters() {
    const movies = this.#moviesModel.movies;

    return [
      {
        type: FilterType.ALL,
        name: 'ALL movies',
        count: filter[FilterType.ALL](movies).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](movies).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](movies).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](movies).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.filterComponent;

    this.filterComponent = new MenuView(filters, this.#filterModel.filter);
    this.filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
    this.filterComponent.setMenuClickHandler(handleSiteMenuClick);

    if (prevFilterComponent === null) {
      renderElement(this.#filterContainer, this.filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }
    replace(this.filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType && filterType === 'STATISTICS') {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  addObservers() {
    this.#moviesModel.addObserver(this.handleModelEvent);
    this.#filterModel.addObserver(this.handleModelEvent);
  }

  removeObservers() {
    this.#moviesModel.removeObserver(this.handleModelEvent);
    this.#filterModel.removeObserver(this.handleModelEvent);
  }
}
