import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ProjectApi } from '../../../core/api/project.api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MediaApi } from '../../../core/api/media.api';
import { FormField } from '../../../core/models/form-field';
import { Media } from '../../../core/models/media';
import { Project } from '../../../core/models/project';
import { ToastService } from '../../../core/services/toast';
import { Gallery } from '../../../shared/components/gallery/gallery';
import { FileSelector } from '../../../shared/components/file-selector/file-selector';
import { FormBuilderComponent } from '../../../shared/components/form-builder/form-builder';

@Component({
  selector: 'app-admin-project-form-page',
  imports: [Gallery, FileSelector, FormBuilderComponent],
  templateUrl: './admin-project-form-page.html',
  styleUrl: './admin-project-form-page.scss',
})
export class AdminProjectFormPage implements OnChanges {
  @Input() project?: Project;

  @Output()
  saved = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  mediaFiles: File[] = [];
  medias: any[] = [];

  fields: FormField[] = [
    {
      key: 'title',
      label: 'Titre',
      type: 'text',
      required: true,
      col: 6,
    },

    {
      key: 'description',
      label: 'Description',
      type: 'editor',
      col: 12,
    },

    {
      key: 'client',
      label: 'Client',
      type: 'text',
      col: 6,
    },

    {
      key: 'location',
      label: 'Localisation',
      type: 'text',
      col: 6,
    },

    {
      key: 'realizationDate',
      label: 'Date de réalisation',
      type: 'date',
      col: 6,
    },

    {
      key: 'active',
      label: 'Actif',
      type: 'checkbox',
      col: 6,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private api: ProjectApi,
    private mediaApi: MediaApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],

      description: ['', Validators.required],

      client: [''],

      location: [''],

      realizationDate: [null],

      active: [true],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && this.project) {
      this.form.patchValue(this.project);
      this.medias = this.project.medias ?? [];
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

    const request = this.project
      ? this.api.update(this.project.id, this.form.value)
      : this.api.create(this.form.value);

    request.subscribe({
      next: (response: any) => {
        const project = response.data?.data ?? response.data;
        this.toast.success('Project créer avec succés');
        if (this.mediaFiles.length > 0) {
          this.mediaApi.upload('projects', project.id, this.mediaFiles).subscribe({
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
        this.toast.error('Project non enregistré');
        this.loading = false;
      },
    });
  }

  private finishSave() {
    this.toast.success(this.project ? 'Project modifié' : 'Project ajouté');
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
