import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { Api } from './components/base/api';
import { LarekApi } from './api/LarekApi';
import { API_URL } from './utils/constants';
import { adaptProduct } from './utils/adapters';

import { ProductModel } from './components/models/ProductModel';
import { CartModel } from './components/models/CartModel';
import { OrderModel } from './components/models/OrderModel';

import { ProductListView } from './view/ProductListView';
import { ModalView } from './view/ModalView';
import { CartCounterView } from './view/CartCounterView';
import { ProductPreviewView } from './view/ProductPreviewView';
import { OrderStep1View } from './view/OrderStep1View';
import { OrderStep2View } from './view/OrderStep2View';
import { SuccessView } from './view/SuccessView';
import { CartView } from './view/CartView';

import { IProduct } from './types/model/Product';
import { IProductDto } from './types/api/dto/ProductDto';

const events = new EventEmitter();
const api = new LarekApi(new Api(API_URL));

const products = new ProductModel();
const cart = new CartModel();
const order = new OrderModel();

const listView = new ProductListView(events);
const modal = new ModalView();
const cartCounter = new CartCounterView();
const previewView = new ProductPreviewView();
const orderStep1View = new OrderStep1View();
const orderStep2View = new OrderStep2View();
const successView = new SuccessView();

function setScreen(state: string) {
  document.body.setAttribute('data-screen', state);
}

function updateCartCounter() {
  cartCounter.render(cart.count());
}

function renderCatalog(list: IProduct[]) {
  setScreen('catalog');
  listView.render(list);
  updateCartCounter();
}

function openProductPreview(id: string) {
  const product = products.getById(id);
  if (!product) return;

  setScreen('product');

  const inCart = !!cart.list()[id];
  const node: HTMLElement = previewView.render(product, inCart, () => {
    events.emit(inCart ? 'cart:remove' : 'cart:add', { id });
    modal.close();
  });

  modal.open(node);
}

function openOrderStep1() {
  setScreen('order');

  const node: HTMLElement = orderStep1View.render();
  orderStep1View.bindSubmit((payment, address) => {
    order.set('payment', payment);
    order.set('address', address);
    events.emit('contacts:open');
  });

  modal.open(node);
}

function openOrderStep2() {
  setScreen('contacts');

  const node: HTMLElement = orderStep2View.render();
  orderStep2View.bindSubmit(async (email, phone) => {
    order.set('email', email);
    order.set('phone', phone);
    const data = order.get();

    try {
      await api.submitOrder(data);
      cart.clear();
      order.reset();
      updateCartCounter();
      events.emit('order:success');
    } catch {
      const errorEl = node.querySelector('.form__errors');
      if (errorEl) errorEl.textContent = 'Ошибка оплаты. Попробуйте позже.';
    }
  });

  modal.open(node);
}

function openSuccess() {
  setScreen('success');
  const node: HTMLElement = successView.render();
  successView.bindClose(() => modal.close());
  modal.open(node);
}

function showError(message: string) {
  setScreen('error');
  const div: HTMLElement = document.createElement('div');
  div.className = 'modal__error';
  div.textContent = message;
  modal.open(div);
}

function showLoading(el: HTMLElement | null, text = 'Загрузка…') {
  if (el) el.textContent = text;
}

const gallery = document.querySelector<HTMLElement>('.gallery');
setScreen('loading');
showLoading(gallery);

api.getProducts()
  .then((res: IProductDto[] | { items: IProductDto[] }) => {
    const list = Array.isArray(res) ? res : res.items;
    const adapted = list.map(adaptProduct);
    products.setProducts(adapted);
    events.emit('products:loaded', { products: adapted });
  })
  .catch(() => showError('Не удалось получить товары. Попробуйте позже.'));

events.on('products:loaded', ({ products }: { products: IProduct[] }) => {
  renderCatalog(products);
});

events.on('product:select', ({ id }: { id: string }) => openProductPreview(id));
events.on('cart:add', ({ id }: { id: string }) => { cart.add(id); updateCartCounter(); });
events.on('cart:remove', ({ id }: { id: string }) => { cart.remove(id); updateCartCounter(); });
events.on('order:open', openOrderStep1);
events.on('contacts:open', openOrderStep2);
events.on('order:success', openSuccess);

// Обработка открытия корзины
events.on('cart:open', () => {
  const cartItems: IProduct[] = Object.keys(cart.list())
    .map(id => products.getById(id))
    .filter((item): item is IProduct => Boolean(item));

  const cartView = new CartView({
    list: cartItems,
    onRemove: (id) => {
      cart.remove(id);
      updateCartCounter();
      events.emit('cart:open'); // перерисовываем
    },
    onSubmit: () => {
      modal.close();
      events.emit('order:open');
    },
  });

  setScreen('cart');
  modal.open(cartView.render());
});

document.querySelector<HTMLButtonElement>('.header__basket')!
  .addEventListener('click', () => events.emit('cart:open'));
