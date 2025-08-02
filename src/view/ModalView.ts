export class ModalView {
  private root = document.getElementById('modal-container') as HTMLElement;
  private content = this.root.querySelector('.modal__content') as HTMLElement;
  private closeBtn = this.root.querySelector('.modal__close') as HTMLButtonElement;

  constructor() {
    // Санитизация DOM: закрыть рабочую модалку и убрать демонстрационные
    this.cleanupForeignModals();

    this.closeBtn.addEventListener('click', () => this.close());
    // Клик по оверлею закрывает окно
    this.root.addEventListener('click', (e) => {
      if (e.target === this.root) this.close();
    });
    // Escape закрывает окно
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  // Принудительно закрываем нашу модалку и удаляем все лишние .modal из index.html
  private cleanupForeignModals() {
    // Снять активность у рабочей модалки
    this.root.classList.remove('modal_active');

    // Удалить прочие .modal (демо-блоки из макета), чтобы они не перекрывали страницу
    document.querySelectorAll<HTMLElement>('.modal').forEach((el) => {
      if (el !== this.root) {
        el.remove();
      }
    });
  }

  open(node: HTMLElement) {
    this.content.replaceChildren(node);
    this.root.classList.add('modal_active');
  }

  close() {
    this.root.classList.remove('modal_active');
    this.content.replaceChildren();
  }
}
