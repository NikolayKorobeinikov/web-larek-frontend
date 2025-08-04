import { cloneTemplate } from '../utils/utils';

export class OrderStep1View {
  private node: HTMLElement;
  private payBtns: NodeListOf<HTMLButtonElement>;
  private addressInput: HTMLInputElement;
  private errors: HTMLElement;
  private submit: HTMLButtonElement;
  private selected: 'online' | 'cash' | null = null;

  constructor() {
    this.node = cloneTemplate('#order');
    this.payBtns = this.node.querySelectorAll('.order__buttons .button');
    this.addressInput = this.node.querySelector('input[name="address"]')!;
    this.errors = this.node.querySelector('.form__errors')!;
    this.submit = this.node.querySelector('.order__button')!;

    this.payBtns.forEach((b) => {
      b.addEventListener('click', () => this.selectPayment(b));
    });

    this.addressInput.addEventListener('input', () => this.validate());
  }

  private selectPayment(button: HTMLButtonElement) {
    const map: Record<string, 'online' | 'cash'> = { card: 'online', cash: 'cash' };
    this.selected = map[button.name];

    this.payBtns.forEach(btn => btn.classList.toggle('button_alt', btn !== button));
    this.validate();
  }

  private validate() {
    const ok = this.selected && this.addressInput.value.trim().length > 3;
    this.submit.disabled = !ok;
    this.errors.textContent = ok ? '' : 'Выберите способ оплаты и укажите адрес';
  }

  bindSubmit(handler: (payment: 'online' | 'cash', address: string) => void) {
    this.node.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!this.submit.disabled && this.selected) {
        handler(this.selected, this.addressInput.value);
      }
    });
  }

  render(): HTMLElement {
    this.validate();
    return this.node;
  }
}
