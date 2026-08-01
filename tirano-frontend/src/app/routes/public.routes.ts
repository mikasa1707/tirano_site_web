import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../features/home/home-page').then((m) => m.HomePage),
  },

  {
    path: 'services',
    loadComponent: () =>
      import('../features/services/service-list-page/service-list-page').then(
        (m) => m.ServiceListPage,
      ),
  },

  {
    path: 'projects',
    loadComponent: () =>
      import('../features/projects/project-list-page/project-list-page').then(
        (m) => m.ProjectListPage,
      ),
  },

  {
    path: 'products',
    loadComponent: () =>
      import('../features/products/product-list-page/product-list-page').then(
        (m) => m.ProductListPage,
      ),
  },

  {
    path: 'articles',
    loadComponent: () =>
      import('../features/articles/article-list-page/article-list-page').then(
        (m) => m.ArticleListPage,
      ),
  },

  {
    path: 'contact',
    loadComponent: () =>
      import('../features/contact/contact-page').then((m) => m.ContactPage),
  },
];
