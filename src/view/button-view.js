import AbstractView from './abstract-view.js';

const createButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ButtonView extends AbstractView {
  get template() {
    return createButtonTemplate();
  }
}
