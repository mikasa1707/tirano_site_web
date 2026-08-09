import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';

import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { Setting } from '../../../core/models/setting';

@Component({
  selector: 'app-public-navbar',
  standalone: true,

  imports: [RouterLink],

  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements AfterViewInit, OnDestroy, OnInit {
  activeSection = 'accueil';
  setting?: Setting;

  private observer?: IntersectionObserver;

  constructor(
    public readonly siteSettings: SiteSettingsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.siteSettings.load().subscribe({
      next: (response: any) => {
        this.setting = response.data;
        this.cdr.detectChanges();

        console.log('Settings Home:', this.setting);
      },

      error: (error) => {
        console.error('Erreur chargement configuration du site', error);
      },
    });
  }

  ngAfterViewInit(): void {
    const sections = document.querySelectorAll('main section[id]');

    if (!sections.length) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          this.activeSection = visible[0].target.id;
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],

        rootMargin: '-90px 0px -25% 0px',
      },
    );

    sections.forEach((section) => {
      this.observer?.observe(section);
    });
  }

  scrollTo(section: string, event: Event): void {
    event.preventDefault();

    const element = document.getElementById(section);

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    this.activeSection = section;

    /*
     * Fermer le menu Bootstrap sur mobile
     */
    const navbar = document.getElementById('publicNavbar');

    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }

  isActive(section: string): boolean {
    return this.activeSection === section;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
