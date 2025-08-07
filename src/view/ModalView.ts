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

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  private cleanupForeignModals() {
    document.querySelectorAll<HTMLElement>('.modal').forEach((el) => {
      if (el !== this.root) {
        el.style.display = 'none';
      }
    });

    this.root.classList.remove('modal_active');
  }

  open(node: HTMLElement) {
    this.content.replaceChildren(node);
    this.root.classList.add('modal_active');

    document.querySelectorAll<HTMLElement>('.modal').forEach((el) => {
      if (el !== this.root) {
        el.style.display = 'none';
      }
    });

    this.root.style.position = 'fixed';
    this.root.style.top = '0';
    this.root.style.left = '0';
    this.root.style.right = '0';
    this.root.style.bottom = '0';
    this.root.style.zIndex = '1000';
  }

  close() {
    this.root.classList.remove('modal_active');
    this.content.replaceChildren();
  }
}
