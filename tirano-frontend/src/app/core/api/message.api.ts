import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageApi {
  constructor(private api: ApiService) {}

  findAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    return this.api.get<any>('messages', params);
  }

  findOne(id: number) {
    return this.api.get<Message>(`messages/${id}`);
  }

  markRead(id: number) {
    return this.api.put<Message>('messages/read', id, {});
  }

  markUnread(id: number) {
    return this.api.put<Message>('messages/unread', id, {});
  }

  delete(id: number) {
    return this.api.delete(`messages/${id}`);
  }
}
