export const createCardsContainerTemplate = () => (`<section class="films">
  <section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container">
 </div>
 </section>
 </section>`);

const getFilmDescription = (description) => {
  const text = description.join(' ');
  if (text.length > 140) {
    return `${text.substr(0, 139)}...`;
  } else {
    return text;
  }
};


export const createCardTemplate = (card) => {
  const {filmInfo, comments} = card;

  return `<article class="film-card">
        <a class="film-card__link">
          <h3 class="film-card__title">${filmInfo.title}</h3>
          <p class="film-card__rating">${filmInfo.total_rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${filmInfo.release.date.format('YYYY')}</span>
            <span class="film-card__duration">${filmInfo.runtime}</span>
            <span class="film-card__genre">${filmInfo.genre}</span>
          </p>
          <img src="${filmInfo.poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${getFilmDescription(filmInfo.description)}</p>
          <span class="film-card__comments">${comments.length} comments</span>
        </a>
        <div class="film-card__controls">
          <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
          <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
          <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
        </div>
      </article>`;
};
