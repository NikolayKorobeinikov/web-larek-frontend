import { cloneTemplate, ensureElement } from '../utils/utils';
import { EventEmitter } from '../components/base/events';

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
			if (!this.submitButton.disabled) {
				this.events.emit('order:open');
			}
		});
	}


	public setItems(itemElements: HTMLElement[], totalPrice: number): void {
		this.list.replaceChildren(...itemElements);
		this.total.textContent = `${totalPrice} синапсов`;

		this.submitButton.disabled = itemElements.length === 0;
	}

	public render(): HTMLElement {
		return this.node;
	}
}
