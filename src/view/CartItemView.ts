import { cloneTemplate, ensureElement } from '../utils/utils';
import { IProduct } from '../types/model/Product';
import { EventEmitter } from '../components/base/events';

export class CartItemView {
  private node: HTMLElement;

  constructor(product: IProduct, index: number, events: EventEmitter) {
    this.node = cloneTemplate('#card-basket');

    ensureElement<HTMLElement>('.basket__item-index', this.node).textContent = String(index);
    ensureElement<HTMLElement>('.card__title', this.node).textContent = product.title;
    ensureElement<HTMLElement>('.card__price', this.node).textContent = `${product.price} синапсов`;

    const deleteBtn = ensureElement<HTMLButtonElement>('.basket__item-delete', this.node);
    deleteBtn.addEventListener('click', () => {
      events.emit('cart:remove', { id: product.id });
    });
  }

  render(): HTMLElement {
    return this.node;
  }
}
