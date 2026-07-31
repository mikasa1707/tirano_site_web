import { Product } from '../entities/product.entity';

export class ProductResponseDto {
  id: number;
  name: string;
  description?: string;
  reference?: string;
  price?: number;
  active: boolean;
  medias: any[];

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.reference = product.reference;
    this.price = product.price;
    this.active = product.active;
    this.medias = product.medias ?? [];
  }
}
