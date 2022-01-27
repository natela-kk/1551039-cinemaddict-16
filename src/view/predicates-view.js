import AbstractView from './abstract-view';

const getWatchlistStatus = (userDetails) => userDetails.watchlist ? ('film-details__control-button--active') : '';
const getWatchedStatus = (userDetails) => userDetails.alreadyWatched ? ('film-details__control-button--active') : '';
const getFavoriteStatus = (userDetails) => userDetails.favorite ? ('film-details__control-button--active') : '';

const createPredicatesTemplate = (movieInfo) => {
  console.log();
  const {userDetails} = movieInfo;

  return (`<section class="film-details__controls">
      <button type="button" class="film-details__control-button film-details__control-button--watchlist ${getWatchlistStatus(userDetails)}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${getWatchedStatus(userDetails)}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite  ${getFavoriteStatus(userDetails)}" id="favorite" name="favorite">Add to favorites</button>
        </section>`
  );
};

export default class PredicatesView extends AbstractView {
  constructor(movieInfo) {
    super();
    this.movieInfo = movieInfo;
  }

  get template() {
    return createPredicatesTemplate(this.movieInfo);
  }

}
