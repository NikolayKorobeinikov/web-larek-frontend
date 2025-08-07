import { EventEmitter } from '../components/base/events';
import { ensureElement } from '../utils/utils';
import { IOrderFormErrors } from '../types/model/OrderFormErrors';

export class OrderView {
  private element: HTMLElement;
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private inputs: NodeListOf<HTMLInputElement>;
  private errorContainer: HTMLElement;

  constructor(private events: EventEmitter) {
    const template = document.getElementById('order') as HTMLTemplateElement;
    if (!template) throw new Error('Template #order not found');

    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    this.paymentButtons = this.element.querySelectorAll('[name="card"], [name="cash"]');
    this.inputs = this.element.querySelectorAll('input[name="address"], input[name="email"], input[name="phone"]');
    this.errorContainer = ensureElement<HTMLElement>('.form__errors', this.element);

    this.setupListeners();
  }

  private setupListeners() {
    this.paymentButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const payment = btn.name === 'card' ? 'online' : 'cash';
        this.events.emit('order:change', { key: 'payment', value: payment });
        this.highlightPayment(payment);
      });
    });

    this.inputs.forEach((input) => {
      input.addEventListener('input', () => {
        this.events.emit('order:change', { key: input.name, value: input.value });
      });
    });

    const nextButton = this.element.querySelector('.order__button') as HTMLButtonElement;
    nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('contacts:open');
    });
  }

  private highlightPayment(selected: string) {
    this.paymentButtons.forEach((btn) => {
      btn.classList.toggle('button_alt-active', (btn.name === 'card' && selected === 'online') || (btn.name === 'cash' && selected === 'cash'));
    });
  }

  public setErrors(errors: Partial<IOrderFormErrors>) {
    const messages = Object.values(errors).filter(Boolean).join(', ');
    this.errorContainer.textContent = messages;
  }

  public render(): HTMLElement {
    return this.element;
  }
}
