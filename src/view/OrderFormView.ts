import { IOrderForm } from '../types/model/OrderForm';

export class OrderFormView {
  private root: HTMLElement;

  constructor(rootSelector = '#order') {
    const tpl = document.querySelector<HTMLTemplateElement>(rootSelector);
    if (!tpl) throw new Error(`Template ${rootSelector} not found`);
    this.root = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
  }

  render() {
    return this.root;
  }

  bindSubmit(handler: (data: IOrderForm) => void) {
    const form = this.root.querySelector('form')!;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handler(this.getFormData());
    });
  }

  getFormData(): IOrderForm {
    // Подгоните селекторы под ваш HTML шага оформления
    const paymentBtnSelected = this.root.querySelector<HTMLButtonElement>('.order__buttons .button:not(.button_alt)');
    const payment = (paymentBtnSelected?.getAttribute('name') as 'online' | 'cash') || 'online';

    const address = (this.root.querySelector('input[name="address"]') as HTMLInputElement)?.value?.trim() || '';
    const email = (this.root.querySelector('input[name="email"]') as HTMLInputElement)?.value?.trim() || '';
    const phone = (this.root.querySelector('input[name="phone"]') as HTMLInputElement)?.value?.trim() || '';

    return { payment, address, email, phone };
  }
}
