import { EventEmitter } from '../components/base/events';
import { ensureElement } from '../utils/utils';

export class OrderFormView {
  private events: EventEmitter;
  private element: HTMLElement;
  private errorElement: HTMLElement;

  constructor(events: EventEmitter) {
    this.events = events;

    const template = document.getElementById('order') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template #order not found');
    }

    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    this.errorElement = ensureElement<HTMLElement>('.form__errors', this.element);

    this.initEvents();
  }

  private initEvents() {
    const form = this.element as HTMLFormElement;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const payment = formData.get('card') ? 'online' : formData.get('cash') ? 'cash' : null;
      const address = formData.get('address') as string;

      this.events.emit('order:change', { key: 'payment', value: payment });
      this.events.emit('order:change', { key: 'address', value: address });
      this.events.emit('contacts:open');
    });
  }

  public render() {
    return this.element;
  }

  public setErrors(message: string) {
    this.errorElement.textContent = message;
  }
}
