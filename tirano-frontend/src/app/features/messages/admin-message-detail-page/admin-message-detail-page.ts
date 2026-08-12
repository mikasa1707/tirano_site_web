import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Message } from '../../../core/models/message';
import { DetailViewComponent } from '../../../shared/components/detail-view/detail-view';
import { DetailField } from '../../../core/models/detail-field';
import { MessageApi } from '../../../core/api/message.api';

@Component({
  selector: 'app-admin-message-detail-page',
  standalone: true,
  imports: [DetailViewComponent],
  templateUrl: './admin-message-detail-page.html',
  styleUrl: './admin-message-detail-page.scss',
})
export class AdminMessageDetailPage implements OnChanges {
  @Input()
  message?: Message;

  @Output()
  messageChanged = new EventEmitter<Message>();

  fields: DetailField[] = [
    {
      key: 'fullname',
      label: 'Nom',
      type: 'text',
      col: 'col-6',
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      col: 'col-3',
    },
    {
      key: 'phone',
      label: 'Téléphone',
      type: 'text',
      col: 'col-3',
    },
    {
      key: 'created_at',
      label: 'Date',
      type: 'date',
      col: 'col-12',
    },
    {
      key: 'subject',
      label: 'Sujet',
      type: 'text',
      col: 'col-9',
    },
    // {
    //   key: 'isRead',
    //   label: '',
    //   type: 'badge',
    //   col: 'col-3',
    // },
    {
      key: 'message',
      label: 'Message',
      type: 'html',
      col: 'col-12',
    },
  ];

  constructor(private readonly messageApi: MessageApi) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['message'] || !this.message) {
      return;
    }

    if (!this.message.isRead) {
      this.markAsRead();
    }
  }

  // =========================================================
  // MARK READ
  // =========================================================

  markAsRead(): void {
    if (!this.message || this.message.isRead) {
      return;
    }

    this.messageApi.markRead(this.message.id).subscribe({
      next: () => {
        if (!this.message) {
          return;
        }

        this.message.isRead = true;

        this.messageChanged.emit(this.message);
      },

      error: (error) => {
        console.error('Erreur lors du marquage comme lu', error);
      },
    });
  }

  // =========================================================
  // MARK UNREAD
  // =========================================================

  markAsUnread(): void {
    if (!this.message || !this.message.isRead) {
      return;
    }

    this.messageApi.markUnread(this.message.id).subscribe({
      next: () => {
        if (!this.message) {
          return;
        }

        this.message.isRead = false;

        this.messageChanged.emit(this.message);
      },

      error: (error) => {
        console.error('Erreur lors du marquage comme non lu', error);
      },
    });
  }

  // =========================================================
  // TOGGLE
  // =========================================================

  toggleRead(): void {
    if (!this.message) {
      return;
    }

    if (this.message.isRead) {
      this.markAsUnread();
    } else {
      this.markAsRead();
    }
  }
}
