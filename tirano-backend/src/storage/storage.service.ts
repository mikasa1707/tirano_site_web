import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { v4 as uuid } from 'uuid';

import { STORAGE_CONFIG } from './constants/storage.constant';
import { MediasType } from 'src/media/enums/media-type.enum';

@Injectable()
export class StorageService {
  private root = join(process.cwd(), 'uploads');

  upload(file: Express.Multer.File, folder = 'general') {
    if (!file) {
      throw new BadRequestException('Aucun fichier reçu');
    }

    const extension = extname(file.originalname).slice(1).toLowerCase();

    const allowedExtensions = [
      ...STORAGE_CONFIG.image.extensions,
      ...STORAGE_CONFIG.video.extensions,
      ...STORAGE_CONFIG.document.extensions,
    ].map((ext) => ext.toLowerCase());

    if (!allowedExtensions.includes(extension)) {
      throw new BadRequestException(
        `Format fichier non supporté: ${extension}`,
      );
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

    writeFileSync(filepath, file.buffer);

    return {
      filename,

      originalName: file.originalname,

      mimeType: file.mimetype,

      size: file.size,

      path: filepath,

      // Chemin relatif uniquement
      url: `/uploads/${folder}/${filename}`,

      type: this.getType(extension),
    };
  }

  delete(path: string) {
    if (existsSync(path)) {
      unlinkSync(path);
    }
  }

  private getType(extension: string): MediasType {
    if (
      STORAGE_CONFIG.image.extensions
        .map((e) => e.toLowerCase())
        .includes(extension)
    ) {
      return MediasType.IMAGE;
    }

    if (
      STORAGE_CONFIG.video.extensions
        .map((e) => e.toLowerCase())
        .includes(extension)
    ) {
      return MediasType.VIDEO;
    }

    return MediasType.DOCUMENT;
  }
}
