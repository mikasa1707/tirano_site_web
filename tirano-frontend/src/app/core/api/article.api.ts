import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Article } from '../models/article';

@Injectable({
  providedIn: 'root',
})
export class ArticleApi {
  constructor(private api: ApiService) {}

  findAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    return this.api.get<any>('articles', params);
  }

  findOne(id: number) {
    return this.api.get<Article>(`articles/${id}`);
  }

  create(data: Partial<Article>) {
    return this.api.post<Article>('articles', data);
  }

  update(id: number, data: Partial<Article>) {
    return this.api.put<Article>('articles', id, data);
  }

  delete(id: number) {
    return this.api.delete(`articles/${id}`);
  }
}
