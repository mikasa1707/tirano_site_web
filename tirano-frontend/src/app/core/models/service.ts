import { Media } from "./media";

export interface Service {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  active: boolean;
  medias?: Media[];
}
