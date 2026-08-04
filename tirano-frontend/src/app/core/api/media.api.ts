import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class MediaApi {
  constructor(private api: ApiService) {}

  /**
   * Upload plusieurs fichiers liés à une ressource
   */
  upload(owner: string, ownerId: number, files: File[]) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    return this.api.post(`${owner}/${ownerId}/media`, formData);
  }

  /**
   * Supprimer un média
   */
  remove(mediaId: number) {
    return this.api.delete(`media/${mediaId}`);
  }

  /**
   * Liste des médias d'une ressource
   */
  findAll(owner: string, ownerId: number) {
    return this.api.get(`${owner}/${ownerId}/media`);
  }

  /**
   * Récupérer un média
   */
  findOne(id: number) {
    return this.api.get(`media/${id}`);
  }
}
