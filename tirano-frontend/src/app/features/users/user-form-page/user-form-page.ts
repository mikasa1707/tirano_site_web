import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../core/models/user';
import { Media } from '../../../core/models/media';
import { UserApi } from '../../../core/api/user.api';
import { MediaApi } from '../../../core/api/media.api';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-user-form-page',
  standalone: true,
  templateUrl: './user-form-page.html',
})
export class UserFormPage {
  @Input() user?: User;

  @Output()
  saved = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  mediaFiles: File[] = [];
  medias: any[] = [];

  constructor(
    private fb: FormBuilder,
    private api: UserApi,
    private mediaApi: MediaApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['ADMIN'],
      active: [true],
    });
  }

  fields = [
    {
      key: 'firstName',
      label: 'Prénom',
      type: 'text',
      col: 6,
    },

    {
      key: 'lastName',
      label: 'Nom',
      type: 'text',
      col: 6,
    },

    {
      key: 'email',
      label: 'Email',
      type: 'email',
      col: 6,
    },

    {
      key: 'password',
      label: 'Mot de passe',
      type: 'password',
      col: 6,
    },

    {
      key: 'role',
      label: 'Rôle',
      type: 'select',
      col: 6,
    },

    {
      key: 'active',
      label: 'Actif',
      type: 'checkbox',
    },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.form.patchValue(this.user);
      this.medias = this.user.medias ?? [];
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

    const request = this.user
      ? this.api.update(this.user.id, this.form.value)
      : this.api.create(this.form.value);

    request.subscribe({
      next: (response: any) => {
        const user = response.data?.data ?? response.data;
        this.toast.success('Utilisateur créer avec succés');
        if (this.mediaFiles.length > 0) {
          this.mediaApi.upload('site-services', user.id, this.mediaFiles).subscribe({
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
        this.toast.error('Utilisateur non enregistré');
        this.loading = false;
      },
    });
  }

  private finishSave() {
    this.toast.success(this.user ? 'Utilisateur modifié' : 'Utilisateur ajouté');
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
