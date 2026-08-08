import { Component } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  menus: MenuItem[] = [
    // {
    //   label: 'Dashboard',
    //   icon: 'fa-solid fa-gauge',
    //   link: '/admin',
    // },

    {
      label: 'Utilisateurs',
      icon: 'fa-solid fa-users',
      link: '/admin/users',
    },

    {
      label: 'Services',
      icon: 'fa-solid fa-screwdriver-wrench',
      link: '/admin/services',
    },

    {
      label: 'Projets',
      icon: 'fa-solid fa-diagram-project',
      link: '/admin/projects',
    },

    {
      label: 'Produits',
      icon: 'fa-solid fa-box',
      link: '/admin/products',
    },

    {
      label: 'Articles',
      icon: 'fa-solid fa-newspaper',
      link: '/admin/articles',
    },

    {
      label: 'Témoignages',
      icon: 'fa-solid fa-comments',
      link: '/admin/testimonials',
    },

    {
      label: 'Messages',
      icon: 'fa-solid fa-envelope',
      link: '/admin/messages',
    },

    {
      label: 'Paramètres',
      icon: 'fa-solid fa-gears',
      link: '/admin/settings',
    },
  ];
}
