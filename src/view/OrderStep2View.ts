import { cloneTemplate } from '../utils/utils';
import { EventEmitter } from '../components/base/events';
import { IOrderFormErrors } from '../types/model/IOrderFormErrors';

export class OrderStep2View {
  private node: HTMLElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submit: HTMLButtonElement;
  private errors: HTMLElement;

  constructor(private events: EventEmitter) {
    this.node = cloneTemplate('#contacts');
    this.emailInput = this.node.querySelector('input[name="email"]')!;
    this.phoneInput = this.node.querySelector('input[name="phone"]')!;
    this.submit = this.node.querySelector('button[type="submit"]')!;
    this.errors = this.node.querySelector('.form__errors')!;

    this.emailInput.addEventListener('input', () => {
      this.events.emit('order:change', {
        key: 'email',
        value: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener('input', () => {
      this.events.emit('order:change', {
        key: 'phone',
        value: this.phoneInput.value,
      });
    });

    this.node.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order:submit');
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
