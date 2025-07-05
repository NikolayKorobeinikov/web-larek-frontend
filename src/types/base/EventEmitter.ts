export interface IEventEmitter<EventMap> {
  on<K extends keyof EventMap>(eventName: K, listener: (payload: EventMap[K]) => void): void;
  off<K extends keyof EventMap>(eventName: K, listener: (payload: EventMap[K]) => void): void;
  emit<K extends keyof EventMap>(eventName: K, payload: EventMap[K]): void;
}
