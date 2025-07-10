import { IOrderForm } from '../model/OrderForm';

export interface IEventPayload {
  'product:select': { id: string };
  'cart:add': { id: string };
  'cart:remove': { id: string };
  'order:submit': { data: IOrderForm };
  'form:change': { field: string; value: string };
  'app:navigate': { to: 'catalog' | 'cart' | 'order' };
}
