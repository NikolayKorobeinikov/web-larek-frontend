import { EventEmitter } from '../base/events';
import { IProduct } from '../../types/model/Product';

export class ProductModel {
  private products: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  setProducts(list: IProduct[]) {
    this.products = list;
    this.events.emit('products:loaded', { products: this.getProducts() });
  }

  getProducts(): IProduct[] {
    return [...this.products];
  }

  getById(id: string): IProduct | undefined {
    return this.products.find(p => p.id === id);
  }
}
