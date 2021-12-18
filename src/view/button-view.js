import AbctractView from './abstract-view.js';

const createButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ButtonView extends AbctractView {
  get template() {
    return createButtonTemplate();
  }
}
