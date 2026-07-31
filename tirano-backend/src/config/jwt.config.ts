import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'CHANGE_ME',
  expiresIn: process.env.JWT_EXPIRES || '1d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'CHANGE_ME_REFRESH',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
}));
