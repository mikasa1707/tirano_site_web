import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MediaApi } from '../../../core/api/media.api';
import { ProjectApi } from '../../../core/api/project.api';
import { Article, ARTICLE_TYPE_OPTIONS } from '../../../core/models/article';
import { FormField } from '../../../core/models/form-field';
import { Media } from '../../../core/models/media';
import { ToastService } from '../../../core/services/toast';
import { FileSelector } from '../../../shared/components/file-selector/file-selector';
import { Gallery } from '../../../shared/components/gallery/gallery';
import { FormBuilderComponent } from '../../../shared/components/form-builder/form-builder';
import { ArticleApi } from '../../../core/api/article.api';

@Component({
  selector: 'app-admin-article-form-page',
  imports: [FileSelector, Gallery, FormBuilderComponent],
  templateUrl: './admin-article-form-page.html',
  styleUrl: './admin-article-form-page.scss',
})
export class AdminArticleFormPage implements OnInit, OnChanges {
  @Input() article?: Article;

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
      key: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      col: 6,
    },

    {
      key: 'excerpt',
      label: 'Résumé',
      type: 'textarea',
      col: 12,
    },

    {
      key: 'content',
      label: 'Contenu',
      type: 'editor',
      col: 12,
    },

    {
      key: 'type',
      label: 'Type',
      type: 'select',
      col: 6,
      options: ARTICLE_TYPE_OPTIONS,
      optionLabel: 'label',
      optionValue: 'value',
    },

    {
      key: 'source',
      label: 'Source',
      type: 'text',
      col: 6,
    },

    {
      key: 'publishedAt',
      label: 'Date publication',
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
    private api: ArticleApi,
    private mediaApi: MediaApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      slug: [''],
      content: ['', Validators.required],
      excerpt: [''],
      type: ['NEWS'],
      source: [''],
      publishedAt: [null],
      active: [true],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['article'] && this.article) {
      this.form.patchValue(this.article);
      this.medias = this.article.medias ?? [];
      this.cdr.detectChanges();
    }
  }

  ngOnInit() {
    this.form.get('title')?.valueChanges.subscribe((value) => {
      this.form.patchValue(
        {
          slug: this.generateSlug(value),
        },
        {
          emitEvent: false,
        },
      );
    });
  }

  generateSlug(value: string): string {
    return (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
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

    const request = this.article
      ? this.api.update(this.article.id, this.form.value)
      : this.api.create(this.form.value);

    request.subscribe({
      next: (response: any) => {
        const article = response.data?.data ?? response.data;
        this.toast.success('Article créer avec succés');
        if (this.mediaFiles.length > 0) {
          this.mediaApi.upload('articles', article.id, this.mediaFiles).subscribe({
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
        this.toast.error('Article non enregistré');
        this.loading = false;
      },
    });
  }

  private finishSave() {
    this.toast.success(this.article ? 'Article modifié' : 'Article ajouté');
    this.saved.emit();
    this.form.reset();
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
