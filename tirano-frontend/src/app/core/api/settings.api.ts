import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Setting } from '../models/setting';

@Injectable({
  providedIn: 'root',
})
export class SettingApi {
  constructor(private api: ApiService) {}

  findOne() {
    return this.api.get<Setting>('settings');
  }

  update(data: Partial<Setting>) {
    return this.api.putPath<Setting>('settings', data);
  }

  uploadLogo(file: File) {
    const form = new FormData();

    form.append('file', file);

    return this.api.post('settings/logo', form);
  }

  uploadFavicon(file: File) {
    const form = new FormData();

    form.append('file', file);

    return this.api.post('settings/favicon', form);
  }

  postMedia(form: FormData) {
    return this.api.post('settings/media', form);
  }
}
