import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-testimonial-list-page',
  imports: [],
  templateUrl: './admin-testimonial-list-page.html',
  styleUrl: './admin-testimonial-list-page.scss',
})
export class AdminTestimonialListPage  implements OnInit, OnDestroy {
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

