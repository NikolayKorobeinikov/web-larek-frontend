
import { IOrderForm } from '../types/model/OrderForm';

export class OrderFormView {
  render() {
    // отрисовка формы
  }

  bindSubmit(handler: (data: IOrderForm) => void) {
    // подписка на submit
  }

  getFormData(): IOrderForm {
    // получить данные формы
    return { name: '', phone: '', address: '' };
  }
}
