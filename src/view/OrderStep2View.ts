import { cloneTemplate } from '../utils/utils';

export class OrderStep2View {
  private node: HTMLElement;
  private email: HTMLInputElement;
  private phone: HTMLInputElement;
  private submit: HTMLButtonElement;
  private errors: HTMLElement;

  constructor() {
    this.node = cloneTemplate('#contacts');
    this.email = this.node.querySelector('input[name="email"]')!;
    this.phone = this.node.querySelector('input[name="phone"]')!;
    this.submit = this.node.querySelector('button[type="submit"]')!;
    this.errors = this.node.querySelector('.form__errors')!;

    this.email.addEventListener('input', () => this.validate());
    this.phone.addEventListener('input', () => this.validate());
  }

  private validate() {
    const ok = /\S+@\S+\.\S+/.test(this.email.value) && this.phone.value.trim().length >= 6;
    this.submit.disabled = !ok;
    this.errors.textContent = ok ? '' : 'Заполните Email и телефон';
  }

  bindSubmit(handler: (email: string, phone: string) => void) {
    this.node.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!this.submit.disabled) {
        handler(this.email.value, this.phone.value);
      }
    });
  }

  render(): HTMLElement {
    this.validate();
    return this.node;
  }
}
