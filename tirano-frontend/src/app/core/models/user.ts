export interface User {
  id: number;

  firstName: string;

  lastName: string;

  email: string;

  role: string;

  active: boolean;

  medias?: any[];
}
