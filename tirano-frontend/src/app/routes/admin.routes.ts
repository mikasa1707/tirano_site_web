import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth-guard';
import { AdminLayoutComponent } from '../layout/admin/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin',

    component: AdminLayoutComponent,

    canActivate: [authGuard],

    children: [
      {
        path: '',
        loadComponent: () =>
          import('../features/dashboard/dashboard-page').then(
            (m) => m.DashboardPage,
          ),
      },

      {
        path: 'users',

        loadComponent: () =>
          import('../features/users/user-list-page/user-list-page').then(
            (m) => m.UserListPage,
          ),
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
        path: 'messages',

        loadComponent: () =>
          import('../features/messages/admin-message-list-page/admin-message-list-page').then(
            (m) => m.AdminMessageListPage,
          ),
      },

      {
        path: 'testimonials',

        loadComponent: () =>
          import('../features/testimonials/admin-testimonial-list-page/admin-testimonial-list-page').then(
            (m) => m.AdminTestimonialListPage,
          ),
      },

      {
        path: 'settings',

        loadComponent: () =>
          import('../features/settings/settings-page').then(
            (m) => m.SettingsPage,
          ),
      },
    ],
  },
];
