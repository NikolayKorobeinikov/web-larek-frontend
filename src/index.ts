// src/index.ts

import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { Api } from './components/base/api';
import { LarekApi } from './api/LarekApi';
import { API_URL } from './utils/constants';
import { adaptProduct } from './utils/adapters';

import { ProductModel } from './types/model/ProductModel';
import { CartModel } from './types/model/CartModel';
import { OrderModel } from './types/model/OrderModel';

import { ProductListView } from './view/ProductListView';
import { ModalView } from './view/ModalView';
import { CartCounterView } from './view/CartCounterView';

import { IProduct } from './types/model/Product';
import { IOrderForm } from './types/model/OrderForm';
import { IProductDto } from './types/api/dto/ProductDto';

// ------- Вспомогательные функции -------
const priceStr = (n: number) => n.toLocaleString('ru-RU');
const clone = (id: string) => {
  const t = document.getElementById(id) as HTMLTemplateElement | null;
  if (!t) throw new Error(`Template #${id} not found`);
  return t.content.firstElementChild!.cloneNode(true) as HTMLElement;
};

// ------- Инстансы -------
const events = new EventEmitter();
const api = new LarekApi(new Api(API_URL));
const products = new ProductModel();
const cart = new CartModel();
const order = new OrderModel();

const listView = new ProductListView(events);
const modal = new ModalView();
const cartCounter = new CartCounterView();

// утилита обновления UI-счётчика корзины
const updateCartCounter = () => cartCounter.render(cart.count());

// ------- Загрузка начальных данных и заполнение модели -------
const gallery = document.querySelector('.gallery') as HTMLElement | null;
if (gallery) gallery.textContent = 'Загрузка…';

api.getProducts()
  .then((res: IProductDto[] | { items: IProductDto[] }) => {
    const list = Array.isArray(res) ? res : res.items;
    const adapted = list.map(adaptProduct); // IProduct[]
    products.setProducts(adapted);
    events.emit('products:loaded', { products: adapted as IProduct[] });
  })
  .catch(() => {
    const div = document.createElement('div');
    div.className = 'modal__error';
    div.textContent = 'Не удалось получить товары. Попробуйте позже.';
    modal.open(div);
  });

// ------- Подписки UI -------

// Рендер каталога
events.on('products:loaded', ({ products: arr }: { products: IProduct[] }) => {
  if (gallery) gallery.textContent = '';
  listView.render(arr);
  updateCartCounter();
});

// Открытие превью карточки
events.on('product:select', ({ id }: { id: string }) => {
  const p = products.getById(id);
  if (!p) return;

  const node = clone('card-preview');

  (node.querySelector('.card__title') as HTMLElement).textContent = p.title;
  (node.querySelector('.card__price') as HTMLElement).textContent = `${priceStr(p.price)} синапсов`;

  const img = node.querySelector('.card__image') as HTMLImageElement | null;
  if (img) {
    img.src = p.image;
    img.alt = p.title;
  }

  const inCart = !!cart.list()[id];
  const btn = node.querySelector<HTMLButtonElement>('.card__button')!;
  btn.textContent = inCart ? 'Убрать' : 'В корзину';
  btn.onclick = () => events.emit(inCart ? 'cart:remove' : 'cart:add', { id });

  modal.open(node);
});

// Добавление/удаление из корзины
events.on('cart:add', ({ id }: { id: string }) => {
  cart.add(id);
  updateCartCounter();
});

events.on('cart:remove', ({ id }: { id: string }) => {
  cart.remove(id);
  updateCartCounter();
});

// Просмотр корзины
events.on('cart:open', () => {
  const node = clone('basket');
  const list = node.querySelector('.basket__list') as HTMLElement;
  const totalEl = node.querySelector('.basket__price') as HTMLElement;
  const goBtn = node.querySelector<HTMLButtonElement>('.basket__button')!;

  list.replaceChildren();
  const items = cart.list();

  let idx = 1;
  let total = 0;

  Object.entries(items).forEach(([id, qty]) => {
    const p = products.getById(id);
    if (!p) return;

    const row = clone('card-basket');
    (row.querySelector('.basket__item-index') as HTMLElement).textContent = String(idx++);
    (row.querySelector('.card__title') as HTMLElement).textContent = p.title + (qty > 1 ? ` ×${qty}` : '');
    (row.querySelector('.card__price') as HTMLElement).textContent = `${priceStr(p.price * qty)} синапсов`;

    row.querySelector<HTMLButtonElement>('.basket__item-delete')!
      .addEventListener('click', () => events.emit('cart:remove', { id }));

    list.append(row);
    total += p.price * qty;
  });

  totalEl.textContent = `${priceStr(total)} синапсов`;
  goBtn.addEventListener('click', () => events.emit('order:open'));

  modal.open(node);
});

// Шаг 1: окно «Способ оплаты + адрес»
events.on('order:open', () => {
  const node = clone('order');
  const submit = node.querySelector<HTMLButtonElement>('.order__button')!;
  const errors = node.querySelector<HTMLElement>('.form__errors')!;
  const address = node.querySelector<HTMLInputElement>('input[name="address"]')!;
  const payBtns = node.querySelectorAll<HTMLButtonElement>('.order__buttons .button');

  let payment: 'online' | 'cash' | null = null;

  const validate = () => {
    const ok = !!payment && address.value.trim().length > 3;
    submit.disabled = !ok;
    errors.textContent = ok ? '' : 'Выберите способ оплаты и укажите адрес';
  };

  payBtns.forEach((b) => {
    b.addEventListener('click', () => {
      // ВАЖНО: сопоставляем name из шаблона к ожидаемому типу
      const map: Record<string, 'online' | 'cash'> = { card: 'online', cash: 'cash' };
      payment = map[b.name] ?? null;

      payBtns.forEach(x => x.classList.toggle('button_alt', x !== b));
      validate();
    });
  });

  address.addEventListener('input', validate);

  node.addEventListener('submit', (e) => {
    e.preventDefault();
    if (submit.disabled) return;
    order.set('payment', payment as 'online' | 'cash');
    order.set('address', address.value);
    events.emit('contacts:open');
  });

  validate();
  modal.open(node);
});

// Шаг 2: окно «Контакты + отправка»
events.on('contacts:open', () => {
  const node = clone('contacts');
  const email = node.querySelector<HTMLInputElement>('input[name="email"]')!;
  const phone = node.querySelector<HTMLInputElement>('input[name="phone"]')!;
  const submit = node.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const errors = node.querySelector<HTMLElement>('.form__errors')!;

  const validate = () => {
    const ok = /\S+@\S+\.\S+/.test(email.value) && phone.value.trim().length >= 6;
    submit.disabled = !ok;
    errors.textContent = ok ? '' : 'Заполните Email и телефон';
  };

  email.addEventListener('input', validate);
  phone.addEventListener('input', validate);

  let isSubmitting = false;

  node.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submit.disabled || isSubmitting) return;

    isSubmitting = true;
    submit.disabled = true;

    order.set('email', email.value);
    order.set('phone', phone.value);

    const data = order.get() as IOrderForm;

    try {
      await api.submitOrder(data);
      cart.clear();
      order.reset();
      updateCartCounter();
      events.emit('order:success');
    } catch {
      errors.textContent = 'Ошибка оплаты. Попробуйте позже.';
    } finally {
      isSubmitting = false;
      submit.disabled = false;
    }
  });

  validate();
  modal.open(node);
});

// Шаг 3: успех
events.on('order:success', () => {
  const node = clone('success');
  node.querySelector<HTMLButtonElement>('.order-success__close')!
    .addEventListener('click', () => modal.close());
  modal.open(node);
});

// Кнопка корзины в шапке
document.querySelector<HTMLButtonElement>('.header__basket')!
  .addEventListener('click', () => events.emit('cart:open'));
