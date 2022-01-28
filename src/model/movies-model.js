import AbstractObservable from '../mock/utils/abstract-observable.js';
import {UpdateType} from '../const.js';

export default class MoviesModel extends AbstractObservable{
  #apiService = null;
  #movies = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get movies() {
    return this.#movies;
  }

  init = async () => {
    try {
      const movies = await this.#apiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch(err) {
      this.#movies = [];
    }

    this._notify(UpdateType.INIT);
  }

  updateMovie(updateType, update, oldPresenter) {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];
    this._notify(updateType, update, null, {saveInputInfo: true}, oldPresenter);
  }

  sendUpdate = (updateType, update, oldPresenter) => {
    this.#apiService.updateMovie(update).then(this.updateMovie(updateType, update, oldPresenter));
  }

  #adaptToClient = (movie) => {
    const adaptedMovie = {...movie,
      filmInfo: {...movie['film_info'], ageRating: movie['film_info']['age_rating'], alternativeTitle: movie['film_info']['alternative_title'], release: {...movie['film_info']['release'], releaseCountry: movie['film_info']['release']['release_country']}, totalRating: movie['film_info']['total_rating']},
      userDetails: {...movie['user_details'], alreadyWatched: movie['user_details']['already_watched'], watchingDate: movie['user_details']['watching_date']},
    };

    delete adaptedMovie['film_info'];
    delete adaptedMovie['user_details'];
    delete adaptedMovie['filmInfo']['age_rating'];
    delete adaptedMovie['filmInfo']['alternative_title'];
    delete adaptedMovie['filmInfo']['release']['release_country'];
    delete adaptedMovie['filmInfo']['total_rating'];
    delete adaptedMovie['userDetails']['already_watched'];
    delete adaptedMovie['userDetails']['watching_date'];

    return adaptedMovie;
  }
}
