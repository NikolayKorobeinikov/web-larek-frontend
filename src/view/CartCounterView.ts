import { ensureElement } from '../utils/utils';

export class CartCounterView {
  private counterEl: HTMLElement;

  constructor() {
    this.counterEl = ensureElement<HTMLElement>('.header__basket-counter');
  }

  render(count: number) {
    this.counterEl.textContent = String(count);
  }
}
