import { IProduct } from '../types/model/Product';
import { ensureElement } from '../utils/utils';
import { EventEmitter } from '../components/base/events';

export class ProductCardView {
	private element: HTMLButtonElement;

	constructor(private product: IProduct, private events: EventEmitter) {
		this.element = this.renderCard();
		this.element.addEventListener('click', () => {
			this.events.emit('product:select', { id: this.product.id });
		});
	}

	public render(): HTMLButtonElement {
		return this.element;
	}

	private renderCard(): HTMLButtonElement {
		const template = document.getElementById('card-catalog') as HTMLTemplateElement;
		const card = template.content.cloneNode(true) as HTMLElement;
		const cardElement = ensureElement<HTMLButtonElement>('.card', card);

		const categoryElement = ensureElement('.card__category', cardElement);
		const titleElement = ensureElement('.card__title', cardElement);
		const imageElement = ensureElement<HTMLImageElement>('.card__image', cardElement);
		const priceElement = ensureElement('.card__price', cardElement);

		const categoryTranslations: Record<string, string> = {
			'soft': 'софт-скилл',
			'hard': 'хард-скилл',
			'additional': 'дополнительное',
			'button': 'кнопка',
			'other': 'другое',
		};

		categoryElement.textContent = categoryTranslations[this.product.category] || this.product.category;
		categoryElement.classList.add(`card__category_${this.product.category}`);

		titleElement.textContent = this.product.title;
		imageElement.src = this.product.image;
		imageElement.alt = this.product.title;
		priceElement.textContent = `${this.product.price} синапсов`;

		return cardElement;
	}
}
