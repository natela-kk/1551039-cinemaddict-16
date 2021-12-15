import AbctractView from './abstract-view.js';
import { renderMovies } from './render-data.js';
import { allMovies } from './render-data.js';
const NEXT_POSTS_COUNT = 5;

const createButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ButtonView extends AbctractView {
  get template() {
    return createButtonTemplate();
  }

  addClickControlsEvent() {
    let renderedMoviesCount = NEXT_POSTS_COUNT;
    this.element.addEventListener('click', (evt) => {
      evt.preventDefault();
      console.log(renderedMoviesCount, renderedMoviesCount + NEXT_POSTS_COUNT);
      renderMovies(renderedMoviesCount, renderedMoviesCount + NEXT_POSTS_COUNT);
      renderedMoviesCount += NEXT_POSTS_COUNT;
      if (renderedMoviesCount >= allMovies.length) {
        this.element.remove();
      }
    });
  }
}
