import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from 'src/users/entities/user.entity';

export async function seedAdminUser(dataSource: DataSource) {
  const repository = dataSource.getRepository(User);

  const exists = await repository.findOne({
    where: {
      email: 'admin@admin.com',
    },
  });

  if (!exists) {
    const password = await bcrypt.hash('Admin@123456', 10);

    const user = repository.create({
      firstname: 'Admin',
      lastname: 'System',
      email: 'admin@admin.com',
      password,
      role: UserRole.ADMIN,
    });

    await repository.save(user);
  }
}
