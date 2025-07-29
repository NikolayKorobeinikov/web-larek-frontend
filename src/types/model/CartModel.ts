export class CartModel {
  private cart: Record<string, number> = {};

  addToCart(id: string) {
    this.cart[id] = (this.cart[id] || 0) + 1;
  }

  removeFromCart(id: string) {
    delete this.cart[id];
  }

  getItems(): Record<string, number> {
    return this.cart;
  }

  clearCart() {
    this.cart = {};
  }
}
