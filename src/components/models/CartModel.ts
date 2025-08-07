import { IProduct } from '../../types/model/Product';
import { EventEmitter } from '../base/events';

export class CartModel {
  private items: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  public add(product: IProduct): void {
    this.items.push(product);
    this.emitChange();
  }

  public remove(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.emitChange();
  }

  public getItems(): IProduct[] {
    return [...this.items];
  }

  public has(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }

  public clear(): void {
    this.items = [];
    this.emitChange();
  }

  public getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  private emitChange(): void {
    this.events.emit('cart:changed', {
      items: this.getItems(),
      total: this.getTotal()
    });
  }
}
