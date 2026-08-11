import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UserApi } from '../../../core/api/user.api';
import { User } from '../../../core/models/user';
import { TableColumn } from '../../../core/models/table-column';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { ToastService } from '../../../core/services/toast';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { Loading } from '../../../shared/components/loading/loading';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { StateView } from '../../../shared/components/state-view/state-view';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { UserFormPage } from '../admin-user-form-page/user-form-page';

@Component({
  selector: 'app-admin-user-list-page',
  standalone: true,
  templateUrl: './user-list-page.html',
  imports: [
    PageHeaderComponent,
    SearchBarComponent,
    Loading,
    DataTableComponent,
    PaginationComponent,
    StateView,
    ModalComponent,
    UserFormPage,
  ],
})
export class UserListPage implements OnInit, OnDestroy {
  users: User[] = [];

  loading = false;
  page = 1;
  limit = 10;
  totalPages = 1;
  total = 0;
  show_modal = false;
  show_detail = false;

  selected?: User;

  search = '';

  columns: TableColumn[] = [
    {
      field: 'firstname',
      label: 'Prénom',
    },

    {
      field: 'lastname',
      label: 'Nom',
    },

    {
      field: 'job',
      label: 'Fonction',
    },

    {
      field: 'email',
      label: 'Email',
    },

    {
      field: 'role',
      label: 'Accès',
    },

    {
      field: 'created_at',
      label: 'Créé le',
      type: 'date',
    },
  ];
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private api: UserApi,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe((value: string) => {
        this.search = value;
        this.page = 1;
        this.load(value);
      });
    this.load();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  load(_search = '') {
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
          this.users = res.data.data ?? [];
          this.total = res.data.meta.total;
          this.totalPages = res.data.totalPages ?? 1;
          this.loading = false;
          this.cdr.detectChanges();
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

  openCreate() {
    this.selected = undefined;
    this.show_modal = true;
  }

  edit(user: User) {
    this.selected = user;
    this.show_modal = true;
  }

  closeModal() {
    this.show_modal = false;
    this.show_detail = false;
    this.selected = undefined;
  }

  onSaved() {
    this.closeModal();
    this.load();
  }

  delete(user: User) {
    if (!confirm(`Supprimer l utilisateur "${user.firstname}" ?`)) {
      return;
    }

    this.api.delete(user.id).subscribe({
      next: () => {
        this.toast.success('Service supprimé');
        this.load();
      },
      error: () => {
        this.toast.error('Erreur suppression');
      },
    });
  }

  detail(user: User) {
    this.selected = user;
    this.show_detail = true;
  }
}
