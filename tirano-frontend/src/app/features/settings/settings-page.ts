import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SettingApi } from '../../core/api/settings.api';
import { Setting } from '../../core/models/setting';
import { ToastService } from '../../core/services/toast';
import { FileSelector } from '../../shared/components/file-selector/file-selector';
import { FormBuilderComponent } from '../../shared/components/form-builder/form-builder';
import { Gallery } from '../../shared/components/gallery/gallery';
import { FormField } from '../../core/models/form-field';

@Component({
  selector: 'app-admin-setting-page',
  standalone: true,
  imports: [ReactiveFormsModule, FormBuilderComponent, FileSelector, Gallery],
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
        console.log(this.setting)
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
      key: 'address',
      label: 'Adresse',
      type: 'text',
      col: 12,
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
      col: 6,
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
}
