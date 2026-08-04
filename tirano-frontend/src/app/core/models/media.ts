export interface Media {
  id: number;
  url: string;
  type: 'IMAGE' | 'VIDEO' | 'PDF';
  title?: string;
  thumbnail?: string;
  filename?: string;
}
