import {FilterType} from '../const';

export const filter = {
  [FilterType.ALL]: (movies) => movies.filter((movie) => movie),
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) =>  movie.watchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.isAlreadyWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.isFavorite),
};
