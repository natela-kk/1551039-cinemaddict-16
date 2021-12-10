import AbctractView from './abstract-view.js';
import { POSTSCOUNT } from './extra-view.js';

const createFooterTemplate = () => (
  `<p>${POSTSCOUNT} movies inside</p>`
);

export default class FooterView extends AbctractView{
  get template() {
    return createFooterTemplate();
  }
}
