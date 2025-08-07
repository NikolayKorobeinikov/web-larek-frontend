import { EventEmitter } from '../../components/base/events';
import { IOrderData } from './IOrderData';
import { IOrderFormErrors } from './IOrderFormErrors';

export class OrderModel {
  private data: IOrderData;
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
    this.data = {
      payment: null,
      address: '',
      email: '',
      phone: '',
    };
  }

  public setData(key: keyof IOrderData, value: string): void {
    if (key === 'payment') {
      if (value === 'online' || value === 'cash') {
        this.data.payment = value;
      } else {
        return;
      }
    } else {
      this.data[key] = value;
    }

    let step: 1 | 2;
    if (key === 'email' || key === 'phone') {
      step = 2;
    } else {
      step = 1;
    }

    this.validate(step);
  }

  public get(): IOrderData {
    return {
      payment: this.data.payment,
      address: this.data.address,
      email: this.data.email,
      phone: this.data.phone,
    };
  }

  public reset(): void {
    this.data.payment = null;
    this.data.address = '';
    this.data.email = '';
    this.data.phone = '';

    this.validate(); 
  }

  private validate(step?: 1 | 2): void {
    const errors: Partial<IOrderFormErrors> = {};

    if (!step || step === 1) {
      if (!this.data.payment || (this.data.payment !== 'online' && this.data.payment !== 'cash')) {
        errors.payment = 'Выберите способ оплаты';
      }

      if (!this.data.address || this.data.address.trim().length < 4) {
        errors.address = 'Адрес должен быть не короче 4 символов';
      }
    }

    if (!step || step === 2) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(this.data.email)) {
        errors.email = 'Введите корректный email';
      }

      const phoneRegex = /^\+?\d{6,}$/;
      if (!phoneRegex.test(this.data.phone)) {
        errors.phone = 'Номер телефона слишком короткий';
      }
    }

    this.events.emit('view:errors:update', errors);
  }
}
