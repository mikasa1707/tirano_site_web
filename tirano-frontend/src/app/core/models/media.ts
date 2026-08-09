export interface Media {
  id: number;
  url: string;
  type: 'IMAGE' | 'VIDEO' | 'PDF';
  title?: string;
  thumbnail?: string;
  filename?: string;
}

export interface GalleryMedia {
  id: number;
  type: 'IMAGE' | 'VIDEO' | 'PDF' | 'DOCUMENT';
  url: string;
  name?: string;
  originalName?: string;
  thumbnail?: string;
}

export interface GalleryData {
  title?: string;
  description?: string;
  medias: GalleryMedia[];
}