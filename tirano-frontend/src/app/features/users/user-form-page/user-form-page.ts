import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { User, UserRole, UserJob } from '../../../core/models/user';
import { Media } from '../../../core/models/media';

import { UserApi } from '../../../core/api/user.api';
import { MediaApi } from '../../../core/api/media.api';

import { ToastService } from '../../../core/services/toast';

import { FormBuilderComponent } from '../../../shared/components/form-builder/form-builder';
import { FileSelector } from '../../../shared/components/file-selector/file-selector';
import { Gallery } from '../../../shared/components/gallery/gallery';
import { FormField } from '../../../core/models/form-field';

@Component({
  selector: 'app-user-form-page',
  standalone: true,
  templateUrl: './user-form-page.html',
  imports: [ReactiveFormsModule, FormBuilderComponent, FileSelector, Gallery],
})
export class UserFormPage implements OnChanges {
  @Input() user?: User;

  @Output() saved = new EventEmitter<void>();

  form: FormGroup;

  loading = false;

  mediaFiles: File[] = [];

  medias: Media[] = [];

  constructor(
    private fb: FormBuilder,
    private api: UserApi,
    private mediaApi: MediaApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      firstname: ['', Validators.required],

      lastname: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],

      password: [''],

      role: [UserRole.USER, Validators.required],

      job: [UserJob.OTHER, Validators.required],

      active: [true],
    });
  }

  fields: FormField[] = [
    {
      key: 'firstname',
      label: 'Prénom',
      type: 'text',
      required: true,
      col: 6,
    },

    {
      key: 'lastname',
      label: 'Nom',
      type: 'text',
      required: true,
      col: 6,
    },

    {
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
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
      label: 'Rôle application',
      type: 'select',
      col: 6,
      options: [
        {
          label: 'Administrateur',
          value: UserRole.ADMIN,
        },
        {
          label: 'Éditeur',
          value: UserRole.EDITOR,
        },
        {
          label: 'Utilisateur',
          value: UserRole.USER,
        },
      ],
      optionLabel: 'label',
      optionValue: 'value',
    },

    {
      key: 'job',
      label: 'Fonction',
      type: 'select',
      col: 6,
      options: [
        {
          label: 'Directeur',
          value: UserJob.DIRECTOR,
        },
        {
          label: 'Manager',
          value: UserJob.MANAGER,
        },
        {
          label: 'Commercial',
          value: UserJob.COMMERCIAL,
        },
        {
          label: 'Technicien',
          value: UserJob.TECHNICIAN,
        },
        {
          label: 'Comptable',
          value: UserJob.ACCOUNTANT,
        },
        {
          label: 'Secrétaire',
          value: UserJob.SECRETARY,
        },
        {
          label: 'Chauffeur',
          value: UserJob.DRIVER,
        },
        {
          label: 'Autre',
          value: UserJob.OTHER,
        },
      ],
      optionLabel: 'label',
      optionValue: 'value',
    },

    {
      key: 'active',
      label: 'Actif',
      type: 'checkbox',
      col: 6,
    },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.form.patchValue({
        firstname: this.user.firstname,

        lastname: this.user.lastname,

        email: this.user.email,

        role: this.user.role,

        job: this.user.job,

        active: this.user.active,
      });

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

    const payload = { ...this.form.value };

    // ne pas envoyer mot de passe vide en modification
    if (this.user && !payload.password) {
      delete payload.password;
    }

    const request = this.user ? this.api.update(this.user.id, payload) : this.api.create(payload);

    request.subscribe({
      next: (response: any) => {
        const user = response.data?.data ?? response.data ?? response;

        if (this.mediaFiles.length > 0) {
          this.mediaApi.upload('users', user.id, this.mediaFiles).subscribe({
            next: () => {
              this.finishSave();
            },

            error: () => {
              this.toast.error('Médias non enregistrés');

              this.loading = false;
            },
          });
        } else {
          this.finishSave();
        }
      },

      error: () => {
        this.toast.error(this.user ? 'Utilisateur non modifié' : 'Utilisateur non enregistré');

        this.loading = false;
      },
    });
  }

  private finishSave() {
    this.toast.success(
      this.user ? 'Utilisateur modifié avec succès' : 'Utilisateur créé avec succès',
    );

    this.saved.emit();

    this.loading = false;

    this.mediaFiles = [];

    this.cdr.detectChanges();
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
