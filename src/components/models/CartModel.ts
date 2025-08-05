// components/models/CartModel.ts
import { EventEmitter } from '../base/events';
import { IProduct } from '../../types/model/Product';

export class CartModel {
  private items: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  getItems(): IProduct[] {
    return [...this.items];
  }

  has(id: string): boolean {
    return this.items.some(p => p.id === id);
  }

  add(product: IProduct) {
    if (!this.has(product.id)) {
      this.items.push(product);
      this.events.emit('cart:changed', { items: this.getItems() });
    }
  }

  remove(id: string) {
    this.items = this.items.filter(p => p.id !== id);
    this.events.emit('cart:changed', { items: this.getItems() });
  }

  clear() {
    this.items = [];
    this.events.emit('cart:changed', { items: this.getItems() });
  }
}
