import MenuView from '../view/menu-view.js';
import { remove, renderElement } from '../mock/render.js';
import { RenderPosition } from '../mock/generate.js';
import { replace } from '../mock/utils/utils.js';
import { filter } from '../mock/utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #moviesModel = null;
  #statsComponent = null;
  filterComponent = null;
  #movieListPresenter = null;

  constructor(filterContainer, filterModel, moviesModel, statsComponent, movieListPresenter) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;
    this.#statsComponent = statsComponent;
    this.#movieListPresenter = movieListPresenter;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
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

    this.filterComponent = new MenuView(filters, this.#filterModel.filter, this.#statsComponent, this.#movieListPresenter);
    this.filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      renderElement(this.#filterContainer, this.filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType, scrollCoordinates) => {
console.log(filterType);
    if (this.#filterModel.filter === filterType && filterType === 'STATISTICS') {
      return;
    }
console.log(filterType);
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType, scrollCoordinates);
  }
}
