import { cloneTemplate } from '../utils/utils';
import { IProduct } from '../types/model/Product';

interface ICartViewOptions {
	list: IProduct[];
	onRemove: (id: string) => void;
	onSubmit: () => void;
}

export class CartView {
	private node: HTMLElement;
	private listNode: HTMLElement;
	private submitBtn: HTMLButtonElement;
	private totalPrice: HTMLElement;

	constructor({ list, onRemove, onSubmit }: ICartViewOptions) {
		this.node = cloneTemplate('#basket');
		this.listNode = this.node.querySelector('.basket__list')!;
		this.submitBtn = this.node.querySelector('.basket__button')!;
		this.totalPrice = this.node.querySelector('.basket__price')!;

		this.submitBtn.addEventListener('click', (e) => {
			e.preventDefault();
			onSubmit();
		});

		this.renderItems(list, onRemove);
		this.renderTotal(list);
	}

	private renderItems(list: IProduct[], onRemove: (id: string) => void) {
		list.forEach((item, index) => {
			const itemNode = document.createElement('li');
			itemNode.className = 'basket__item card card_compact';
			itemNode.innerHTML = `
				<span class="basket__item-index">${index + 1}</span>
				<span class="card__title">${item.title}</span>
				<span class="card__price">${item.price} синапсов</span>
				<button class="basket__item-delete card__button" aria-label="удалить"></button>
			`;
			itemNode.querySelector('.basket__item-delete')!.addEventListener('click', () => {
				onRemove(item.id);
			});
			this.listNode.appendChild(itemNode);
		});
	}

	private renderTotal(list: IProduct[]) {
		const total = list.reduce((sum, item) => sum + item.price, 0);
		this.totalPrice.textContent = `${total} синапсов`;
	}

	render(): HTMLElement {
		return this.node;
	}
}
