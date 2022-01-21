import AbstractObservable from '../mock/utils/abstract-observable.js';
import {UpdateType} from '../const.js';

export default class CommentsModel extends AbstractObservable {
    #apiService = null;
    #comments = [];

    constructor(apiService) {
      super();
      this.#apiService = apiService;
    }

    get comments() {
      console.log(this.#comments);//пустой массив
      return this.#comments;
    }

    init = async (setComments) => {
      try {
        const comments = await this.#apiService.comments;
        setComments(comments);
      } catch(err) {
        this.#comments = [];
      }

      // this._notify(UpdateType.INIT);
    }

  // updateComment = (updateType, update) => {
  //   const index = this.#comments.findIndex((comment) => comment.id === update.id);

  //   if (index === -1) {
  //     throw new Error('Can\'t update unexisting movie');
  //   }

  //   this.#comments = [
  //     ...this.#comments.slice(0, index),
  //     update,
  //     ...this.#comments.slice(index + 1),
  //   ];
  //   this._notify(updateType, update);
  // }

  // #adaptToClient = (movie) => {
  //   const adaptedMovie = {...movie,
  //     filmInfo: {...movie['film_info'], ageRating: movie['film_info']['age_rating'], alternativeTitle: movie['film_info']['alternative_title'], release: {...movie['film_info']['release'], releaseCountry: movie['film_info']['release']['release_country']}, totalRating: movie['film_info']['total_rating']},
  //     userDetails: {...movie['user_details'], alreadyWatched: movie['user_details']['already_watched'], watchingDate: movie['user_details']['watching_date']},
  //   };

  //   delete adaptedMovie['film_info'];
  //   delete adaptedMovie['user_details'];
  //   delete adaptedMovie['filmInfo']['age_rating'];
  //   delete adaptedMovie['filmInfo']['alternative_title'];
  //   delete adaptedMovie['filmInfo']['release']['release_country'];
  //   delete adaptedMovie['filmInfo']['total_rating'];
  //   delete adaptedMovie['userDetails']['already_watched'];
  //   delete adaptedMovie['userDetails']['watching_date'];

  //   return adaptedMovie;
  // }
}
