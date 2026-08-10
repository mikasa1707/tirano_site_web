import { Component } from '@angular/core';
import { Footer } from './footer/footer';
import { Navbar } from './navbar/navbar';
import { HomePage } from '../../features/home/home-page';
import { ContactPage } from '../../features/contact/contact-page';
import { ServiceListPage } from '../../features/services/service-list-page/service-list-page';
import { ProjectListPage } from '../../features/projects/project-list-page/project-list-page';
import { ProductListPage } from '../../features/products/product-list-page/product-list-page';
import { ArticleListPage } from '../../features/articles/article-list-page/article-list-page';
import { GalleryViewerComponent } from '../../shared/components/gallery-viewer/gallery-viewer';
import { GalleryData } from '../../core/models/media';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    Navbar,
    Footer,
    HomePage,
    ContactPage,
    ServiceListPage,
    ProjectListPage,
    ProductListPage,
    ArticleListPage,
    GalleryViewerComponent,
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {
  galleryOpen = false;

  selectedGallery: GalleryData | null = null;

  openGallery(gallery: GalleryData): void {
    this.selectedGallery = gallery;

    this.galleryOpen = true;

    document.body.classList.add('gallery-open');
  }

  closeGallery(): void {
    this.galleryOpen = false;

    this.selectedGallery = null;

    document.body.classList.remove('gallery-open');
  }
}
