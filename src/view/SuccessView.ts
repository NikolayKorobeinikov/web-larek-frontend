import { cloneTemplate, ensureElement } from '../utils/utils';

export class SuccessView {
	private node: HTMLElement;
	private description: HTMLElement;
	private closeButton: HTMLButtonElement;

	constructor() {
		this.node = cloneTemplate('#success');

		this.description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.node
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.node
		);
	}

	render(total: number): HTMLElement {
		this.description.textContent = `Списано ${total.toLocaleString('ru-RU')} синапсов`;
		return this.node;
	}

	renderError(message: string): HTMLElement {
		const errorDiv = document.createElement('div');
		errorDiv.className = 'modal__error';
		errorDiv.textContent = message;
		return errorDiv;
	}

	onClose(handler: () => void): void {
		this.closeButton.addEventListener('click', handler);
	}
}