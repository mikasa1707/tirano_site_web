import { Setting } from 'src/settings/entities/setting.entity';
import { DataSource } from 'typeorm';

export async function seedSettings(dataSource: DataSource) {
  const repository = dataSource.getRepository(Setting);

  const exists = await repository.findOne({
    where: { id: 1 },
  });

  if (!exists) {
    await repository.save({
      id: 1,

      siteName: 'Mon entreprise',

      description: 'Bienvenue sur notre site officiel',

      email: 'contact@monsite.com',

      phone: '+261 34 00 000 00',

      address: 'Antananarivo, Madagascar',

      facebook: 'https://facebook.com',

      instagram: 'https://instagram.com',

      linkedin: 'https://linkedin.com',

      youtube: 'https://youtube.com',

      maintenance: false,
    });
  }
}
