export interface Service {
  id: number;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  video?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}
