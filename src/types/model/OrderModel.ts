import { IOrderForm } from '../../types/model/OrderForm';

export class OrderModel {
  private formData: IOrderForm;

  constructor() {
    this.formData = { name: '', phone: '', address: '' };
  }

  setFormData(data: IOrderForm) {
    this.formData = data;
  }

  getFormData(): IOrderForm {
    return this.formData;
  }

  // submit() {
    
  // }
}
