import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  constructor(private api: ApiService) {}

  findAll(params?: any) {
    return this.api.get<any>('users', params);
  }

  findOne(id: number) {
    return this.api.get<User>(`users/${id}`);
  }

  create(data: Partial<User>) {
    return this.api.post<User>('users', data);
  }

  update(id: number, data: Partial<User>) {
    return this.api.put<User>('users', id, data);
  }

  delete(id: number) {
    return this.api.delete(`users/${id}`);
  }
}
