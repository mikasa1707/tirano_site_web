import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Service } from '../models/service';

@Injectable({
  providedIn: 'root',
})
export class ServiceApi {
  constructor(private api: ApiService) {}

  findAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    return this.api.get<any>('site-services', params);
  }

  findOne(id: number) {
    return this.api.get<Service>(`site-services/${id}`);
  }

  create(data: Partial<Service>) {
    return this.api.post<Service>('site-services', data);
  }

  update(id: number, data: Partial<Service>) {
    return this.api.put<Service>('site-services', id, data);
  }

  delete(id: number) {
    return this.api.delete(`site-services/${id}`);
  }
}
