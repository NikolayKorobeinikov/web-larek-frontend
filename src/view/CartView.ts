import { cloneTemplate, ensureElement } from '../utils/utils';
import { EventEmitter } from '../components/base/events';
import { IProduct } from '../types/model/Product';
import { CartItemView } from './CartItemView';

export class CartView {
	private node: HTMLElement;
	private list: HTMLElement;
	private total: HTMLElement;
	private submitButton: HTMLButtonElement;

	constructor(private events: EventEmitter) {
		this.node = cloneTemplate('#basket');
		this.list = ensureElement<HTMLElement>('.basket__list', this.node);
		this.total = ensureElement<HTMLElement>('.basket__price', this.node);
		this.submitButton = ensureElement<HTMLButtonElement>('.basket__button', this.node);

		this.submitButton.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}

	setItems(items: IProduct[]) {
		const itemViews = items.map((product, index) =>
			new CartItemView(product, index + 1, this.events).render()
		);
		this.list.replaceChildren(...itemViews);

		const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
		this.total.textContent = `${totalPrice} синапсов`;
	}

	render(): HTMLElement {
		return this.node;
	}
}
