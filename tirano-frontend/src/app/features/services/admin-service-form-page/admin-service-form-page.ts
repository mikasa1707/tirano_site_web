import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Service } from '../../../core/models/service';
import { FormBuilderComponent } from '../../../shared/components/form-builder/form-builder';
import { FormField } from '../../../core/models/form-field';
import { ServiceApi } from '../../../core/api/service.api';
import { ToastService } from '../../../core/services/toast';
import { FileSelector } from '../../../shared/components/file-selector/file-selector';
import { Gallery } from '../../../shared/components/gallery/gallery';
import { Media } from '../../../core/models/media';
import { MediaApi } from '../../../core/api/media.api';

@Component({
  selector: 'app-admin-service-form-page',
  standalone: true,
  imports: [FormBuilderComponent, FileSelector, Gallery],
  templateUrl: './admin-service-form-page.html',
})
export class AdminServiceFormPage implements OnChanges {
  @Input() service?: Service;

  @Output()
  saved = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  mediaFiles: File[] = [];
  medias: any[] = [];

  fields: FormField[] = [
    {
      key: 'title',
      label: 'Nom',
      type: 'text',
      required: true,
      col: 6,
    },

    {
      key: 'shortDescription',
      label: 'Description courte',
      type: 'text',
      col: 6,
    },

    {
      key: 'description',
      label: 'Description',
      type: 'editor',
      col: 6,
    },

    {
      key: 'active',
      label: 'Actif',
      type: 'checkbox',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private api: ServiceApi,
    private mediaApi: MediaApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],

      shortDescription: [''],

      description: [''],

      active: [true],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['service'] && this.service) {
      this.form.patchValue(this.service);
      this.medias = this.service.medias ?? [];
      this.cdr.detectChanges();
    }
  }

  uploadMedia(files: File[]) {
    this.mediaFiles = files;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.loading = true;

    const request = this.service
      ? this.api.update(this.service.id, this.form.value)
      : this.api.create(this.form.value);

    request.subscribe({
      next: (response: any) => {
        const service = response.data?.data ?? response.data;
        this.toast.success('Service créer avec succés');
        if (this.mediaFiles.length > 0) {
          this.mediaApi.upload('site-services', service.id, this.mediaFiles).subscribe({
            next: () => {
              this.finishSave();
            },

            error: () => {
              this.toast.error('Media non enregistré');
              this.loading = false;
            },
          });
        } else {
          this.finishSave();
        }
      },

      error: () => {
        this.toast.error('Service non enregistré');
        this.loading = false;
      },
    });
  }

  private finishSave() {
    this.toast.success(this.service ? 'Service modifié' : 'Service ajouté');
    this.saved.emit();
    this.loading = false;
    this.cdr.detectChanges();
    this.mediaFiles = [];
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
