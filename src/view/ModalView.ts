export class ModalView {
  private root = document.getElementById('modal-container') as HTMLElement;
  private content = this.root.querySelector('.modal__content') as HTMLElement;
  private closeBtn = this.root.querySelector('.modal__close') as HTMLButtonElement;

  constructor() {

    this.cleanupForeignModals();

    this.closeBtn.addEventListener('click', () => this.close());

    this.root.addEventListener('click', (e) => {
      if (e.target === this.root) this.close();
    });
    // Escape закрывает окно
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  private cleanupForeignModals() {

    this.root.classList.remove('modal_active');

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
