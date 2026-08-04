import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectApi } from '../../../core/api/project.api';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Project } from '../../../core/models/project';
import { TableColumn } from '../../../core/models/table-column';
import { ToastService } from '../../../core/services/toast';
import { StateView } from '../../../shared/components/state-view/state-view';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { DataTableComponent } from '../../../shared/components/data-table/data-table';
import { Loading } from '../../../shared/components/loading/loading';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { AdminProjectFormPage } from '../admin-project-form-page/admin-project-form-page';
import { AdminProjectDetailPage } from '../admin-project-detail-page/admin-project-detail-page';

@Component({
  selector: 'app-admin-project-list-page',
  imports: [
    StateView,
    PaginationComponent,
    DataTableComponent,
    Loading,
    SearchBarComponent,
    PageHeaderComponent,
    ModalComponent,
    AdminProjectFormPage,
    AdminProjectDetailPage,
  ],
  templateUrl: './admin-project-list-page.html',
  styleUrl: './admin-project-list-page.scss',
})
export class AdminProjectListPage implements OnInit, OnDestroy {
  projects: Project[] = [];

  loading = true;
  search = '';
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  searchValue = '';
  show_modal = false;
  show_detail = false;

  selected?: Project;

  columns: TableColumn[] = [
    {
      field: 'title',
      label: 'Titre',
    },

    {
      field: 'client',
      label: 'Client',
    },

    {
      field: 'location',
      label: 'Localisation',
    },

    {
      field: 'realizationDate',
      label: 'Date réalisation',
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
    private api: ProjectApi,
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
          this.projects = response.data.data;
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

  edit(project: Project) {
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

  delete(project: Project) {
    if (!confirm(`Supprimer le project "${project.title}" ?`)) {
      return;
    }

    this.api.delete(project.id).subscribe({
      next: () => {
        this.toast.success('Project supprimé');
        this.load();
      },
      error: () => {
        this.toast.error('Erreur suppression');
      },
    });
  }

  detail(project: Project) {
    this.selected = project;
    this.show_detail = true;
  }
}
