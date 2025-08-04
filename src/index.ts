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
import { ProductPreviewView } from './view/ProductPreviewView';
import { CartView } from './view/CartView';
import { ModalView } from './view/ModalView';
import { CartCounterView } from './view/CartCounterView';
import { OrderStep1View } from './view/OrderStep1View';
import { OrderStep2View } from './view/OrderStep2View';
import { SuccessView } from './view/SuccessView';
import { ScreenView } from './view/ScreenView';

import { IProductDto } from './types/api/dto/ProductDto';
import { IProduct } from './types/model/Product';

const events = new EventEmitter();
const api = new LarekApi(new Api(API_URL));

const products = new ProductModel();
const cart = new CartModel();
const order = new OrderModel();

const screen = new ScreenView();
const modal = new ModalView();
const productListView = new ProductListView(events);
const productPreviewView = new ProductPreviewView();
const cartCounterView = new CartCounterView();
const orderStep1View = new OrderStep1View();
const orderStep2View = new OrderStep2View();
const successView = new SuccessView();

function updateCartCounter() {
  const count = cart.count();
  cartCounterView.render(count);
}

screen.set('loading');

const gallery = document.querySelector<HTMLElement>('.gallery');
if (gallery) {
  gallery.textContent = 'Загрузка…';
}

api.getProducts()
  .then((response: IProductDto[] | { items: IProductDto[] }) => {
    const list = Array.isArray(response) ? response : response.items;
    const adapted = list.map(adaptProduct);
    products.setProducts(adapted);
    events.emit('products:loaded', { products: adapted });
  })
  .catch(() => {
    screen.set('error');
    const errorNode = document.createElement('div');
    errorNode.className = 'modal__error';
    errorNode.textContent = 'Не удалось получить товары. Попробуйте позже.';
    modal.open(errorNode);
  });

events.on('products:loaded', ({ products }: { products: IProduct[] }) => {
  screen.set('catalog');
  productListView.render(products);
  updateCartCounter();
});

events.on('product:select', ({ id }: { id: string }) => {
  const product = products.getById(id);
  if (!product) return;

  screen.set('product');

  const inCart = !!cart.list()[id];

  const node = productPreviewView.render(product, inCart, () => {
    if (inCart) {
      events.emit('cart:remove', { id });
    } else {
      events.emit('cart:add', { id });
    }
    modal.close();
  });

  modal.open(node);
});

events.on('cart:add', ({ id }: { id: string }) => {
  cart.add(id);
  updateCartCounter();
});

events.on('cart:remove', ({ id }: { id: string }) => {
  cart.remove(id);
  updateCartCounter();
});

events.on('cart:open', () => {
  const items = Object.keys(cart.list())
    .map((id) => products.getById(id))
    .filter((item): item is IProduct => Boolean(item));

  const cartView = new CartView({
    list: items,
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

  screen.set('cart');
  modal.open(cartView.render());
});

events.on('order:open', () => {
  screen.set('order');
  const node = orderStep1View.render();

  orderStep1View.bindSubmit((payment, address) => {
    order.set('payment', payment);
    order.set('address', address);
    events.emit('contacts:open');
  });

  modal.open(node);
});

events.on('contacts:open', () => {
  screen.set('contacts');
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
});

events.on('order:success', () => {
  screen.set('success');
  const node = successView.render();

  successView.bindClose(() => {
    modal.close();
  });

  modal.open(node);
});

document.querySelector<HTMLButtonElement>('.header__basket')!
  .addEventListener('click', () => {
    events.emit('cart:open');
  });
