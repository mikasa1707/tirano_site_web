import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Service } from '../../../core/models/service';
import { FormBuilderComponent } from '../../../shared/components/form-builder/form-builder';
import { FormField } from '../../../core/models/form-field';
import { ServiceApi } from '../../../core/api/service.api';
import { ToastService } from '../../../core/services/toast';
import { FileSelector } from '../../../shared/components/file-selector/file-selector';

@Component({
  selector: 'app-admin-service-form-page',
  standalone: true,
  imports: [FormBuilderComponent, FileSelector],
  templateUrl: './admin-service-form-page.html',
})
export class AdminServiceFormPage implements OnChanges {
  @Input()
  service?: Service;

  @Output()
  saved = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  imageFile?: File;

  uploadMedia(file: File) {
    this.imageFile = file;
  }

  fields: FormField[] = [
    {
      key: 'title',
      label: 'Nom',
      type: 'text',
      required: true,
    },

    {
      key: 'shortDescription',
      label: 'Description courte',
      type: 'textarea',
    },

    {
      key: 'description',
      label: 'Description',
      type: 'editor',
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
    private toast: ToastService,
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
    }
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
        const service = response.data;
        if (this.imageFile) {
          this.api.uploadMedia(service.id, this.imageFile).subscribe({
            next: () => {
              this.finishSave();
            },
            error: () => {
              this.loading = false;
            },
          });
        } else {
          this.finishSave();
        }
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private finishSave() {
    this.toast.success(this.service ? 'Service modifié' : 'Service ajouté');
    this.saved.emit();
    this.loading = false;
  }
}
