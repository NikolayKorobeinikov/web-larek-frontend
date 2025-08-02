export class CartCounterView {
  private el: HTMLElement;

  constructor(selector = '.header__basket-counter') {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) throw new Error(`CartCounterView: ${selector} не найден`);
    this.el = el;
  }

  render(count: number) {
    this.el.textContent = String(count);
    this.el.classList.toggle('hidden', count <= 0);
  }
}
