import { Component, Input } from '@angular/core';
import { Message } from '../../../core/models/message';
import { DetailViewComponent } from '../../../shared/components/detail-view/detail-view';
import { DetailField } from '../../../core/models/detail-field';

@Component({
  selector: 'app-admin-message-detail-page',
  standalone: true,
  imports: [DetailViewComponent],
  templateUrl: './admin-message-detail-page.html',
  styleUrl: './admin-message-detail-page.scss',
})
export class AdminMessageDetailPage {
  @Input()
  message?: Message;

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
      col: 'col-6',
    },

    {
      key: 'created_at',
      label: 'Date',
      type: 'date',
      col: 'col-12',
    },

    {
      key: 'phone',
      label: 'Téléphone',
      type: 'text',
      col: 'col-6',
    },

    {
      key: 'subject',
      label: 'Sujet',
      type: 'text',
      col: 'col-9',
    },

    {
      key: 'isRead',
      label: '',
      type: 'badge',
      col: 'col-3',
    },

    {
      key: 'message',
      label: 'Message',
      type: 'html',
      col: 'col-12',
    },
  ];
}
