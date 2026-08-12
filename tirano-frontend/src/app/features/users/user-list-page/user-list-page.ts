import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../../../core/models/user';
import { UserApi } from '../../../core/api/user.api';
import { GalleryData, Media, GalleryMedia } from '../../../core/models/media';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

@Component({
  selector: 'app-user-list-page',
  imports: [],
  templateUrl: './user-list-page.html',
  styleUrl: './user-list-page.scss',
})
export class UserListPage implements OnInit {
  users?: User[] = [];

  @Output()
  galleryOpen = new EventEmitter<GalleryData>();

  selectedGallery: GalleryData | null = null;

  constructor(
    private userApi: UserApi,
    private cdr: ChangeDetectorRef,
    public readonly settings: SiteSettingsService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.userApi
      .findAll({
        limit:1000,
        sortBy: 'created_at',
        sortOrder: 'DESC',
      })
      .subscribe({
        next: (response: any) => {
          const users = response.data.data ?? [];

          this.users = users.filter((user: any) => user.role !== 'ADMIN');

          console.log(this.users);
          this.cdr.detectChanges();
        },

        error: () => {},
      });
  }

  openGallery(title: string, description: string, medias?: Media[]): void {
    if (!medias?.length) {
      return;
    }

    const galleryMedias: GalleryMedia[] = medias.map((media) => ({
      id: media.id,
      url: media.url,
      type: media.type,
      originalName: media.filename,
    }));

    this.galleryOpen.emit({
      title,
      description,
      medias: galleryMedias,
    });
  }

  getUserImage(user: User): string {
    return this.settings.getImage(user.medias?.[0]?.url, 'user');
  }
}
