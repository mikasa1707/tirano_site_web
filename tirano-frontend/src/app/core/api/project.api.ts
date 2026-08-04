import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectApi {
  constructor(private api: ApiService) {}

  findAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    return this.api.get<any>('projects', params);
  }

  findOne(id: number) {
    return this.api.get<Project>(`projects/${id}`);
  }

  create(data: Partial<Project>) {
    return this.api.post<Project>('projects', data);
  }

  update(id: number, data: Partial<Project>) {
    return this.api.put<Project>('projects', id, data);
  }

  delete(id: number) {
    return this.api.delete(`projects/${id}`);
  }
}
