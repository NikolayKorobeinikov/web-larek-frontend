import { EventEmitter } from '../components/base/events';

export class HeaderView {
  private basketButton: HTMLElement | null;

  constructor(private events: EventEmitter) {
    this.basketButton = document.querySelector('.header__basket');

    if (this.basketButton) {
      this.basketButton.addEventListener('click', () => {
        this.events.emit('cart:open');
      });
    }
  }
}
