import { Component } from '@angular/core';

import { Footer } from './footer/footer';
import { Navbar } from './navbar/navbar';

import { HomePage } from '../../features/home/home-page';
import { ContactPage } from '../../features/contact/contact-page';

import { ServiceListPage } from '../../features/services/service-list-page/service-list-page';
import { ProjectListPage } from '../../features/projects/project-list-page/project-list-page';
import { ProductListPage } from '../../features/products/product-list-page/product-list-page';
import { ArticleListPage } from '../../features/articles/article-list-page/article-list-page';
import { TestimonialListPage } from '../../features/testimonials/testimonial-list-page/testimonial-list-page';
import { UserListPage } from '../../features/users/user-list-page/user-list-page';

import { GalleryViewerComponent } from '../../shared/components/gallery-viewer/gallery-viewer';
import { ArticleViewerComponent } from '../../shared/components/article-viewer/article-viewer';
import { ImageZoom } from '../../shared/components/image-zoom/image-zoom';

import { GalleryData } from '../../core/models/media';
import { Article } from '../../core/models/article';

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
    TestimonialListPage,
    UserListPage,

    GalleryViewerComponent,
    ArticleViewerComponent,
    ImageZoom,
  ],

  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {
  // =========================================================
  // GALLERY
  // =========================================================

  galleryOpen = false;

  selectedGallery: GalleryData | null = null;

  // =========================================================
  // ARTICLE
  // =========================================================

  selectedArticle: Article | null = null;

  articleViewerOpen = false;

  // =========================================================
  // IMAGE ZOOM
  // =========================================================

  selectedImage: string | null = null;

  selectedProductName = '';

  // =========================================================
  // GALLERY
  // =========================================================

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

  // =========================================================
  // ARTICLE
  // =========================================================

  openArticle(article: Article): void {
    this.selectedArticle = article;

    this.articleViewerOpen = true;

    document.body.style.overflow = 'hidden';
  }

  closeArticleViewer(): void {
    this.articleViewerOpen = false;

    this.selectedArticle = null;

    document.body.style.overflow = '';
  }

  // =========================================================
  // PRODUCT IMAGE ZOOM
  // =========================================================

  openImage(data: { image: string; title: string }): void {
    this.selectedImage = data.image;

    this.selectedProductName = data.title;

    document.body.style.overflow = 'hidden';
  }

  closeImage(): void {
    this.selectedImage = null;

    this.selectedProductName = '';

    document.body.style.overflow = '';
  }
}
