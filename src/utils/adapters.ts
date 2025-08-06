import { CDN_URL } from '../utils/constants';
import { IProduct } from '../types/model/Product';
import { IProductDto } from '../types/api/dto/ProductDto';

export function adaptProduct(dto: IProductDto): IProduct {
  let categoryClass = 'other'; 
  if (dto.category.toLowerCase().includes('софт')) {
    categoryClass = 'soft';
  } else if (dto.category.toLowerCase().includes('хард')) {
    categoryClass = 'hard';
  }

  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    price: typeof dto.price === 'number' ? dto.price : 0,
    category: categoryClass, 
    image: `${CDN_URL}/${dto.image}`,
  };
}


