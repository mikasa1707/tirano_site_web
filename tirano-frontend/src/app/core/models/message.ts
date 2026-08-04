export interface Message {
  id: number;

  fullname: string;

  email: string;

  phone?: string;

  subject: string;

  message: string;

  isRead: boolean;

  created_at: Date;

  updated_at: Date;
}