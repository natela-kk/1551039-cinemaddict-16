import AbstractObservable from '../mock/utils/abstract-observable.js';
import {UpdateType} from '../const.js';

export default class CommentsModel extends AbstractObservable {
    #apiService = null;
    #comments = [];

    constructor(apiService) {
      super();
      this.#apiService = apiService;
    }

    init = async () => {
      try {
        const comments = await this.#apiService.comments;
        this.#comments = comments;
        return comments;
      } catch(err) {
        this.#comments = [];
        throw new Error;
      }

      // this._notify(UpdateType.INIT);
    }

    addComment = (updateType, update) => {
      this.#comments = [
        update,
        ...this.#comments,
      ];

      this._notify(updateType, update);
    }

    deleteComment = (updateType, update) => {
      const index = this.#comments.findIndex((comment) => comment.id === update.comment.id);

      if (index === -1) {
        throw new Error('Can\'t delete unexisting movie');
      }

      this.#comments = [
        ...this.#comments.slice(0, index),
        update,
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType, update);
    }

}

