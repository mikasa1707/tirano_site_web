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
  // =========================================================
  // DATA
  // =========================================================

  messages: Message[] = [];

  selected?: Message;

  // =========================================================
  // STATE
  // =========================================================

  loading = false;

  show = false;

  // =========================================================
  // PAGINATION
  // =========================================================

  page = 1;

  limit = 10;

  total = 0;

  totalPages = 1;

  // =========================================================
  // SEARCH
  // =========================================================

  search = '';

  // =========================================================
  // TABLE
  // =========================================================

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

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private readonly api: MessageApi,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.load();
  }

  // =========================================================
  // LOAD
  // =========================================================

  load(): void {
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
          this.messages = res?.data?.data ?? [];

          this.total = res?.data?.meta?.total ?? 0;

          this.totalPages = res?.data?.totalPages ?? res?.data?.meta?.totalPages ?? 1;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Erreur chargement messages', error);

          this.messages = [];

          this.total = 0;

          this.totalPages = 1;

          this.loading = false;

          this.cdr.detectChanges();
        },
      });
  }

  // =========================================================
  // SEARCH
  // =========================================================

  onSearch(value: string): void {
    this.search = value;

    this.page = 1;

    this.load();
  }

  // =========================================================
  // PAGINATION
  // =========================================================

  onPageChange(page: number): void {
    this.page = page;

    this.load();
  }

  // =========================================================
  // OPEN
  // =========================================================

  open(message: Message): void {
    this.selected = {
      ...message,
    };

    this.show = true;
  }

  // =========================================================
  // CLOSE
  // =========================================================

  close(): void {
    this.show = false;

    this.selected = undefined;
  }

  // =========================================================
  // MESSAGE CHANGED
  // =========================================================

  onMessageChanged(updatedMessage: Message): void {
    /*
     * 1. Mise à jour du tableau
     */
    const index = this.messages.findIndex((message) => message.id === updatedMessage.id);

    if (index !== -1) {
      this.messages[index] = {
        ...updatedMessage,
      };

      /*
       * Nouvelle référence du tableau
       * pour forcer la détection Angular.
       */
      this.messages = [...this.messages];
    }

    /*
     * 2. Mise à jour du message affiché
     */
    if (this.selected?.id === updatedMessage.id) {
      this.selected = {
        ...updatedMessage,
      };
    }

    /*
     * 3. Rafraîchissement de l'affichage
     */
    this.cdr.detectChanges();
  }

  // =========================================================
  // DELETE
  // =========================================================

  delete(id: number): void {
    this.api.delete(id).subscribe({
      next: () => {
        /*
         * Si le dernier élément
         * de la page vient d'être supprimé,
         * on revient éventuellement à la page précédente.
         */
        if (this.messages.length === 1 && this.page > 1) {
          this.page--;
        }

        this.load();
      },

      error: (error) => {
        console.error('Erreur suppression message', error);
      },
    });
  }

  // =========================================================
  // MARK READ
  // =========================================================

  markRead(id: number): void {
    this.api.markRead(id).subscribe({
      next: (updatedMessage: Message) => {
        /*
         * Si l'API retourne le message,
         * on synchronise directement.
         */
        if (updatedMessage) {
          this.onMessageChanged(updatedMessage);
        } else {
          /*
           * Sinon on recharge les données.
           */
          this.load();
        }
      },

      error: (error) => {
        console.error('Erreur marquage message lu', error);
      },
    });
  }
}
