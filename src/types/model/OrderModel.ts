import { EventEmitter } from '../../components/base/events';

export interface IOrderData {
    payment: 'online' | 'cash' | null;
    address: string;
    email: string;
    phone: string;
}

export class OrderModel {
    private data: IOrderData;

    constructor(private events: EventEmitter) {
        this.data = {
            payment: null,
            address: '',
            email: '',
            phone: ''
        };
    }

    public get(): IOrderData {
        return { ...this.data };
    }

    public set<K extends keyof IOrderData>(key: K, value: IOrderData[K]) {
        this.data[key] = value;
        this.events.emit('order:changed', this.get());
    }

    public reset() {
        this.data = {
            payment: null,
            address: '',
            email: '',
            phone: ''
        };
        this.events.emit('order:changed', this.get());
    }
}
