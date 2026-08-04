import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ProductApi } from '../../../core/api/product.api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MediaApi } from '../../../core/api/media.api';
import { FormField } from '../../../core/models/form-field';
import { Media } from '../../../core/models/media';
import { Product } from '../../../core/models/product';
import { ToastService } from '../../../core/services/toast';
import { FormBuilderComponent } from '../../../shared/components/form-builder/form-builder';
import { Gallery } from '../../../shared/components/gallery/gallery';
import { FileSelector } from '../../../shared/components/file-selector/file-selector';

@Component({
  selector: 'app-admin-product-form-page',
  imports: [FormBuilderComponent, Gallery, FileSelector],
  templateUrl: './admin-product-form-page.html',
  styleUrl: './admin-product-form-page.scss',
})
export class AdminProductFormPage implements OnChanges {
  @Input() product?: Product;

  @Output()
  saved = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  mediaFiles: File[] = [];
  medias: any[] = [];

  fields: FormField[] = [
    {
      key: 'name',
      label: 'Nom du produit',
      type: 'text',
      required: true,
      col: 6,
    },

    {
      key: 'reference',
      label: 'Référence',
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
      key: 'price',
      label: 'Prix',
      type: 'number',
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
    private api: ProductApi,
    private mediaApi: MediaApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      reference: [''],
      description: [''],
      price: [0],
      active: [true],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.form.patchValue(this.product);
      this.medias = this.product.medias ?? [];
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

    const request = this.product
      ? this.api.update(this.product.id, this.form.value)
      : this.api.create(this.form.value);

    request.subscribe({
      next: (response: any) => {
        const product = response.data?.data ?? response.data;
        this.toast.success('Produit créer avec succés');
        if (this.mediaFiles.length > 0) {
          this.mediaApi.upload('products', product.id, this.mediaFiles).subscribe({
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
        this.toast.error('Product non enregistré');
        this.loading = false;
      },
    });
  }

  private finishSave() {
    this.toast.success(this.product ? 'Product modifié' : 'Product ajouté');
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
