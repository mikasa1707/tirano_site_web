import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ProductApi } from '../../../core/api/product.api';
import { Product } from '../../../core/models/product';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { Loading } from "../../../shared/components/loading/loading";
import { ApiService } from '../../../core/api/api.service';

@Component({
  selector: 'app-product-list-page',
  standalone: true,

  imports: [CommonModule, PaginationComponent, Loading],

  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss',
})
export class ProductListPage implements OnInit {
  // =========================================================
  // PRODUCTS
  // =========================================================

  products: Product[] = [];

  loading = false;

  // =========================================================
  // PAGINATION
  // =========================================================

  page = 1;

  limit = 12;

  total = 0;

  totalPages = 1;

  // =========================================================
  // IMAGE ZOOM EVENT
  // =========================================================

  @Output()
  imageZoom = new EventEmitter<{
    image: string;
    title: string;
    prix: string;
  }>();

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private readonly productApi: ProductApi,
    private readonly cdr: ChangeDetectorRef,
    public readonly api: ApiService,
  ) {}

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.load();
  }

  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  load(): void {
    this.loading = true;

    this.productApi
      .findAll({
        page: this.page,
        limit: this.limit,
        sortBy: 'created_at',
        sortOrder: 'DESC',
      })
      .subscribe({
        next: (response: any) => {
          /*
           * Structure backend :
           *
           * response.data.data
           * response.data.meta
           */

          const data = response?.data;

          this.products = (data?.data ?? []).filter((product: Product) => product.active !== false);

          // ===================================================
          // PAGINATION
          // ===================================================

          this.total = data?.meta?.total ?? 0;

          this.totalPages = (data?.meta?.totalPages ?? Math.ceil(this.total / this.limit)) || 1;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Erreur lors du chargement des produits', error);

          this.products = [];

          this.total = 0;

          this.totalPages = 1;

          this.loading = false;

          this.cdr.detectChanges();
        },
      });
  }

  // =========================================================
  // CHANGE PAGE
  // =========================================================

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    if (page === this.page) {
      return;
    }

    this.page = page;

    this.load();
  }

  // =========================================================
  // MEDIA URL
  // =========================================================

  getMediaUrl(media: any): string {
    if (!media) {
      return this.defaultImage;
    }

    if (media.url) {
      return this.api.backend_url + media.url;
    }

    if (media.path) {
      return media.path;
    }

    if (media.filename) {
      return media.filename;
    }

    return this.defaultImage;
  }

  // =========================================================
  // DEFAULT IMAGE
  // =========================================================

  get defaultImage(): string {
    return 'assets/images/default-product.jpg';
  }

  // =========================================================
  // IMAGE ERROR
  // =========================================================

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    if (image.src.endsWith(this.defaultImage)) {
      return;
    }

    image.src = this.defaultImage;
  }

  // =========================================================
  // OPEN PRODUCT IMAGE
  // =========================================================

  openImage(product: Product): void {
    if (!product.medias?.length) {
      return;
    }

    const image = this.getMediaUrl(product.medias[0]);

    this.imageZoom.emit({
      image,
      title: product.name,
      prix: 'Ar ' + product.price,
    });
  }
}
