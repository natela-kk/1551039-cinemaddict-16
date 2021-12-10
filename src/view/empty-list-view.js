import AbctractView from './abstract-view.js';

const createEmtyListTemplate = () => ('<h2 class="films-list__title">There are no movies in our database</h2>');

export default class EmtyListView extends AbctractView{
  get template() {
    return createEmtyListTemplate();
  }
}
