import { createMenuTemplate } from './view/menu-view.js';
import { createFilterTemplate } from './view/filter-view.js';
import { createCardsTemplate } from './cards-view.js';
import { createButtonTemplate } from './button-view.js';
import { createUserNameTemplate } from './view/user-name-view.js';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');

const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

renderTemplate(headerElement, createUserNameTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createFilterTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createCardsTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createButtonTemplate(), RenderPosition.BEFOREEND);

