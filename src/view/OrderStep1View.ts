import { cloneTemplate } from '../utils/utils';
import { IOrderFormErrors } from '../types/model/OrderFormErrors';
import { EventEmitter } from '../components/base/events';

export class OrderStep1View {
  private node: HTMLElement;
  private payBtns: NodeListOf<HTMLButtonElement>;
  private addressInput: HTMLInputElement;
  private errors: HTMLElement;
  private submit: HTMLButtonElement;

  constructor(private events: EventEmitter) {
    this.node = cloneTemplate('#order');
    this.payBtns = this.node.querySelectorAll('.order__buttons .button');
    this.addressInput = this.node.querySelector('input[name="address"]')!;
    this.errors = this.node.querySelector('.form__errors')!;
    this.submit = this.node.querySelector('.order__button')!;

    this.payBtns.forEach((b) => {
      b.addEventListener('click', () => {
        const map: Record<string, 'online' | 'cash'> = { card: 'online', cash: 'cash' };
        const payment = map[b.name];
        this.events.emit('order:change', { key: 'payment', value: payment });
        this.highlightPayment(payment);
      });
    });

    this.addressInput.addEventListener('input', () => {
      this.events.emit('order:change', {
        key: 'address',
        value: this.addressInput.value
      });
    });

    this.node.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('contacts:open');
    });
  }

  public highlightPayment(method: 'online' | 'cash') {
    this.payBtns.forEach((btn) => {
      btn.classList.toggle('button_alt-active', btn.name === (method === 'online' ? 'card' : 'cash'));
    });
  }

  public setErrors(errors: Partial<IOrderFormErrors>) {
    const messages = Object.values(errors).filter(Boolean).join('; ');
    this.errors.textContent = messages;
  }

  public setSubmitState(isValid: boolean) {
    this.submit.disabled = !isValid;
  }

  public render(): HTMLElement {
    return this.node;
  }
}
