const COMMENT_END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict/comments';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get movies() {
    return this.#loadMovies({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  get comments() {
    return this.#loadComments('')
      .then(ApiService.parseResponse);
  }

  updateMovie = async (movie) => {
    const response = await this.#loadMovies({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    return await ApiService.parseResponse(response);
  }

  addComment = async (movie, comment) => {
    const response = await this.#deletePostCommentOnServer({
      url: `${COMMENT_END_POINT}/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  deleteComment = async (comment) => await this.#deletePostCommentOnServer({
    url: `https://16.ecmascript.pages.academy/cinemaddict/comments/${comment}`,
    method: Method.DELETE,
  })

  #deletePostCommentOnServer = async ({
    url,
    method,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);
    const response = await fetch(
      url,
      {method, body, headers},
    );
    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #loadMovies = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);
    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );
    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #loadComments = async ({
    url = this.#endPoint,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);
    const response = await fetch(
      url,
      {method, body, headers},
    );
    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (movie) => {
    if(movie.filmInfo) {
      const adaptedMovie = {...movie,
        'film_info': {...movie.filmInfo, 'age_rating': movie.filmInfo.ageRating, 'alternative_title': movie.filmInfo.alternativeTitle, release: {...movie.filmInfo.release, 'release_country': movie.filmInfo.release.releaseCountry}, 'total_rating': movie.filmInfo.totalRating},
        'user_details': {...movie.userDetails, 'already_watched': movie.userDetails.alreadyWatched, 'watching_date': movie.userDetails.watchingDate},
      };
      delete adaptedMovie.filmInfo;
      delete adaptedMovie.film_info.ageRating;
      delete adaptedMovie.film_info.alternativeTitle;
      delete adaptedMovie.film_info.release.releaseCountry;
      delete adaptedMovie.film_info.totalRating;
      delete adaptedMovie.userDetails;
      delete adaptedMovie.user_details.alreadyWatched;
      delete adaptedMovie.user_details.watchingDate;
      return adaptedMovie;
    }
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
