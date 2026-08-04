export interface DetailField {
  key: string;
  label: string;
  type?: 'text' | 'html' | 'image' | 'badge' | 'date' | 'gallery' | 'number';

  badge?: {
    trueLabel?: string;
    falseLabel?: string;
  };
  col?: string;
}
