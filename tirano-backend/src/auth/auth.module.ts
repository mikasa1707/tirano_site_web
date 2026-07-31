import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        secret: config.get('jwt.secret'),
        signOptions: {
          expiresIn: config.get('jwt.expiresIn'),
        },
      }),
    }),
  ],

  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
