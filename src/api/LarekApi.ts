// import { Api } from '../components/base/api';
// import { IProduct } from '../types/model/Product';
// import { IOrderForm } from '../types/model/OrderForm';

// export class LarekApi {
//   constructor(private api: Api) {}

//   async getProducts(): Promise<IProduct[]> {
//     const res = await this.api.get('/product') as { items: IProduct[] } | IProduct[];
//     return Array.isArray(res) ? res : res.items;
//   }

//   async getProduct(id: string): Promise<IProduct> {
//     return this.api.get(`/product/${id}`) as Promise<IProduct>;
//   }

//   async submitOrder(data: IOrderForm): Promise<void> {
//     await this.api.post('/order', data);
//   }
// }

import { Api } from '../components/base/api';
import { IProduct } from '../types/model/Product';
import { IOrderForm } from '../types/model/OrderForm';
import { IProductDto } from '../types/api/dto/ProductDto';

export class LarekApi {
  constructor(private api: Api) {}

  async getProducts(): Promise<IProductDto[] | { items: IProductDto[] }> {
    return this.api.get('/product') as Promise<IProductDto[] | { items: IProductDto[] }>;
  }

  async getProduct(id: string): Promise<IProductDto> {
    return this.api.get(`/product/${id}`) as Promise<IProductDto>;
  }

  async submitOrder(data: IOrderForm): Promise<void> {
    await this.api.post('/order', data);
  }
}
