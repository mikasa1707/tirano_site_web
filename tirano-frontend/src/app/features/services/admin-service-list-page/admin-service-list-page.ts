import { ChangeDetectorRef, Component, OnInit, Service } from '@angular/core';
import { ServiceApi } from '../../../core/api/service.api';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { StateView } from "../../../shared/components/state-view/state-view";
import { DataTableComponent } from "../../../shared/components/data-table/data-table";
import { Loading } from "../../../shared/components/loading/loading";
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header";
import { SearchBarComponent } from "../../../shared/components/search-bar/search-bar";

@Component({
  selector: 'app-admin-service-list-page',
  standalone: true,
  imports: [PaginationComponent, StateView, DataTableComponent, Loading, PageHeaderComponent, SearchBarComponent],
  templateUrl: './admin-service-list-page.html',
})
export class AdminServiceListPage implements OnInit {
  services: Service[] = [];

  loading = true;
  search = '';
  page = 1;
  limit = 10;
  total = 0;

  constructor(private serviceApi: ServiceApi, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;

    this.serviceApi.findAll().subscribe({
      next: (response: any) => {
        this.services = response.data ?? response;
        this.total = response.total ?? this.services.length;
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

  edit(service: Service) {
    console.log('edit', service);
  }

  detail(service: Service) {
    console.log('detail', service);
  }

  delete(service: Service) {
    console.log('delete', service);
  }
}
