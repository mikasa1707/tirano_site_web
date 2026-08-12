import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageApi } from '../../core/api/message.api';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss',
})
export class ContactPage implements OnInit {
  // =========================================================
  // STATE
  // =========================================================

  sending = false;
  form!: FormGroup;

  // =========================================================
  // SUBJECTS
  // =========================================================

  readonly sujets = [
    {
      label: 'Demande de devis',
      value: 'Demande de devis',
    },

    {
      label: 'Demande de renseignement',
      value: 'Demande de renseignement',
    },

    {
      label: 'Prise de rendez-vous',
      value: 'Prise de rendez-vous',
    },

    {
      label: 'Réclamation',
      value: 'Réclamation',
    },

    {
      label: 'Support technique',
      value: 'Support technique',
    },

    {
      label: 'Partenariat',
      value: 'Partenariat',
    },

    {
      label: 'Autre',
      value: 'Autre',
    },
  ];

  // =========================================================
  // MESSAGE TEMPLATES
  // =========================================================

  private readonly templates: Record<string, string> = {
    'Demande de devis': `Bonjour,

Je souhaite obtenir un devis concernant vos services.

Merci.`,

    'Demande de renseignement': `Bonjour,

Je souhaite obtenir davantage de renseignements concernant vos services.

Merci.`,

    'Prise de rendez-vous': `Bonjour,

Je souhaite prendre rendez-vous avec votre équipe.

Merci.`,

    Réclamation: `Bonjour,

Je souhaite vous faire part d'une réclamation.

Merci.`,

    'Support technique': `Bonjour,

Je rencontre un problème et souhaiterais obtenir une assistance technique.

Merci.`,

    Partenariat: `Bonjour,

Je souhaite vous contacter concernant une éventuelle collaboration ou un partenariat.

Merci.`,
  };

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageApi: MessageApi,
    public readonly settings: SiteSettingsService,
    private readonly toast: ToastService,
  ) {}

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.form = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2)]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^(032|033|034|038)\s?\d{2}\s?\d{3}\s?\d{2}$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  // =========================================================
  // SEND
  // =========================================================

  send(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.toast.warning('Veuillez vérifier les informations saisies.');

      return;
    }

    this.sending = true;

    this.messageApi.create(this.form.value).subscribe({
      next: () => {
        this.sending = false;

        this.form.reset();

        this.toast.success('Votre message a été envoyé avec succès.');
      },

      error: (error) => {
        this.sending = false;

        console.error('Erreur lors de l’envoi du message', error);

        this.toast.error(
          error?.error?.message ?? "Une erreur est survenue lors de l'envoi du message.",
        );
      },
    });
  }

  // =========================================================
  // SUBJECT
  // =========================================================

  onSujetChange(): void {
    const subject = this.form.get('subject')?.value;

    const template = this.templates[subject];

    if (!template) {
      return;
    }

    this.form.patchValue({
      message: template,
    });
  }

  // =========================================================
  // VALIDATION
  // =========================================================

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);

    return !!(control && control.touched && control.invalid);
  }
}
