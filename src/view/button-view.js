import AbctractView from './abstract-view.js';
import { renderMovies, allMovies } from './cards-list.js';

const NEXT_POSTS_COUNT = 5;

const createButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ButtonView extends AbctractView {
  get template() {
    return createButtonTemplate();
  }

  addClickControleEvent() {
    let renderedMoviesCount = NEXT_POSTS_COUNT;
    this.element.addEventListener('click', (evt) => {
      evt.preventDefault();
      renderMovies(renderedMoviesCount, renderedMoviesCount + NEXT_POSTS_COUNT);
      renderedMoviesCount += NEXT_POSTS_COUNT;
      if (renderedMoviesCount >= allMovies.length) {
        this.element.remove();
      }
    });
  }
}
