import AbstractView from './abstract-view.js';

const createEmtyListTemplate = () => ('<h2 class="films-list__title">There are no movies in our database</h2>');

export default class EmtyListView extends AbstractView{
  get template() {
    return createEmtyListTemplate();
  }
}
