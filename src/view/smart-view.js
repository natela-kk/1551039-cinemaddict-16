import AbstractView from './abstract-view.js';

export default class SmartView extends AbstractView{
  _data = {};

  restoreHandlers() {
  // восстанавливать обработчики событий после перерисовки;
    throw new Error('Abstract method not implemented: restoreHandlers');
  }

  updateElement() {
    const prevElement = this.element;
    const parent = prevElement.parentElement;

    // удалить старый DOM-элемент компонента;
    this.removeElement();

    // создать новый DOM-элемент;
    const newElement = this.element;

    // поместить новый элемент вместо старого;
    parent.replaceChild(newElement, prevElement);

    // восстановить обработчики событий, вызвав restoreHandlers.
    this.restoreHandlers();
  }

  updateData = (update, justDataUpdating) => {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};

    if (justDataUpdating) {
      return;
    }

    this.updateElement();

  }

}
