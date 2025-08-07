import { EventEmitter } from '../../components/base/events';
import { IOrderFormErrors } from './OrderFormErrors';

export interface IOrderData {
  payment: 'online' | 'cash' | null;
  address: string;
  email: string;
  phone: string;
}

export class OrderModel {
  private data: IOrderData = {
    payment: null,
    address: '',
    email: '',
    phone: ''
  };

  constructor(private events: EventEmitter) {}

  public get(): IOrderData {
    return { ...this.data };
  }

  public setData<K extends keyof IOrderData>(key: K, value: IOrderData[K]) {
    this.data[key] = value;
    this.validate();
  }

  public reset() {
    this.data = {
      payment: null,
      address: '',
      email: '',
      phone: ''
    };
    this.events.emit('order:changed', this.get());
  }

  private validate() {
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

    if (!this.data.phone || this.data.phone.trim().length < 6) {
      errors.phone = 'Номер телефона слишком короткий';
    }

    this.events.emit('view:errors:update', errors);
  }
}
