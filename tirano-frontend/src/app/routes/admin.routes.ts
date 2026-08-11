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
          import('../features/users/admin-user-list-page/user-list-page').then(
            (m) => m.UserListPage,
          ),
      },

      {
        path: 'services',

        loadComponent: () =>
          import('../features/services/admin-service-list-page/admin-service-list-page').then(
            (m) => m.AdminServiceListPage,
          ),
      },

      {
        path: 'projects',

        loadComponent: () =>
          import('../features/projects/admin-project-list-page/admin-project-list-page').then(
            (m) => m.AdminProjectListPage,
          ),
      },

      {
        path: 'products',

        loadComponent: () =>
          import('../features/products/admin-product-list-page/admin-product-list-page').then(
            (m) => m.AdminProductListPage,
          ),
      },

      {
        path: 'articles',

        loadComponent: () =>
          import('../features/articles/admin-article-list-page/admin-article-list-page').then(
            (m) => m.AdminArticleListPage,
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
