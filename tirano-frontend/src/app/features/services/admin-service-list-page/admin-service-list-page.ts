import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ServiceApi } from '../../../core/api/service.api';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { StateView } from '../../../shared/components/state-view/state-view';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { Loading } from '../../../shared/components/loading/loading';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { AdminServiceFormPage } from '../admin-service-form-page/admin-service-form-page';
import { Service } from '../../../core/models/service';
import { ToastService } from '../../../core/services/toast';
import { AdminServiceDetailPage } from '../admin-service-detail-page/admin-service-detail-page';
import { TableColumn } from '../../../core/models/table-column';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-admin-service-list-page',
  standalone: true,
  imports: [
    PaginationComponent,
    StateView,
    DataTableComponent,
    Loading,
    PageHeaderComponent,
    SearchBarComponent,
    ModalComponent,
    AdminServiceFormPage,
    AdminServiceDetailPage,
  ],
  templateUrl: './admin-service-list-page.html',
})
export class AdminServiceListPage implements OnInit, OnDestroy {
  services: Service[] = [];

  loading = true;
  search = '';
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  searchValue = '';
  show_modal = false;
  show_detail = false;

  selectedService?: Service;

  columns: TableColumn[] = [
    {
      field: 'title',
      label: 'Nom',
    },

    {
      field: 'shortDescription',
      label: 'Description',
    },

    // {
    //   field: 'active',
    //   label: 'Statut',
    //   type: 'badge',
    // },
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private serviceApi: ServiceApi,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe((value) => {
        this.searchValue = value;
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

  load(search = this.search) {
    this.loading = true;

    this.serviceApi
      .findAll({
        page: this.page,
        limit: this.limit,
        search,
        sortBy: 'created_at',
        sortOrder: 'DESC',
      })
      .subscribe({
        next: (response: any) => {
          this.services = response.data.data;
          this.page = response.data.meta.page;
          this.limit = response.data.meta.limit;
          this.total = response.data.meta.total;
          this.totalPages = response.data.meta.totalPages;

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

  openCreate() {
    this.selectedService = undefined;
    this.show_modal = true;
  }

  edit(service: Service) {
    this.selectedService = service;
    this.show_modal = true;
  }

  closeModal() {
    this.show_modal = false;
    this.show_detail = false;
    this.selectedService = undefined;
  }

  onSaved() {
    this.closeModal();
    this.load();
  }

  delete(service: Service) {
    if (!confirm(`Supprimer le service "${service.title}" ?`)) {
      return;
    }

    this.serviceApi.delete(service.id).subscribe({
      next: () => {
        this.toast.success('Service supprimé');
        this.load();
      },
      error: () => {
        this.toast.error('Erreur suppression');
      },
    });
  }

  detail(service: Service) {
    this.selectedService = service;
    this.show_detail = true;
  }
}
