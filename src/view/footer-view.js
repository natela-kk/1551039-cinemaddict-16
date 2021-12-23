import AbstractView from './abstract-view.js';
import { POSTSCOUNT } from './extra-view.js';

const createFooterTemplate = () => (
  `<p>${POSTSCOUNT} movies inside</p>`
);

export default class FooterView extends AbstractView{
  get template() {
    return createFooterTemplate();
  }
}
