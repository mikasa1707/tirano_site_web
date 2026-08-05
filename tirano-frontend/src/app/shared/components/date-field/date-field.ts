import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import flatpickr from 'flatpickr';

import { French } from 'flatpickr/dist/l10n/fr';

@Component({
  selector: 'app-date-field',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './date-field.html',
})
export class DateField implements AfterViewInit {
  @Input()
  form!: FormGroup;

  @Input()
  field!: any;

  @ViewChild('input')
  input!: ElementRef;

  ngAfterViewInit() {
    flatpickr(this.input.nativeElement, {
      locale: French,

      dateFormat: 'd/m/Y',

      allowInput: true,

      defaultDate: this.form.get(this.field.key)?.value,

      onChange: (dates) => {
        if (dates.length) {
          this.form.patchValue({
            [this.field.key]: dates[0],
          });
        }
      },
    });
  }
}
