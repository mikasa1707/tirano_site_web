import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, extname } from 'path';
import { v4 as uuid } from 'uuid';
import { STORAGE_CONFIG } from './constants/storage.constant';
import { MediaType } from 'express';
import { MediasType } from 'src/media/enums/media-type.enum';

@Injectable()
export class StorageService {
  private root = 'uploads';

  upload(file: any, folder = 'general') {
    if (!file) {
      throw new BadRequestException('Aucun fichier reçu');
    }

    const extension = extname(file.originalname).replace('.', '').toLowerCase();

    const allowed = [
      ...STORAGE_CONFIG.image.extensions,
      ...STORAGE_CONFIG.video.extensions,
      ...STORAGE_CONFIG.document.extensions,
    ];

    if (!allowed.includes(extension)) {
      throw new BadRequestException('Format fichier non supporté');
    }

    if (file.size > STORAGE_CONFIG.maxSize) {
      throw new BadRequestException('Fichier trop volumineux');
    }

    const folderPath = join(this.root, folder);

    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, {
        recursive: true,
      });
    }

    const filename = `${uuid()}.${extension}`;
    const filepath = join(folderPath, filename);

    return {
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: filepath,
      url: `/${filepath.replaceAll('\\', '/')}`,
      type: this.getType(extension),
    };
  }

  delete(path: string) {
    if (existsSync(path)) {
      unlinkSync(path);
    }
  }
  
  private getType(extension: string): MediasType {
    if (STORAGE_CONFIG.image.extensions.includes(extension)) {
      return MediasType.IMAGE;
    }

    if (STORAGE_CONFIG.video.extensions.includes(extension)) {
      return MediasType.VIDEO;
    }

    return MediasType.DOCUMENT;
  }
}
