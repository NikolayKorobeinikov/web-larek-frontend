
import { IBasketItem } from '../types/model/Basket';

export class CartView {
  render(items: IBasketItem[]) {
    // отрисовка корзины
  }

  remove(handler: (id: string) => void) {
    // удаление
  }

  submit(handler: () => void) {
    // оформление заказа
  }
}
