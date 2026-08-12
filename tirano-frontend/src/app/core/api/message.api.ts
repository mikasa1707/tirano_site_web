import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageApi {
  constructor(private readonly api: ApiService) {}

  // =========================================================
  // PUBLIC - CREATE MESSAGE
  // =========================================================

  create(data: {
    fullname: string;
    phone?: string;
    email: string;
    subject: string;
    message: string;
  }) {
    return this.api.post<Message>('messages', data);
  }

  // =========================================================
  // ADMIN - LIST
  // =========================================================

  findAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    return this.api.get<any>('messages', params);
  }

  // =========================================================
  // ADMIN - DETAIL
  // =========================================================

  findOne(id: number) {
    return this.api.get<Message>(`messages/${id}`);
  }

  // =========================================================
  // ADMIN - UNREAD COUNT
  // =========================================================

  getUnreadCount() {
    return this.api.get<any>('messages/unread-count');
  }

  // =========================================================
  // ADMIN - MARK READ
  // =========================================================

  markRead(id: number) {
    return this.api.putPath<Message>(`messages/${id}/read`);
  }

  // =========================================================
  // ADMIN - MARK UNREAD
  // =========================================================

  markUnread(id: number) {
    return this.api.putPath<Message>(`messages/${id}/unread`);
  }

  // =========================================================
  // ADMIN - DELETE
  // =========================================================

  delete(id: number) {
    return this.api.delete(`messages/${id}`);
  }
}
