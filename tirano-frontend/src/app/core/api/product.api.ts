import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductApi {
  constructor(private api: ApiService) {}

  findAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    return this.api.get<any>('products', params);
  }

  findOne(id: number) {
    return this.api.get<Product>(`products/${id}`);
  }

  create(data: Partial<Product>) {
    return this.api.post<Product>('products', data);
  }

  update(id: number, data: Partial<Product>) {
    return this.api.put<Product>('products', id, data);
  }

  delete(id: number) {
    return this.api.delete(`products/${id}`);
  }
}
