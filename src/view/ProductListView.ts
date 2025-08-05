import { IView } from '../types/base/View';
import { EventEmitter } from '../components/base/events';

export class ProductListView implements IView<HTMLElement[]> {
  private container: HTMLElement;

  constructor(private events: EventEmitter) {
    const container = document.querySelector('.gallery') as HTMLElement | null;
    if (!container) {
      throw new Error('ProductListView: .gallery не найден');
    }
    this.container = container;
  }

  render(productCards: HTMLElement[]) {
    this.container.replaceChildren(...productCards);
  }

  clear() {
    this.container.replaceChildren();
  }
}
