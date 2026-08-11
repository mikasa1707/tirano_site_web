import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';

import { ProjectApi } from '../../../core/api/project.api';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { GalleryData, Media, GalleryMedia } from '../../../core/models/media';
import { Project } from '../../../core/models/project';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-list-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-list-page.html',
  styleUrl: './project-list-page.scss',
})
export class ProjectListPage implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];

  showAllProjects = false;
  readonly initialProjectLimit = 5;

  activeFilter: 'ALL' | 'EN_COURS' | 'TERMINE' | 'A_VENIR' = 'ALL';

  projectColumns: Project[][] = [[], [], []];

  private readonly cardHeights = [380, 420, 460, 500, 540, 580, 620];
  private readonly projectHeights = new Map<number, number>();

  @Output() galleryOpen = new EventEmitter();

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
          this.prepareProjectHeights();
          this.applyFilter();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erreur chargement projets', error);
          this.projects = [];
          this.filteredProjects = [];
          this.projectColumns = [[], [], []];
        },
      });
  }

  private prepareProjectHeights(): void {
    for (const project of this.projects) {
      if (this.projectHeights.has(project.id)) {
        continue;
      }

      const index = Math.abs(project.id) % this.cardHeights.length;
      this.projectHeights.set(project.id, this.cardHeights[index]);
    }
  }

  getProjectCardHeight(project: Project): number {
    if (!this.projectHeights.has(project.id)) {
      const index = Math.abs(project.id) % this.cardHeights.length;
      this.projectHeights.set(project.id, this.cardHeights[index]);
    }

    return this.projectHeights.get(project.id) ?? 460;
  }

  private buildProjectColumns(): void {
    const projectsToDisplay = this.showAllProjects
      ? this.filteredProjects
      : this.filteredProjects.slice(0, this.initialProjectLimit);

    const columns: Project[][] = [[], [], []];
    const columnHeights = [0, 0, 0];

    for (const project of projectsToDisplay) {
      const height = this.getProjectCardHeight(project);

      let columnIndex = 0;

      for (let i = 1; i < columnHeights.length; i++) {
        if (columnHeights[i] < columnHeights[columnIndex]) {
          columnIndex = i;
        }
      }

      columns[columnIndex].push(project);
      columnHeights[columnIndex] += height + 24;
    }

    this.projectColumns = columns;
  }

  setFilter(
    filter: 'ALL' | 'EN_COURS' | 'TERMINE' | 'A_VENIR',
  ): void {
    this.activeFilter = filter;
    this.showAllProjects = false;
    this.applyFilter();
  }

  showMoreProjects(): void {
    this.showAllProjects = true;
    this.buildProjectColumns();
  }

  showLessProjects(): void {
    this.showAllProjects = false;
    this.buildProjectColumns();
  }

  private applyFilter(): void {
    if (this.activeFilter === 'ALL') {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(
        (project) => project.status === this.activeFilter,
      );
    }

    this.buildProjectColumns();
  }

  isFilterActive(
    filter: 'ALL' | 'EN_COURS' | 'TERMINE' | 'A_VENIR',
  ): boolean {
    return this.activeFilter === filter;
  }

  openGallery(
    title: string,
    description: string,
    medias?: Media[],
  ): void {
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

  private getMediaType(
    media: Media,
  ): 'IMAGE' | 'VIDEO' | 'PDF' | 'DOCUMENT' {
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

  getProjectImage(project: Project): string {
    const image = project.medias?.find((media: Media) => {
      const type = media.type ?? '';
      return type.startsWith('image/');
    });

    return image?.url ?? 'assets/images/default-project.png';
  }

  hasMedia(project: Project): boolean {
    return !!project.medias?.length;
  }

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