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
    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  addComment = async (movie, comment) => {
    console.log(comment);
    const response = await this.#loadComments({
      url: movie.id,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(movie, comment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  deleteComment = async (comment) => {
    const response = await this.#deleteCommentOnServer({
      url: `https://16.ecmascript.pages.academy/cinemaddict/comments/${comment}`,
      method: Method.DELETE,
    });

    return response;
  }

  #deleteCommentOnServer = async ({
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

  #adaptToServer = (movie, comment) => {
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
