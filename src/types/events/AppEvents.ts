export type AppEvents =
  | 'products:loaded'
  | 'product:select'
  | 'cart:add'
  | 'cart:remove'
  | 'cart:open'
  | 'order:open'
  | 'contacts:open'
  | 'order:submit'
  | 'order:success';