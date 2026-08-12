import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';

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

  // =========================================================
  // LOGIN
  // =========================================================

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

  // =========================================================
  // CURRENT USER
  // =========================================================

  async me(user: JwtPayload) {
    return this.usersService.findOne(user.sub);
  }

  // =========================================================
  // GENERATE TOKENS
  // =========================================================

  private generateTokens(user: User): TokenResponseDto {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    /**
     * JWT_EXPIRES_IN
     *
     * Exemple :
     *
     * JWT_EXPIRES_IN=1d
     *
     * Le type StringValue correspond aux valeurs
     * acceptées par la librairie `ms` :
     *
     * 15m
     * 1h
     * 1d
     * 7d
     * etc.
     */
    const accessTokenExpiresIn: StringValue =
      this.config.get<StringValue>('JWT_EXPIRES_IN') ?? '1d';

    const refreshTokenExpiresIn: StringValue = '7d';

    const access_token = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_SECRET'),
      expiresIn: accessTokenExpiresIn,
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: refreshTokenExpiresIn,
    });

    return {
      access_token,
      refresh_token,
    };
  }

  // =========================================================
  // REFRESH TOKEN
  // =========================================================

  async refreshToken(refresh_token: string) {
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(refresh_token, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }

    const user = await this.usersService.findOneEntity(payload.sub);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh token invalide');
    }

    const valid = await bcrypt.compare(refresh_token, user.refreshToken);

    if (!valid) {
      throw new UnauthorizedException('Refresh token invalide');
    }

    const tokens = this.generateTokens(user);

    user.refreshToken = await bcrypt.hash(tokens.refresh_token, 10);

    await this.usersService.save(user);

    return tokens;
  }

  // =========================================================
  // LOGOUT
  // =========================================================

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
