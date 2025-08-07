export interface IOrderData {
  payment: 'online' | 'cash' | null;
  address: string;
  email: string;
  phone: string;
}