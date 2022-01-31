import AbstractView from './abstract-view.js';

const createFooterTemplate = () => (
  '<p> 0 movies inside</p>'
);

export default class FooterView extends AbstractView {
  get template() {
    return createFooterTemplate();
  }

  setCount(count) {
    this.element.textContent = `${count} movies inside`;
  }
}
