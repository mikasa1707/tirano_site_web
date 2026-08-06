import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageApi } from '../../../core/api/message.api';
import { Message } from '../../../core/models/message';
import { TableColumn } from '../../../core/models/table-column';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { Loading } from '../../../shared/components/loading/loading';
import { StateView } from '../../../shared/components/state-view/state-view';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { AdminMessageDetailPage } from '../admin-message-detail-page/admin-message-detail-page';

@Component({
  selector: 'app-admin-message-list-page',
  standalone: true,
  templateUrl: './admin-message-list-page.html',
  imports: [
    PageHeaderComponent,
    DataTableComponent,
    SearchBarComponent,
    PaginationComponent,
    Loading,
    StateView,
    ModalComponent,
    AdminMessageDetailPage,
  ],
})
export class AdminMessageListPage implements OnInit {
  messages: Message[] = [];
  selected?: Message;

  loading = false;
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 1;

  show = false;

  search = '';

  columns: TableColumn[] = [
    {
      field: 'fullname',
      label: 'Nom',
    },

    {
      field: 'email',
      label: 'Email',
    },

    {
      field: 'subject',
      label: 'Sujet',
    },

    {
      field: 'isRead',
      label: 'Statut',
      type: 'badge',
    },

    {
      field: 'created_at',
      label: 'Date',
      type: 'date',
    },
  ];

  constructor(
    private api: MessageApi,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;

    this.api
      .findAll({
        page: this.page,
        limit: this.limit,
        search: this.search,
        sortBy: 'created_at',
        sortOrder: 'DESC',
      })
      .subscribe({
        next: (res: any) => {
          this.messages = res.data.data ?? [];
          this.total = res.data.meta.total;
          this.totalPages = res.data.totalPages ?? 1;
          this.loading = false;
          this.cdr.detectChanges();
        },

        error: () => {
          this.loading = false;
        },
      });
  }

  onSearch(value: string) {
    this.search = value;

    this.page = 1;

    this.load();
  }

  onPageChange(page: number) {
    this.page = page;

    this.load();
  }

  onAction(event: any) {
    const message = event.row;

    switch (event.action) {
      case 'view':
        this.open(message);

        break;

      case 'read':
        this.markRead(message.id);

        break;

      case 'delete':
        this.delete(message.id);

        break;
    }
  }

  open(message: Message) {
    this.show = true;
    this.selected = message;
    // ouvrir modal detail ici
  }

  delete(id: number) {
    this.api.delete(id).subscribe(() => {
      this.load();
    });
  }

  markRead(id: number) {
    this.api.markRead(id).subscribe(() => {
      this.load();
    });
  }
}
