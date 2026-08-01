import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-state-view',
  standalone: true,
  templateUrl: './state-view.html',
})
export class StateView {
  @Input()
  type: 'empty' | 'error' | 'search' | 'forbidden' | 'maintenance' | 'coming-soon' = 'empty';

  @Input()
  title = '';

  @Input()
  message = '';

  @Input()
  buttonText = '';

  @Input()
  icon = '';

  @Output()
  action = new EventEmitter<void>();

  get defaultIcon(): string {
    if (this.icon) {
      return this.icon;
    }

    switch (this.type) {
      case 'empty':
        return 'fa-box-open';

      case 'error':
        return 'fa-circle-exclamation';

      case 'search':
        return 'fa-magnifying-glass';

      case 'forbidden':
        return 'fa-lock';

      case 'maintenance':
        return 'fa-screwdriver-wrench';

      case 'coming-soon':
        return 'fa-clock';

      default:
        return 'fa-circle-info';
    }
  }

  get defaultTitle(): string {
    if (this.title) {
      return this.title;
    }

    switch (this.type) {
      case 'empty':
        return 'Aucune donnée';

      case 'error':
        return 'Une erreur est survenue';

      case 'search':
        return 'Aucun résultat';

      case 'forbidden':
        return 'Accès refusé';

      case 'maintenance':
        return 'Maintenance';

      case 'coming-soon':
        return 'Bientôt disponible';

      default:
        return '';
    }
  }
}
