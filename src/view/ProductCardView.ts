// import { IProduct } from '../types/model/Product';
// import { cloneTemplate, ensureElement } from '../utils/utils';
// import { EventEmitter } from '../components/base/events';

// export class ProductCardView {
//   private node: HTMLButtonElement;

//   constructor(product: IProduct, events: EventEmitter) {
//     this.node = cloneTemplate('#card-catalog');

//     this.node.dataset.id = product.id;
//     ensureElement<HTMLElement>('.card__title', this.node).textContent = product.title;
//     ensureElement<HTMLElement>('.card__price', this.node).textContent = `${product.price.toLocaleString('ru-RU')} синапсов`;
//     ensureElement<HTMLElement>('.card__category', this.node).textContent = product.category;

//     const img = this.node.querySelector('.card__image') as HTMLImageElement;
//     if (img) {
//       img.src = product.image;
//       img.alt = product.title;
//     }

//     this.node.addEventListener('click', () => {
//       events.emit('product:select', { id: product.id });
//     });
//   }

//   render(): HTMLButtonElement {
//     return this.node;
//   }
// }


// import { cloneTemplate, ensureElement } from '../utils/utils';
// import { IProduct } from '../types/model/Product';
// import { EventEmitter } from '../components/base/events';

// export class ProductCardView {
// 	private element: HTMLElement;
// 	private title: HTMLElement;
// 	private price: HTMLElement;
// 	private category: HTMLElement;
// 	private image: HTMLImageElement;

// 	constructor(private product: IProduct, private events: EventEmitter) {
// 		this.element = cloneTemplate('#card-catalog');

// 		this.title = ensureElement<HTMLElement>('.card__title', this.element);
// 		this.price = ensureElement<HTMLElement>('.card__price', this.element);
// 		this.category = ensureElement<HTMLElement>('.card__category', this.element);
// 		this.image = ensureElement<HTMLImageElement>('.card__image', this.element);
// 	}

// 	render(): HTMLElement {
// 		this.title.textContent = this.product.title;
// 		this.price.textContent = `${this.product.price} синапсов`;
// 		this.category.textContent = this.product.category;
// 		this.image.src = this.product.image;
// 		this.image.alt = this.product.title;

// 		this.category.classList.remove(
// 			'card__category_soft',
// 			'card__category_hard',
// 			'card__category_other'
// 		);

// 		this.category.classList.add(`card__category_${this.product.category}`);

// 		this.element.addEventListener('click', () => {
// 			this.events.emit('product:select', { id: this.product.id });
// 		});

// 		return this.element;
// 	}
// }


// import { cloneTemplate, ensureElement } from '../utils/utils';
// import { IProduct } from '../types/model/Product';
// import { EventEmitter } from '../components/base/events';

// export class ProductCardView {
// 	private element: HTMLElement;
// 	private title: HTMLElement;
// 	private price: HTMLElement;
// 	private category: HTMLElement;
// 	private image: HTMLImageElement;

// 	constructor(private product: IProduct, private events: EventEmitter) {
// 		this.element = cloneTemplate('#card-catalog');
// 		this.title = ensureElement('.card__title', this.element);
// 		this.price = ensureElement('.card__price', this.element);
// 		this.category = ensureElement('.card__category', this.element);
// 		this.image = ensureElement<HTMLImageElement>('.card__image', this.element);
// 	}

// 	render(): HTMLElement {
// 		this.title.textContent = this.product.title;
// 		this.price.textContent = `${this.product.price} синапсов`;
// 		this.category.textContent = this.product.category;
// 		this.image.src = this.product.image;
// 		this.image.alt = this.product.title;

// 		this.category.classList.remove(
// 			'card__category_soft',
// 			'card__category_hard',
// 			'card__category_other',
// 			'card__category_design',
// 			'card__category_fun'
// 		);
// 		this.category.classList.add(`card__category_${this.product.category}`);

// 		this.element.addEventListener('click', () => {
// 			this.events.emit('product:select', { id: this.product.id });
// 		});

// 		return this.element;
// 	}
// }


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
