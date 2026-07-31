import { DataSource } from 'typeorm';

import { seedSettings } from './settings.seed';
import { seedAdminUser } from './admin-user.seed';

export async function runSeeds(dataSource: DataSource) {
  await seedSettings(dataSource);
  await seedAdminUser(dataSource);
}
