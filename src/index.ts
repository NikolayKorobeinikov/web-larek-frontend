// import './scss/styles.scss';
// import { EventEmitter } from './components/base/events';
// import { Api } from './components/base/api';
// import { LarekApi } from './api/LarekApi';
// import { API_URL } from './utils/constants';
// import { adaptProduct } from './utils/adapters';

// import { ProductModel } from './components/models/ProductModel';
// import { CartModel } from './components/models/CartModel';
// import { OrderModel } from './types/model/OrderModel';

// import { ProductListView } from './view/ProductListView';
// import { ProductCardView } from './view/ProductCardView';
// import { ProductPreviewView } from './view/ProductPreviewView';
// import { CartView } from './view/CartView';
// import { CartCounterView } from './view/CartCounterView';
// import { OrderFormView } from './view/OrderFormView';
// import { OrderStep2View } from './view/OrderStep2View';
// import { SuccessView } from './view/SuccessView';
// import { ScreenView } from './view/ScreenView';
// import { HeaderView } from './view/HeaderView';
// import { ModalView } from './view/ModalView';

// import { IProductDto } from './types/api/dto/ProductDto';
// import { IProduct } from './types/model/Product';

// const events = new EventEmitter();
// const api = new LarekApi(new Api(API_URL));

// const productModel = new ProductModel(events);
// const cartModel = new CartModel(events);
// const orderModel = new OrderModel(events);

// const screenView = new ScreenView();
// const modalView = new ModalView();
// new HeaderView(events);
// const productListView = new ProductListView(events);
// const productPreviewView = new ProductPreviewView();
// const cartCounterView = new CartCounterView();
// const cartView = new CartView(events);
// const orderFormView = new OrderFormView(events);
// const orderStep2View = new OrderStep2View();
// const successView = new SuccessView();

// screenView.set('loading');

// api.getProducts()
// 	.then((res: IProductDto[] | { items: IProductDto[] }) => {
// 		const list = Array.isArray(res) ? res : res.items;
// 		productModel.setProducts(list.map(adaptProduct));
// 	})
// 	.catch(() => {
// 		events.emit('error:show', { message: 'Не удалось получить товары. Попробуйте позже.' });
// 	});

// events.on('products:loaded', ({ products }: { products: IProduct[] }) => {
// 	screenView.set('catalog');
// 	const cards = products.map(p => new ProductCardView(p, events).render());
// 	productListView.render(cards);
// });

// events.on('product:select', ({ id }: { id: string }) => {
// 	const product = productModel.getById(id);
// 	if (!product) return;

// 	const inCart = cartModel.has(id);
// 	const previewNode = productPreviewView.render(product, inCart, () => {
// 		events.emit(inCart ? 'cart:remove' : 'cart:add', { id });
// 		modalView.close();
// 	});

// 	modalView.open(previewNode);
// 	screenView.set('product');
// 	window.scrollTo({ top: 0 });
// });

// events.on('cart:add', ({ id }: { id: string }) => {
// 	const product = productModel.getById(id);
// 	if (product) cartModel.add(product);
// });

// events.on('cart:remove', ({ id }: { id: string }) => {
// 	cartModel.remove(id);
// });

// events.on('cart:changed', ({ items }: { items: IProduct[] }) => {
// 	cartCounterView.render(items.length);
// 	cartView.setItems(items);
// });

// events.on('cart:open', () => {
// 	screenView.set('cart');
// 	modalView.open(cartView.render());
// 	window.scrollTo({ top: 0 });
// });

// events.on('order:open', () => {
// 	if (cartModel.getItems().length === 0) {
// 		events.emit('error:show', { message: 'Ваша корзина пуста' });
// 		return;
// 	}
// 	screenView.set('order');
// 	modalView.open(orderFormView.render());
// 	window.scrollTo({ top: 0 });
// });

// events.on('contacts:open', () => {
// 	screenView.set('contacts');
// 	modalView.open(orderStep2View.render());
// 	window.scrollTo({ top: 0 });
// });

// events.on('order:submit', async () => {
// 	const data = orderModel.get();

// 	if (!data.payment || !data.address || !data.email || !data.phone) {
// 		events.emit('error:show', { message: 'Заполните все поля' });
// 		return;
// 	}

// 	try {
// 		const response = await api.submitOrder(data) as unknown as { total: number };
// 		const total = response.total;

// 		cartModel.clear();
// 		orderModel.reset();

// 		events.emit('order:success', { total });
// 	} catch {
// 		events.emit('error:show', { message: 'Ошибка оплаты' });
// 	}
// });

// events.on('order:success', ({ total }: { total: number }) => {
// 	screenView.set('success');
// 	modalView.open(successView.render(total));
// 	successView.onClose(() => {
// 		modalView.close();
// 		screenView.set('catalog');
// 	});
// 	window.scrollTo({ top: 0 });
// });

// events.on('error:show', ({ message }: { message: string }) => {
// 	screenView.set('error');
// 	modalView.open(successView.renderError(message));
// 	window.scrollTo({ top: 0 });
// });

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
import { CartView } from './view/CartView';
import { CartCounterView } from './view/CartCounterView';
import { OrderFormView } from './view/OrderFormView';
import { OrderStep2View } from './view/OrderStep2View';
import { SuccessView } from './view/SuccessView';
import { ScreenView } from './view/ScreenView';
import { HeaderView } from './view/HeaderView';
import { ModalView } from './view/ModalView';

import { IProductDto } from './types/api/dto/ProductDto';
import { IProduct } from './types/model/Product';

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
const orderFormView = new OrderFormView(events);
const orderStep2View = new OrderStep2View(  );
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

events.on('products:loaded', ({ products }: { products: IProduct[] }) => {
	screenView.set('catalog');
	const cards = products.map(p => new ProductCardView(p, events).render());
	productListView.render(cards);
});

events.on('product:select', ({ id }: { id: string }) => {
	const product = productModel.getById(id);
	if (!product) return;

	const inCart = cartModel.has(id);
	const previewNode = productPreviewView.render(product, inCart, () => {
		events.emit(inCart ? 'cart:remove' : 'cart:add', { id });
		modalView.close();
	});

	modalView.open(previewNode);
	screenView.set('product');
	window.scrollTo({ top: 0 });
});

events.on('cart:add', ({ id }: { id: string }) => {
	const product = productModel.getById(id);
	if (product) cartModel.add(product);
});

events.on('cart:remove', ({ id }: { id: string }) => {
	cartModel.remove(id);
});

events.on('cart:changed', ({ items }: { items: IProduct[] }) => {
	cartCounterView.render(items.length);
	cartView.setItems(items);
});

events.on('cart:open', () => {
	screenView.set('cart');
	modalView.open(cartView.render());
	window.scrollTo({ top: 0 });
});

events.on('order:open', () => {
	if (cartModel.getItems().length === 0) {
		events.emit('error:show', { message: 'Ваша корзина пуста' });
		return;
	}
	screenView.set('order');
	modalView.open(orderFormView.render());
	window.scrollTo({ top: 0 });
});

events.on('contacts:open', () => {
	screenView.set('contacts');
	modalView.open(orderStep2View.render());
	window.scrollTo({ top: 0 });
});

events.on('order:submit', async () => {
	const data = orderModel.get();

	if (!data.payment || !data.address || !data.email || !data.phone) {
		events.emit('error:show', { message: 'Заполните все поля' });
		return;
	}

	try {
		const response = await api.submitOrder(data) as unknown as { total: number };
		const total = response.total ?? 0;

		cartModel.clear();
		orderModel.reset();

		events.emit('order:success', { total });
	} catch {
		events.emit('error:show', { message: 'Ошибка оплаты' });
	}
});

events.on('order:success', ({ total }: { total: number }) => {
	screenView.set('success');
	modalView.open(successView.render(total)); 
	successView.onClose(() => {
		modalView.close();
		screenView.set('catalog');
	});
	window.scrollTo({ top: 0 });
});

events.on('error:show', ({ message }: { message: string }) => {
	screenView.set('error');
	modalView.open(successView.renderError(message));
	window.scrollTo({ top: 0 });
});