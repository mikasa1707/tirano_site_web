import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private config: ConfigService,
    private jwtService: JwtService,
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

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = await this.generateTokens(user);
    user.refreshToken = await bcrypt.hash(tokens.refresh_token, 10);

    await this.usersService.save(user);

    return {
      ...tokens,
      user: new UserResponseDto(user),
    };
  }

  async me(user: any) {
    return this.usersService.findOne(user.id);
  }

  private async generateTokens(user: any) {
    const payload = {
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
    const payload = this.jwtService.verify(
      refresh_token,

      {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      },
    );

    const user = await this.usersService.findOneEntity(payload.sub);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException();
    }

    const valid = await bcrypt.compare(refresh_token, user.refreshToken);

    if (!valid) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user);
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
