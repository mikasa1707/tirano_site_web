import { ValidatorFn } from '@angular/forms';

export interface FormField {
  key: string;
  label: string;
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'email'
    | 'password'
    | 'select'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'time'
    | 'file'
    | 'image'
    | 'gallery'
    | 'editor'
    | 'video'
    | 'pdf';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  currency?: boolean;
  validators?: ValidatorFn[];
  options?: any[];
  optionLabel?: string;
  optionValue?: string;
  col?: 3 | 4 | 6 | 12;
}
