import { cloneTemplate, ensureElement } from '../utils/utils';

export class SuccessView {
  private node: HTMLElement;

  constructor() {
    this.node = cloneTemplate('#success');
  }

  render(): HTMLElement {
    return this.node;
  }

  renderError(message: string): HTMLElement {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'modal__error';
    errorDiv.textContent = message;
    return errorDiv;
  }
}
