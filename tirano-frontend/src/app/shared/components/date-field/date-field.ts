import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

import flatpickr from 'flatpickr';
import { French } from 'flatpickr/dist/l10n/fr';

@Component({
  selector: 'app-date-field',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './date-field.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class DateField implements AfterViewInit {
  @Input() form!: FormGroup;

  @Input() field!: any;

  @ViewChild('input')
  input!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    flatpickr(this.input.nativeElement, {
      locale: French,
      dateFormat: 'd/m/Y',
      allowInput: true,
      defaultDate: this.form.get(this.field.key)?.value,
      onChange: (dates) => {
        this.form.get(this.field.key)?.setValue(dates[0] ?? null);
      },
    });
  }
}
