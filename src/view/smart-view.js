import AbstractView from './abstract-view.js';

export default class SmartView extends AbstractView {
  _data = {};

  restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }

  updateElement() {
    const prevElement = this.element;
    const parent = prevElement.parentElement;

    this.removeElement();

    const newElement = this.element;
    console.log(newElement);

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  updateData = (update, justDataUpdating) => {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};
    console.log(this._data);
    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  };
}
