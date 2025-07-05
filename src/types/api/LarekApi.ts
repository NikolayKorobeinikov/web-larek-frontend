import { IProduct } from '../model/Product';
import { IOrderForm } from '../model/OrderForm';


export interface ILarekApi {
  getProducts(): Promise<IProduct[]>;
  getProduct(id: string): Promise<IProduct>;
  submitOrder(data: IOrderForm): Promise<void>;
}
