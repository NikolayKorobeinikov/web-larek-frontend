import { EventEmitter } from '../components/base/events';
import { ensureElement } from '../utils/utils';
import { IOrderData } from '../types/model/OrderModel';

export class OrderFormView {
	private events: EventEmitter;
	private element: HTMLElement;
	private errorElement: HTMLElement;
	private payOnlineButton: HTMLButtonElement;
	private payOnDeliveryButton: HTMLButtonElement;
	private addressInput: HTMLInputElement;
	private nextButton: HTMLButtonElement;

	private payment: IOrderData['payment'] = null;
	private address: IOrderData['address'] = '';

	constructor(events: EventEmitter) {
		this.events = events;

		const template = document.getElementById('order') as HTMLTemplateElement;
		if (!template) {
			throw new Error('Template #order not found');
		}

		this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		this.errorElement = ensureElement<HTMLElement>('.form__errors', this.element);
		this.payOnlineButton = ensureElement<HTMLButtonElement>('[name="card"]', this.element);
		this.payOnDeliveryButton = ensureElement<HTMLButtonElement>('[name="cash"]', this.element);
		this.addressInput = ensureElement<HTMLInputElement>('[name="address"]', this.element);
		this.nextButton = ensureElement<HTMLButtonElement>('.order__button', this.element);

		this.initEvents();
		this.updateSubmitState();
	}

	private initEvents() {
		this.payOnlineButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.payment = 'online';
			this.highlightPayment();
			this.events.emit('order:update', { key: 'payment', value: this.payment });
			this.updateSubmitState();
		});

		this.payOnDeliveryButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.payment = 'cash';
			this.highlightPayment();
			this.events.emit('order:update', { key: 'payment', value: this.payment });
			this.updateSubmitState();
		});

		this.addressInput.addEventListener('input', () => {
			this.address = this.addressInput.value.trim();
			this.events.emit('order:update', { key: 'address', value: this.address });
			this.updateSubmitState();
		});

		this.nextButton.addEventListener('click', (e) => {
			e.preventDefault();
			if (this.payment && this.address) {
				this.events.emit('contacts:open');
			}
		});
	}

	private highlightPayment() {
		this.payOnlineButton.classList.toggle('button_alt-active', this.payment === 'online');
		this.payOnDeliveryButton.classList.toggle('button_alt-active', this.payment === 'cash');
	}

	private updateSubmitState() {
		this.nextButton.disabled = !(this.payment && this.address);
	}

	public render() {
		return this.element;
	}

	public setErrors(message: string) {
		this.errorElement.textContent = message;
	}
}
