import { IOrderForm } from '../../types/model/OrderForm';

export class OrderModel {
  private data: Partial<IOrderForm> = {};

  set<K extends keyof IOrderForm>(key: K, value: IOrderForm[K]) {
    this.data[key] = value;
  }

  get(): Readonly<IOrderForm> {
    return this.data as IOrderForm;
  }

  reset() {
    this.data = {};
  }
}
