import { CDN_URL } from '../utils/constants';
import { IProduct } from '../types/model/Product';
import { IProductDto } from '../types/api/dto/ProductDto';

export function adaptProduct(dto: IProductDto): IProduct {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    price: typeof dto.price === 'number' ? dto.price : 0,
    category: dto.category,
    image: `${CDN_URL}/${dto.image}`,
  };
}
