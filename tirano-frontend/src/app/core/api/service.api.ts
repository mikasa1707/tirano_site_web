import { Injectable, Service } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ServiceApi {
  constructor(private api: ApiService) {}

  findAll() {
    return this.api.get<Service[]>('services');
  }

  findOne(id: number) {
    return this.api.get<Service>(`services/${id}`);
  }

  create(data: Partial<Service>) {
    return this.api.post<Service>('services', data);
  }

  update(id: number, data: Partial<Service>) {
    return this.api.put<Service>(`services`, id, data);
  }

  delete(id: number) {
    return this.api.delete(`services/${id}`);
  }
}
