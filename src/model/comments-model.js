import AbstractObservable from '../mock/utils/abstract-observable.js';

export default class CommentsModel extends AbstractObservable {
    #apiService = null;
    comments = [];

    constructor(apiService) {
      super();
      this.#apiService = apiService;
    }

    init = async () => {
      try {
        const comments = await this.#apiService.comments;
        this.comments = comments;
        return comments;
      } catch(err) {
        this.comments = [];
        throw new Error;
      }
    }

    addComment = async (updatedMovie, comment, popup) => {
      popup.element.querySelector('textarea').disabled = true;

      try {
        const response = await this.#apiService.addComment(updatedMovie, comment);

        this.comments = [...response.comments];

        return this.#adaptToClient(response.movie);
      } catch(err) {
        popup.element.querySelector('textarea').disabled = false;
        popup.element.classList.add('shake');
        throw new Error('Can\'t add comment');
      }
    }

    deleteComment = async (commentToDelete, deleteButtonElement) => {
      deleteButtonElement.disabled = true;
      deleteButtonElement.textContent = 'Deleting...';
      const index = this.comments.findIndex((comment) => comment.id === commentToDelete);
      if (index === -1) {
        throw new Error('Can\'t delete unexisting comment');
      }

      try {
        await this.#apiService.deleteComment(commentToDelete);
        this.comments = [
          ...this.comments.slice(0, index),
          ...this.comments.slice(index + 1),
        ];
      } catch(err) {
        deleteButtonElement.disabled = false;
        deleteButtonElement.closest('.film-details__comment').classList.add('shake');
        throw new Error('Can\'t delete comment');
      }
    }

    #adaptToClient = (movie) => {
      const adaptedMovie = {...movie,
        filmInfo: {...movie['film_info'],
          ageRating: movie['film_info']['age_rating'],
          alternativeTitle: movie['film_info']['alternative_title'],
          release: {...movie['film_info']['release'],
            releaseCountry: movie['film_info']['release']['release_country']},
          totalRating: movie['film_info']['total_rating']},

        userDetails: {...movie['user_details'],
          alreadyWatched: movie['user_details']['already_watched'],
          watchingDate: movie['user_details']['watching_date']},
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

