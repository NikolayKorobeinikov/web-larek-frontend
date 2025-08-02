export interface IOrderForm {
  payment: 'online' | 'cash';
  address: string;
  email: string;
  phone: string;
}