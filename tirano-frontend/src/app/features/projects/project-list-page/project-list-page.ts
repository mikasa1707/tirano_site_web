import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ProjectApi } from '../../../core/api/project.api';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

import { GalleryData, Media, GalleryMedia } from '../../../core/models/media';

import { Project } from '../../../core/models/project';

@Component({
  selector: 'app-project-list-page',
  standalone: true,
  imports: [],
  templateUrl: './project-list-page.html',
  styleUrl: './project-list-page.scss',
})
export class ProjectListPage implements OnInit {
  projects: Project[] = [];

  filteredProjects: Project[] = [];

  activeFilter: 'ALL' | 'EN_COURS' | 'TERMINE' | 'A_VENIR' = 'ALL';

  @Output()
  galleryOpen = new EventEmitter<GalleryData>();

  selectedGallery: GalleryData | null = null;

  constructor(
    private readonly projectApi: ProjectApi,
    private readonly cdr: ChangeDetectorRef,
    public readonly settings: SiteSettingsService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.projectApi
      .findAll({
        sortBy: 'created_at',
        sortOrder: 'DESC',
      })
      .subscribe({
        next: (response: any) => {
          this.projects = response.data?.data ?? [];

          this.applyFilter();

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Erreur chargement projets', error);

          this.projects = [];
          this.filteredProjects = [];
        },
      });
  }

  /**
   * Change le filtre.
   */
  setFilter(filter: 'ALL' | 'EN_COURS' | 'TERMINE' | 'A_VENIR'): void {
    this.activeFilter = filter;

    this.applyFilter();
  }

  /**
   * Applique le filtre actif.
   */
  private applyFilter(): void {
    if (this.activeFilter === 'ALL') {
      this.filteredProjects = [...this.projects];
      return;
    }

    this.filteredProjects = this.projects.filter((project) => project.status === this.activeFilter);
  }

  /**
   * Vérifie si un filtre est actif.
   */
  isFilterActive(filter: 'ALL' | 'EN_COURS' | 'TERMINE' | 'A_VENIR'): boolean {
    return this.activeFilter === filter;
  }

  /**
   * Ouvre la galerie d'un projet.
   */
  openGallery(title: string, description: string, medias?: Media[]): void {
    if (!medias?.length) {
      return;
    }

    const galleryMedias: GalleryMedia[] = medias.map((media) => ({
      id: media.id,
      url: media.url,
      type: this.getMediaType(media),
      originalName: media.title ?? media.filename ?? '',
    }));

    this.galleryOpen.emit({
      title,
      description,
      medias: galleryMedias,
    });
  }

  /**
   * Détermine le type du média.
   */
  private getMediaType(media: Media): 'IMAGE' | 'VIDEO' | 'PDF' | 'DOCUMENT' {
    const mimeType = media.type ?? '';

    if (mimeType.startsWith('image/')) {
      return 'IMAGE';
    }

    if (mimeType.startsWith('video/')) {
      return 'VIDEO';
    }

    const filename = media.filename ?? '';

    if (filename.toLowerCase().endsWith('.pdf')) {
      return 'PDF';
    }

    return 'DOCUMENT';
  }

  /**
   * Image principale du projet.
   */
  getProjectImage(project: Project): string {
    const image = project.medias?.find((media: Media) => {
      const type = media.type ?? '';

      return type.startsWith('image/');
    });

    return image?.url ?? 'assets/images/default-project.png';
  }

  /**
   * Vérifie si le projet possède des médias.
   */
  hasMedia(project: Project): boolean {
    return !!project.medias?.length;
  }

  /**
   * Label du statut.
   */
  getStatusLabel(status: string): string {
    switch (status) {
      case 'EN_COURS':
        return 'En cours';

      case 'TERMINE':
        return 'Terminé';

      case 'A_VENIR':
        return 'À venir';

      default:
        return status;
    }
  }

  /**
   * Classe Bootstrap du badge.
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'EN_COURS':
        return 'text-bg-warning';

      case 'TERMINE':
        return 'text-bg-success';

      case 'A_VENIR':
        return 'text-bg-info';

      default:
        return 'text-bg-secondary';
    }
  }
}
