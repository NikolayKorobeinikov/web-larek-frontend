export class ScreenView {
	private body: HTMLElement;

	constructor() {
		this.body = document.body;
	}

	set(screen: 'loading' | 'catalog' | 'product' | 'cart' | 'order' | 'contacts' | 'success' | 'error') {
		this.body.setAttribute('data-screen', screen);
	}
}
