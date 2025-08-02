import { IProduct } from '../types/model/Product';
import { IView } from '../types/base/View';
import { EventEmitter } from '../components/base/events';

export class ProductListView implements IView<IProduct[]> {
  private container: HTMLElement;
  private template: HTMLTemplateElement;
  private data: IProduct[] = [];

  constructor(private events: EventEmitter) {
    const container = document.querySelector('.gallery') as HTMLElement | null;
    const template = document.querySelector<HTMLTemplateElement>('#card-catalog');

    if (!container) throw new Error('ProductListView: .gallery не найден');
    if (!template) throw new Error('ProductListView: #card-catalog не найден');

    this.container = container;
    this.template = template;

    // ЕДИНСТВЕННЫЙ обработчик кликов — не дублируется при повторных render()
    this.container.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.card');
      if (!btn) return;
      const id = btn.dataset.id;
      if (id) this.events.emit('product:select', { id });
    });
  }

  render(products: IProduct[]) {
    this.data = products;

    const nodes = products.map((p) => {
      const node = this.template.content.firstElementChild!.cloneNode(true) as HTMLButtonElement;

      // ВАЖНО: кладём id в data-атрибут, чтобы делегированный обработчик его прочитал
      node.classList.add('card');
      node.dataset.id = p.id;

      (node.querySelector('.card__title') as HTMLElement).textContent = p.title;
      (node.querySelector('.card__price') as HTMLElement).textContent = `${p.price.toLocaleString('ru-RU')} синапсов`;
      (node.querySelector('.card__category') as HTMLElement).textContent = p.category;

      const img = node.querySelector('.card__image') as HTMLImageElement | null;
      if (img) {
        img.src = p.image;
        img.alt = p.title;
      }

      return node;
    });

    // заменяем детей одним действием — безопасно вызывать сколь угодно раз
    this.container.replaceChildren(...nodes);
  }

  clear() {
    this.data = [];
    this.container.replaceChildren();
  }
}
