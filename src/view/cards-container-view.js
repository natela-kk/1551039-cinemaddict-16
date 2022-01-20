import AbstractView from './abstract-view.js';

const createCardsContainerTemplate = () => (`<section class="films">
  <section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container">
 </div>
 </section>
 </section>`);

export default class CradsContainerView extends AbstractView {
  get template() {
    return createCardsContainerTemplate();
  }
}
