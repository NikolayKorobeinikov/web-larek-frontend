export interface IEventPayload {
  'product:select': { id: string };
  'cart:add': { id: string; quantity: number };
  'order:submit': { items: string[]; userId: string };
}
