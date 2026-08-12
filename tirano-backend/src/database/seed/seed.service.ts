import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { Setting } from 'src/settings/entities/setting.entity';
import { User, UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  // =========================================================
  // APPLICATION BOOTSTRAP
  // =========================================================

  async onApplicationBootstrap(): Promise<void> {
    /*
     * =======================================================
     * VÉRIFICATION ADMIN
     * =======================================================
     *
     * Si un ADMIN existe déjà :
     *
     * - aucun utilisateur n'est créé
     * - aucun mot de passe n'est généré
     * - aucun setting n'est créé
     * - le seed s'arrête immédiatement
     */

    const adminCount: number = await this.userRepository.count({
      where: {
        role: UserRole.ADMIN,
      },
    });

    if (adminCount > 0) {
      console.log(
        `Seed ignoré : ${adminCount} administrateur(s) existe(nt) déjà.`,
      );

      return;
    }

    /*
     * =======================================================
     * PREMIÈRE INITIALISATION
     * =======================================================
     */

    console.log('Aucun administrateur trouvé. Initialisation du seed...');

    await this.createAdmin();

    await this.createSettings();

    console.log('Seed exécuté avec succès.');
  }

  // =========================================================
  // CREATE ADMIN
  // =========================================================

  private async createAdmin(): Promise<void> {
    /*
     * Double sécurité.
     *
     * Même si createAdmin() est appelé ailleurs plus tard,
     * on refuse de créer un deuxième ADMIN.
     */

    const adminCount: number = await this.userRepository.count({
      where: {
        role: UserRole.ADMIN,
      },
    });

    if (adminCount > 0) {
      console.log('Création admin ignorée : un administrateur existe déjà.');

      return;
    }

    /*
     * =======================================================
     * HASH PASSWORD
     * =======================================================
     */

    const password: string = await hash('Admin@123456', 10);

    /*
     * =======================================================
     * CREATE USER
     * =======================================================
     */

    const user: User = this.userRepository.create({
      firstname: 'Admin',
      lastname: 'System',
      email: 'admin@admin.com',
      password,
      role: UserRole.ADMIN,
    });

    await this.userRepository.save(user);

    console.log('Administrateur initial créé : admin@admin.com');
  }

  // =========================================================
  // CREATE SETTINGS
  // =========================================================

  private async createSettings(): Promise<void> {
    /*
     * Vérification des settings.
     *
     * Si les settings existent déjà, on ne les modifie pas.
     */

    const settingsCount: number = await this.settingRepository.count({
      where: {
        id: 1,
      },
    });

    if (settingsCount > 0) {
      console.log('Settings déjà présents. Création ignorée.');

      return;
    }

    /*
     * =======================================================
     * CREATE SETTINGS
     * =======================================================
     */

    const setting: Setting = this.settingRepository.create({
      id: 1,
      siteName: 'Mon site',
      description: 'Site vitrine',
      email: 'contact@monsite.com',
      phone: '+261000000000',
      maintenance: false,
    });

    await this.settingRepository.save(setting);

    console.log('Settings initiaux créés.');
  }
}
