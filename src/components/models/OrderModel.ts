import { EventEmitter } from '../base/events';

export type PaymentType = 'online' | 'cash' | null;

export interface IOrderForm {
  payment: PaymentType;
  address: string;
  email: string;
  phone: string;
}

export class OrderModel {
  private data: IOrderForm;
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
    this.data = {
      payment: null,
      address: '',
      email: '',
      phone: ''
    };
  }

  set(key: 'payment' | 'address' | 'email' | 'phone', value: any) {
    if (key === 'payment' && value !== 'online' && value !== 'cash' && value !== null) {
      console.warn(`Неверный способ оплаты: ${value}`);
      return;
    }

    (this.data as any)[key] = value;

    this.events.emit('order:change', { key, value });
  }

  get(): IOrderForm {
    return { ...this.data };
  }

  reset() {
    this.data = {
      payment: null,
      address: '',
      email: '',
      phone: ''
    };
  }
}
