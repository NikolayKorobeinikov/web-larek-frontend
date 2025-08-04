import { IProduct } from '../types/model/Product';
import { cloneTemplate } from '../utils/utils';

export class ProductPreviewView {
  private node: HTMLElement;
  private title: HTMLElement;
  private price: HTMLElement;
  private image: HTMLImageElement;
  private button: HTMLButtonElement;

  constructor() {
    this.node = cloneTemplate('#card-preview');

    this.title = this.node.querySelector('.card__title')!;
    this.price = this.node.querySelector('.card__price')!;
    this.image = this.node.querySelector('.card__image')!;
    this.button = this.node.querySelector('.card__button')!;
  }

  render(product: IProduct, inCart: boolean, onToggle: () => void): HTMLElement {
    this.title.textContent = product.title;
    this.price.textContent = `${product.price.toLocaleString('ru-RU')} синапсов`;
    this.image.src = product.image;
    this.image.alt = product.title;

    this.button.textContent = inCart ? 'Убрать' : 'В корзину';
    this.button.onclick = onToggle;

    return this.node;
  }
}
