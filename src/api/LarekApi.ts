import { Api } from '../components/base/api';
import { IOrderForm } from '../types/model/OrderForm';
import { IProductDto } from '../types/api/dto/ProductDto';

export class LarekApi {
	constructor(private api: Api) {}

	async getProducts(): Promise<IProductDto[] | { items: IProductDto[] }> {
		return this.api.get<IProductDto[] | { items: IProductDto[] }>('/product');
	}

	async getProduct(id: string): Promise<IProductDto> {
		return this.api.get<IProductDto>(`/product/${id}`);
	}

	async submitOrder(data: IOrderForm): Promise<{ total: number }> {
		return this.api.post<{ total: number }>('/order', data);
	}
}
