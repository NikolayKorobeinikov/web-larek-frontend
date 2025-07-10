import { IProduct } from './Product';

export interface IAppState {
  products: IProduct[];
  cart: Record<string, number>; 
}
