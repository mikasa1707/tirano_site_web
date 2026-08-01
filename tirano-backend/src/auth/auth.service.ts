import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import type { User } from '../users/entities/user.entity';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import { TokenResponseDto } from './dto/token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    private readonly config: ConfigService,

    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const valid = await bcrypt.compare(dto.password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const tokens = this.generateTokens(user);

    user.refreshToken = await bcrypt.hash(tokens.refresh_token, 10);

    await this.usersService.save(user);

    return {
      ...tokens,

      user: new UserResponseDto(user),
    };
  }

  async me(user: JwtPayload) {
    return this.usersService.findOne(user.sub);
  }

  private generateTokens(user: User): TokenResponseDto {
    const payload: JwtPayload = {
      sub: user.id,

      email: user.email,

      role: user.role,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_SECRET'),

      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),

      expiresIn: '7d',
    });

    return {
      access_token,

      refresh_token,
    };
  }

  async refreshToken(refresh_token: string) {
    const payload = this.jwtService.verify<JwtPayload>(refresh_token, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });

    const user = await this.usersService.findOneEntity(payload.sub);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException();
    }

    const valid = await bcrypt.compare(refresh_token, user.refreshToken);

    if (!valid) {
      throw new UnauthorizedException();
    }

    const tokens = this.generateTokens(user);

    user.refreshToken = await bcrypt.hash(tokens.refresh_token, 10);

    await this.usersService.save(user);

    return tokens;
  }

  async logout(userId: number) {
    const user = await this.usersService.findOneEntity(userId);

    if (user) {
      user.refreshToken = '';

      await this.usersService.save(user);
    }

    return {
      message: 'Déconnexion réussie',
    };
  }
}
