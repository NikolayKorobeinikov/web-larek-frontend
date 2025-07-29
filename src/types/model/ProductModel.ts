import { IProduct } from '../../types/model/Product';

export class ProductModel {
  private products: IProduct[] = [];

  setProducts(products: IProduct[]) {
    this.products = products;
  }

  getAll(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }
}
