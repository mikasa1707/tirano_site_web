import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TestimonialApi } from '../../../core/api/testimonial.api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MediaApi } from '../../../core/api/media.api';
import { FormField } from '../../../core/models/form-field';
import { Media } from '../../../core/models/media';
import { Testimonial } from '../../../core/models/testimonial';
import { ToastService } from '../../../core/services/toast';
import { FormBuilderComponent } from "../../../shared/components/form-builder/form-builder";
import { Gallery } from "../../../shared/components/gallery/gallery";
import { FileSelector } from "../../../shared/components/file-selector/file-selector";

@Component({
  selector: 'app-admin-testimonial-form-page',
  imports: [FormBuilderComponent, Gallery, FileSelector],
  templateUrl: './admin-testimonial-form-page.html',
  styleUrl: './admin-testimonial-form-page.scss',
})
export class AdminTestimonialFormPage implements OnChanges {
  @Input() testimonial?: Testimonial;

  @Output()
  saved = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  mediaFiles: File[] = [];
  medias: any[] = [];

  fields: FormField[] = [
    {
      key: 'name',
      label: 'Nom',
      type: 'text',
      required: true,
      col: 6,
    },

    {
      key: 'role',
      label: 'Fonction / Société',
      type: 'text',
      col: 6,
    },

    {
      key: 'message',
      label: 'Témoignage',
      type: 'editor',
      col: 12,
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
    private api: TestimonialApi,
    private mediaApi: MediaApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      role: [''],
      message: ['', Validators.required],
      active: [true],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['testimonial'] && this.testimonial) {
      this.form.patchValue(this.testimonial);
      this.medias = this.testimonial.medias ?? [];
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

    const request = this.testimonial
      ? this.api.update(this.testimonial.id, this.form.value)
      : this.api.create(this.form.value);

    request.subscribe({
      next: (response: any) => {
        const testimonial = response.data?.data ?? response.data;
        this.toast.success('Testimonial créer avec succés');
        if (this.mediaFiles.length > 0) {
          this.mediaApi.upload('projects', testimonial.id, this.mediaFiles).subscribe({
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
        this.toast.error('Testimonial non enregistré');
        this.loading = false;
      },
    });
  }

  private finishSave() {
    this.toast.success(this.testimonial ? 'Testimonial modifié' : 'Testimonial ajouté');
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
