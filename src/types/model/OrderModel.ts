import { EventEmitter } from '../../components/base/events';
import { IOrderData } from './IOrderData';
import { IOrderFormErrors } from './IOrderFormErrors';

export class OrderModel {
  private data: IOrderData = {
    payment: null,
    address: '',
    email: '',
    phone: '',
  };

  constructor(private events: EventEmitter) {}

  public setData(key: keyof IOrderData, value: string): void {
    if (key === 'payment') {
      // Приводим к правильному типу
      if (value === 'online' || value === 'cash') {
        this.data.payment = value;
      } else {
        console.warn('Некорректное значение оплаты:', value);
        return;
      }
    } else {
      this.data[key] = value;
    }

    this.validate();
  }

  public get(): IOrderData {
    return { ...this.data };
  }

  public reset(): void {
    this.data = {
      payment: null,
      address: '',
      email: '',
      phone: '',
    };
    this.validate();
  }

  private validate(): void {
    const errors: Partial<IOrderFormErrors> = {};

    if (!this.data.payment) {
      errors.payment = 'Выберите способ оплаты';
    }

    if (!this.data.address || this.data.address.trim().length < 4) {
      errors.address = 'Адрес должен быть не короче 4 символов';
    }

    if (!/\S+@\S+\.\S+/.test(this.data.email)) {
      errors.email = 'Введите корректный email';
    }

    if (!/^\+?\d{6,}$/.test(this.data.phone)) {
      errors.phone = 'Номер телефона слишком короткий';
    }

    this.events.emit('view:errors:update', errors);
  }
}
