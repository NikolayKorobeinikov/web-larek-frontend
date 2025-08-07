import { EventEmitter } from '../components/base/events';
import { ensureElement } from '../utils/utils';
import { IOrderData } from '../types/model/IOrderData';
import { IOrderFormErrors } from '../types/model/OrderFormErrors';

export class OrderFormView {
	private element: HTMLElement;
	private payOnlineButton: HTMLButtonElement;
	private payOnDeliveryButton: HTMLButtonElement;
	private addressInput: HTMLInputElement;
	private nextButton: HTMLButtonElement;
	private errorElement: HTMLElement;

	constructor(private events: EventEmitter) {
		const template = document.getElementById('order') as HTMLTemplateElement;
		if (!template) throw new Error('Template #order not found');

		this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		this.payOnlineButton = ensureElement<HTMLButtonElement>('[name="card"]', this.element);
		this.payOnDeliveryButton = ensureElement<HTMLButtonElement>('[name="cash"]', this.element);
		this.addressInput = ensureElement<HTMLInputElement>('[name="address"]', this.element);
		this.nextButton = ensureElement<HTMLButtonElement>('.order__button', this.element);
		this.errorElement = ensureElement<HTMLElement>('.form__errors', this.element);

		this.initEvents();
		this.updateSubmitState();
	}

	private initEvents() {
		this.payOnlineButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.events.emit('order:change', { key: 'payment', value: 'online' });
			this.highlightPayment('online');
			this.updateSubmitState();
		});

		this.payOnDeliveryButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.events.emit('order:change', { key: 'payment', value: 'cash' });
			this.highlightPayment('cash');
			this.updateSubmitState();
		});

		this.addressInput.addEventListener('input', () => {
			this.events.emit('order:change', { key: 'address', value: this.addressInput.value });
			this.updateSubmitState();
		});

		this.nextButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.events.emit('contacts:open');
		});
	}

	private highlightPayment(type: 'online' | 'cash') {
		this.payOnlineButton.classList.toggle('button_alt-active', type === 'online');
		this.payOnDeliveryButton.classList.toggle('button_alt-active', type === 'cash');
	}

	private updateSubmitState() {
		const address = this.addressInput.value.trim();
		const isPaymentSelected =
			this.payOnlineButton.classList.contains('button_alt-active') ||
			this.payOnDeliveryButton.classList.contains('button_alt-active');

		this.nextButton.disabled = !(isPaymentSelected && address.length >= 4);
	}

	public setErrors(errors: Partial<IOrderFormErrors>) {
		const messages = Object.values(errors).filter(Boolean).join('; ');
		this.errorElement.textContent = messages;
	}

	public render(): HTMLElement {
		return this.element;
	}
}
