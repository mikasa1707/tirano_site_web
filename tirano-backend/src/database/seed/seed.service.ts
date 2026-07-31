import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
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

  async onApplicationBootstrap() {
    await this.createAdmin();

    await this.createSettings();

    console.log('Seed exécuté');
  }

  private async createAdmin() {
    const exists = await this.userRepository.findOne({
      where: {
        email: 'admin@admin.com',
      },
    });

    if (!exists) {
      const password = await bcrypt.hash('Admin@123456', 10);

      const user = this.userRepository.create({
        firstname: 'Admin',
        lastname: 'System',
        email: 'admin@admin.com',
        password,
        role: UserRole.ADMIN,
      });

      await this.userRepository.save(user);
      console.log('Admin créé');
    }
  }

  private async createSettings() {
    const exists = await this.settingRepository.findOne({
      where: {
        id: 1,
      },
    });

    if (!exists) {
      const setting = this.settingRepository.create({
        id: 1,
        siteName: 'Mon site',
        description: 'Site vitrine',
        email: 'contact@monsite.com',
        phone: '+261000000000',
        maintenance: false,
      });

      await this.settingRepository.save(setting);

      console.log('Settings créés');
    }
  }
}
