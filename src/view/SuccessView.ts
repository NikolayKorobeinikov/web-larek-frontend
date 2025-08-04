import { cloneTemplate } from '../utils/utils';

export class SuccessView {
  private node: HTMLElement;

  constructor() {
    this.node = cloneTemplate('#success');
  }

  bindClose(handler: () => void) {
    this.node.querySelector('.order-success__close')!
      .addEventListener('click', handler);
  }

  render(): HTMLElement {
    return this.node;
  }
}
