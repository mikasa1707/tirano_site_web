import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TestimonialApi } from '../../../core/api/testimonial.api';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { TableColumn } from '../../../core/models/table-column';
import { Testimonial } from '../../../core/models/testimonial';
import { ToastService } from '../../../core/services/toast';
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header";
import { SearchBarComponent } from "../../../shared/components/search-bar/search-bar";
import { Loading } from "../../../shared/components/loading/loading";
import { DataTableComponent } from "../../../shared/components/data-table/data-table";
import { PaginationComponent } from "../../../shared/components/pagination/pagination";
import { StateView } from "../../../shared/components/state-view/state-view";
import { ModalComponent } from "../../../shared/components/modal/modal";
import { AdminTestimonialFormPage } from "../admin-testimonial-form-page/admin-testimonial-form-page";
import { AdminTestimonialDetailPage } from "../admin-testimonial-detail-page/admin-testimonial-detail-page";

@Component({
  selector: 'app-admin-testimonial-list-page',
  imports: [PageHeaderComponent, SearchBarComponent, Loading, DataTableComponent, PaginationComponent, StateView, ModalComponent, AdminTestimonialFormPage, AdminTestimonialDetailPage],
  templateUrl: './admin-testimonial-list-page.html',
  styleUrl: './admin-testimonial-list-page.scss',
})
export class AdminTestimonialListPage implements OnInit, OnDestroy {
  testimonials: Testimonial[] = [];

  loading = true;
  search = '';
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  searchValue = '';
  show_modal = false;
  show_detail = false;

  selected?: Testimonial;

  columns: TableColumn[] = [
    {
      field: 'name',
      label: 'Nom',
    },

    {
      field: 'role',
      label: 'Fonction',
    },

    {
      field: 'message',
      label: 'Message',
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
    private api: TestimonialApi,
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
          this.testimonials = response.data.data;
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

  edit(testimonial: Testimonial) {
    this.selected = testimonial;
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

  delete(testimonial: Testimonial) {
    if (!confirm(`Supprimer le produit "${testimonial.name}" ?`)) {
      return;
    }

    this.api.delete(testimonial.id).subscribe({
      next: () => {
        this.toast.success('Produit supprimé');
        this.load();
      },
      error: () => {
        this.toast.error('Erreur suppression');
      },
    });
  }

  detail(testimonial: Testimonial) {
    this.selected = testimonial;
    this.show_detail = true;
  }
}
