import { IOrderForm } from '../model/OrderForm';
import { IProduct } from '../model/Product';

export interface IEventPayload {
  'products:loaded': { products: IProduct[] };
  'product:select': { id: string };
  'cart:add': { id: string };
  'cart:remove': { id: string };
  'cart:open': undefined;
  'order:open': undefined;
  'contacts:open': undefined;
  'order:submit': { data: IOrderForm };
  'order:success': undefined;
}
