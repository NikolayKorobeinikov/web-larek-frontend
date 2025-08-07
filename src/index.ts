import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { Api } from './components/base/api';
import { LarekApi } from './api/LarekApi';
import { API_URL } from './utils/constants';
import { adaptProduct } from './utils/adapters';

import { ProductModel } from './components/models/ProductModel';
import { CartModel } from './components/models/CartModel';
import { OrderModel } from './types/model/OrderModel';

import { ProductListView } from './view/ProductListView';
import { ProductCardView } from './view/ProductCardView';
import { ProductPreviewView } from './view/ProductPreviewView';
import { CartItemView } from './view/CartItemView';
import { CartView } from './view/CartView';
import { CartCounterView } from './view/CartCounterView';
import { OrderStep1View } from './view/OrderStep1View';
import { OrderStep2View } from './view/OrderStep2View';
import { SuccessView } from './view/SuccessView';
import { ScreenView } from './view/ScreenView';
import { HeaderView } from './view/HeaderView';
import { ModalView } from './view/ModalView';

import { IProductDto } from './types/api/dto/ProductDto';
import { IProduct } from './types/model/Product';
import { IOrderData } from './types/model/IOrderData';
import { IOrderFormErrors } from './types/model/IOrderFormErrors';

const events = new EventEmitter();
const api = new LarekApi(new Api(API_URL));

const productModel = new ProductModel(events);
const cartModel = new CartModel(events);
const orderModel = new OrderModel(events);

const screenView = new ScreenView();
const modalView = new ModalView();
new HeaderView(events);

const productListView = new ProductListView(events);
const productPreviewView = new ProductPreviewView();
const cartCounterView = new CartCounterView();
const cartView = new CartView(events);
const orderStep1View = new OrderStep1View(events);
const orderStep2View = new OrderStep2View(events);
const successView = new SuccessView();

screenView.set('loading');

api.getProducts()
  .then((res: IProductDto[] | { items: IProductDto[] }) => {
    const list = Array.isArray(res) ? res : res.items;
    productModel.setProducts(list.map(adaptProduct));
  })
  .catch(() => {
    events.emit('error:show', { message: 'Не удалось получить товары. Попробуйте позже.' });
  });

events.on('products:loaded', (data: { products: IProduct[] }) => {
  screenView.set('catalog');
  const cards = data.products.map((product: IProduct) =>
    new ProductCardView(product, events).render()
  );
  productListView.render(cards);
});

events.on('product:select', (data: { id: string }) => {
  const product = productModel.getById(data.id);
  if (!product) return;

  const inCart = cartModel.has(data.id);
  const previewNode = productPreviewView.render(product, inCart, () => {
    events.emit(inCart ? 'cart:remove' : 'cart:add', { id: data.id });
    modalView.close();
  });

  modalView.open(previewNode);
  screenView.set('product');
});

events.on('cart:add', (data: { id: string }) => {
  const product = productModel.getById(data.id);
  if (product) cartModel.add(product);
});

events.on('cart:remove', (data: { id: string }) => {
  cartModel.remove(data.id);
});

events.on('cart:changed', (data: { items: IProduct[], total: number }) => {
  cartCounterView.render(data.items.length);

  const itemViews = data.items.map((product, index) =>
    new CartItemView(product, index + 1, events).render()
  );

  cartView.setItems(itemViews, data.total);
});

events.on('cart:open', () => {
  screenView.set('cart');
  modalView.open(cartView.render());
});

events.on('order:open', () => {
  if (cartModel.getItems().length === 0) {
    events.emit('error:show', { message: 'Ваша корзина пуста' });
    return;
  }

  screenView.set('order');
  modalView.open(orderStep1View.render());
});

events.on('contacts:open', () => {
  screenView.set('contacts');
  modalView.open(orderStep2View.render());
});

events.on('order:change', (data: { key: keyof IOrderData, value: string }) => {
  orderModel.setData(data.key, data.value);
});

events.on('view:errors:update', (errors: Partial<IOrderFormErrors>) => {
  orderStep1View.setErrors({
    payment: errors.payment,
    address: errors.address,
  });
  orderStep1View.setSubmitState(!errors.payment && !errors.address);

  orderStep2View.setErrors({
    email: errors.email,
    phone: errors.phone,
  });
  orderStep2View.setSubmitState(!errors.email && !errors.phone);
});

events.on('order:submit', async () => {
  const data = orderModel.get();

  if (!data.payment || !data.address || !data.email || !data.phone) {
    events.emit('error:show', { message: 'Заполните все поля' });
    return;
  }

  try {
    const fullData = {
      ...data,
      total: cartModel.getTotal(),
      items: cartModel.getItems().map(item => item.id)
    };

    const response = await api.submitOrder(fullData);
    const total = response.total ?? cartModel.getTotal();

    cartModel.clear();
    orderModel.reset();

    events.emit('order:success', { total });
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
    events.emit('error:show', { message: 'Ошибка оплаты' });
  }
});

events.on('order:success', (data: { total: number }) => {
  screenView.set('success');
  modalView.open(successView.render(data.total));
  successView.onClose(() => {
    modalView.close();
    screenView.set('catalog');
  });
});

events.on('error:show', (data: { message: string }) => {
  screenView.set('error');
  modalView.open(successView.renderError(data.message));
});
