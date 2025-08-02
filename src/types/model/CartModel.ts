export class CartModel {
  private items: Record<string, number> = {};

  add(id: string) {
    this.items[id] = (this.items[id] || 0) + 1;
  }

  remove(id: string) {
    delete this.items[id];
  }

  list() {
    return { ...this.items };
  }

  clear() {
    this.items = {};
  }

  count() {
    return Object.values(this.items).reduce((a, b) => a + b, 0);
  }

  total(products: Array<{ id: string; price: number }>) {
    return Object.entries(this.items).reduce((sum, [id, qty]) => {
      const pr = products.find(p => p.id === id);
      return sum + (pr?.price ?? 0) * qty;
    }, 0);
  }
}
