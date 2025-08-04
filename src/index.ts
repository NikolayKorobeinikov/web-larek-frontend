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

function setScreen(screen: string) {
  document.body.setAttribute('data-screen', screen);
}

function updateCartCounter() {
  const count = cart.count();
  cartCounter.render(count);
}

function renderCatalog(productList: IProduct[]) {
  setScreen('catalog');
  listView.render(productList);
  updateCartCounter();
}

function openProductPreview(id: string) {
  const product = products.getById(id);
  if (!product) return;

  setScreen('product');

  const inCart = !!cart.list()[id];

  const node = previewView.render(product, inCart, () => {
    if (inCart) {
      events.emit('cart:remove', { id });
    } else {
      events.emit('cart:add', { id });
    }
    modal.close();
  });

  modal.open(node);
}

function openOrderStep1() {
  setScreen('order');

  const node = orderStep1View.render();

  orderStep1View.bindSubmit((payment, address) => {
    order.set('payment', payment);
    order.set('address', address);
    events.emit('contacts:open');
  });

  modal.open(node);
}

function openOrderStep2() {
  setScreen('contacts');

  const node = orderStep2View.render();

  orderStep2View.bindSubmit(async (email, phone) => {
    order.set('email', email);
    order.set('phone', phone);

    try {
      await api.submitOrder(order.get());
      cart.clear();
      order.reset();
      updateCartCounter();
      events.emit('order:success');
    } catch {
      const error = node.querySelector('.form__errors');
      if (error) {
        error.textContent = 'Ошибка оплаты. Попробуйте позже.';
      }
    }
  });

  modal.open(node);
}

function openSuccess() {
  setScreen('success');
  const node = successView.render();
  successView.bindClose(() => modal.close());
  modal.open(node);
}

function showError(message: string) {
  setScreen('error');
  const div = document.createElement('div');
  div.className = 'modal__error';
  div.textContent = message;
  modal.open(div);
}

function showLoading(element: HTMLElement | null, message = 'Загрузка…') {
  if (element) {
    element.textContent = message;
  }
}

const gallery = document.querySelector<HTMLElement>('.gallery');
setScreen('loading');
showLoading(gallery);

api.getProducts()
  .then((response: IProductDto[] | { items: IProductDto[] }) => {
    const list = Array.isArray(response) ? response : response.items;
    const adaptedProducts = list.map(adaptProduct);
    products.setProducts(adaptedProducts);
    events.emit('products:loaded', { products: adaptedProducts });
  })
  .catch(() => {
    showError('Не удалось получить товары. Попробуйте позже.');
  });


events.on('products:loaded', ({ products }: { products: IProduct[] }) => {
  renderCatalog(products);
});


events.on('product:select', ({ id }: { id: string }) => {
  openProductPreview(id);
});


events.on('cart:add', ({ id }: { id: string }) => {
  cart.add(id);
  updateCartCounter();
});


events.on('cart:remove', ({ id }: { id: string }) => {
  cart.remove(id);
  updateCartCounter();
});


events.on('order:open', openOrderStep1);


events.on('contacts:open', openOrderStep2);


events.on('order:success', openSuccess);


events.on('cart:open', () => {
  const cartItems: IProduct[] = Object.keys(cart.list())
    .map(id => products.getById(id))
    .filter((item): item is IProduct => Boolean(item));

  const cartView = new CartView({
    list: cartItems,
    onRemove: (id) => {
      cart.remove(id);
      updateCartCounter();
      events.emit('cart:open');
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
  .addEventListener('click', () => {
    events.emit('cart:open');
  });
