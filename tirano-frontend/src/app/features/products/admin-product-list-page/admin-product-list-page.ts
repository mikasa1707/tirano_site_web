import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ProductApi } from '../../../core/api/product.api';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Product } from '../../../core/models/product';
import { TableColumn } from '../../../core/models/table-column';
import { ToastService } from '../../../core/services/toast';
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header";
import { SearchBarComponent } from "../../../shared/components/search-bar/search-bar";
import { Loading } from "../../../shared/components/loading/loading";
import { DataTableComponent } from "../../../shared/components/data-table/data-table";
import { PaginationComponent } from "../../../shared/components/pagination/pagination";
import { StateView } from "../../../shared/components/state-view/state-view";
import { ModalComponent } from "../../../shared/components/modal/modal";
import { AdminProductFormPage } from "../admin-product-form-page/admin-product-form-page";
import { AdminProductDetailPage } from "../admin-product-detail-page/admin-product-detail-page";

@Component({
  selector: 'app-admin-product-list-page',
  imports: [PageHeaderComponent, SearchBarComponent, Loading, DataTableComponent, PaginationComponent, StateView, ModalComponent, AdminProductFormPage, AdminProductDetailPage],
  templateUrl: './admin-product-list-page.html',
  styleUrl: './admin-product-list-page.scss',
})
export class AdminProductListPage implements OnInit, OnDestroy {
  products: Product[] = [];

  loading = true;
  search = '';
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  searchValue = '';
  show_modal = false;
  show_detail = false;

  selected?: Product;

  columns: TableColumn[] = [
    {
      field: 'name',
      label: 'Nom',
    },

    {
      field: 'reference',
      label: 'Référence',
    },

    {
      field: 'price',
      label: 'Prix',
      type: 'currency',
    },

    {
      field: 'active',
      label: 'Statut',
      type: 'badge',
    },
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private api: ProductApi,
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

    this.api
      .findAll({
        page: this.page,
        limit: this.limit,
        search,
        sortBy: 'created_at',
        sortOrder: 'DESC',
      })
      .subscribe({
        next: (response: any) => {
          this.products = response.data.data;
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
    this.selected = undefined;
    this.show_modal = true;
  }

  edit(project: Product) {
    this.selected = project;
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

  delete(project: Product) {
    if (!confirm(`Supprimer le produit "${project.name}" ?`)) {
      return;
    }

    this.api.delete(project.id).subscribe({
      next: () => {
        this.toast.success('Produit supprimé');
        this.load();
      },
      error: () => {
        this.toast.error('Erreur suppression');
      },
    });
  }

  detail(project: Product) {
    this.selected = project;
    this.show_detail = true;
  }
}
