import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { TableColumn } from '../../../core/models/table-column';
import { ToastService } from '../../../core/services/toast';
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header";
import { SearchBarComponent } from "../../../shared/components/search-bar/search-bar";
import { Loading } from "../../../shared/components/loading/loading";
import { PaginationComponent } from "../../../shared/components/pagination/pagination";
import { DataTableComponent } from "../../../shared/components/data-table/data-table";
import { StateView } from "../../../shared/components/state-view/state-view";
import { ModalComponent } from "../../../shared/components/modal/modal";
import { ArticleApi } from '../../../core/api/article.api';
import { AdminArticleFormPage } from "../admin-article-form-page/admin-article-form-page";
import { AdminArticleDetailPage } from "../admin-article-detail-page/admin-article-detail-page";
import { Article } from '../../../core/models/article';

@Component({
  selector: 'app-admin-article-list-page',
  imports: [PageHeaderComponent, SearchBarComponent, Loading, PaginationComponent, DataTableComponent, StateView, ModalComponent, AdminArticleFormPage, AdminArticleDetailPage],
  templateUrl: './admin-article-list-page.html',
  styleUrl: './admin-article-list-page.scss',
})
export class AdminArticleListPage implements OnInit, OnDestroy {
  articles: Article[] = [];

  loading = true;
  search = '';
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  searchValue = '';
  show_modal = false;
  show_detail = false;

  selected?: Article;

  columns: TableColumn[] = [
    {
      field: 'title',
      label: 'Titre',
    },

    {
      field: 'type',
      label: 'Type',
    },

    {
      field: 'publishedAt',
      label: 'Publication',
      type: 'date',
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
    private api: ArticleApi,
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
          this.articles = response.data.data;
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

  edit(project: Article) {
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

  delete(project: Article) {
    if (!confirm(`Supprimer le project "${project.title}" ?`)) {
      return;
    }

    this.api.delete(project.id).subscribe({
      next: () => {
        this.toast.success('Article supprimé');
        this.load();
      },
      error: () => {
        this.toast.error('Erreur suppression');
      },
    });
  }

  detail(project: Article) {
    this.selected = project;
    this.show_detail = true;
  }
}
