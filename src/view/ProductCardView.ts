import { IProduct } from '../types/model/Product';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { EventEmitter } from '../components/base/events';

export class ProductCardView {
  private node: HTMLButtonElement;

  constructor(product: IProduct, events: EventEmitter) {
    this.node = cloneTemplate('#card-catalog');

    this.node.dataset.id = product.id;
    ensureElement<HTMLElement>('.card__title', this.node).textContent = product.title;
    ensureElement<HTMLElement>('.card__price', this.node).textContent = `${product.price.toLocaleString('ru-RU')} синапсов`;
    ensureElement<HTMLElement>('.card__category', this.node).textContent = product.category;

    const img = this.node.querySelector('.card__image') as HTMLImageElement;
    if (img) {
      img.src = product.image;
      img.alt = product.title;
    }

    this.node.addEventListener('click', () => {
      events.emit('product:select', { id: product.id });
    });
  }

  render(): HTMLButtonElement {
    return this.node;
  }
}
