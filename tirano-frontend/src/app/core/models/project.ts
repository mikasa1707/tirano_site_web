import { Media } from "./media";

export type ProjectStatus =
  | 'EN_COURS'
  | 'TERMINE'
  | 'A_VENIR';

export interface Project {
  id: number;
  uuid: string;
  title: string;
  description: string;
  client?: string;
  location?: string;
  realizationDate?: string;
  status: ProjectStatus;
  active: boolean;
  medias?: Media[];
}