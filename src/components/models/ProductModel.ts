import { IProduct } from '../../types/model/Product';

export class ProductModel {
  private products: IProduct[] = [];

  setProducts(list: IProduct[]) {
    this.products = list;
  }

  getAll() {
    return this.products;
  }

  getById(id: string) {
    return this.products.find(p => p.id === id);
  }
}