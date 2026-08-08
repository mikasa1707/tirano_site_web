import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SettingApi } from '../../core/api/settings.api';
import { Setting } from '../../core/models/setting';
import { ToastService } from '../../core/services/toast';
import { FileSelector } from '../../shared/components/file-selector/file-selector';
import { FormBuilderComponent } from '../../shared/components/form-builder/form-builder';
import { Gallery } from '../../shared/components/gallery/gallery';
import { FormField } from '../../core/models/form-field';
import { Media } from '../../core/models/media';
import { MediaApi } from '../../core/api/media.api';
import { PageHeaderComponent } from "../../shared/components/page-header/page-header";

@Component({
  selector: 'app-admin-setting-page',
  standalone: true,
  imports: [ReactiveFormsModule, FormBuilderComponent, FileSelector, Gallery, PageHeaderComponent],
  templateUrl: './settings-page.html',
})
export class SettingsPage implements OnInit {
  form!: FormGroup;
  setting?: Setting;
  medias: any[] = [];
  mediaFiles: File[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private api: SettingApi,
    private toast: ToastService,
    private mediaApi: MediaApi,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.initForm();

    this.load();
  }

  initForm() {
    this.form = this.fb.group({
      siteName: ['', Validators.required],

      description: [''],

      email: [''],

      phone: [''],

      address: [''],

      facebook: [''],

      instagram: [''],

      linkedin: [''],

      youtube: [''],

      maintenance: [false],
    });
  }

  load() {
    this.api.findOne().subscribe({
      next: (res: any) => {
        const data = res.data.data ?? res;
        this.setting = data;
        console.log(this.setting);
        this.form.patchValue(data);
        this.medias = data.medias ?? [];
        this.cdr.detectChanges();
      },
    });
  }

  fields: FormField[] = [
    {
      key: 'siteName',
      label: 'Nom du site',
      type: 'text',
      col: 6,
      required: true,
    },

    {
      key: 'address',
      label: 'Adresse',
      type: 'text',
      col: 6,
    },

    {
      key: 'description',
      label: 'Description',
      type: 'editor',
      col: 12,
    },

    {
      key: 'email',
      label: 'Email',
      type: 'email',
      col: 6,
    },

    {
      key: 'phone',
      label: 'Téléphone',
      type: 'text',
      col: 6,
    },

    {
      key: 'facebook',
      label: 'Facebook',
      type: 'text',
      col: 6,
    },

    {
      key: 'instagram',
      label: 'Instagram',
      type: 'text',
      col: 6,
    },

    {
      key: 'linkedin',
      label: 'LinkedIn',
      type: 'text',
      col: 6,
    },

    {
      key: 'youtube',
      label: 'Youtube',
      type: 'text',
      col: 6,
    },

    {
      key: 'maintenance',
      label: 'Maintenance',
      type: 'checkbox',
      col: 3,
    },
  ];

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.loading = true;

    this.api.update(this.form.value).subscribe({
      next: () => {
        this.toast.success('Paramètres enregistrés');

        if (this.mediaFiles.length) {
          this.uploadMedia();
        } else {
          this.loading = false;
        }
      },

      error: () => {
        this.toast.error('Erreur sauvegarde');

        this.loading = false;
      },
    });
  }

  uploadLogo(file: File) {
    this.api.uploadLogo(file).subscribe({
      next: () => {
        this.toast.success('Logo enregistré');

        this.load();
      },
    });
  }

  uploadFavicon(file: File) {
    this.api.uploadFavicon(file).subscribe({
      next: () => {
        this.toast.success('Favicon enregistré');

        this.load();
      },
    });
  }

  uploadFiles(files: File[]) {
    this.mediaFiles = files;
  }

  uploadMedia() {
    const form = new FormData();

    this.mediaFiles.forEach((file) => {
      form.append('files', file);
    });

    this.api.postMedia(form).subscribe({
      next: (res: any) => {
        this.toast.success('Médias ajoutés');

        this.mediaFiles = [];

        this.load();

        this.loading = false;
      },
    });
  }

  removeMedia(media: Media) {
    this.mediaApi.remove(media.id).subscribe({
      next: () => {
        this.medias = this.medias.filter((item) => item.id !== media.id);
        this.toast.success('Média supprimé');
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Erreur suppression média');
      },
    });
  }
}
