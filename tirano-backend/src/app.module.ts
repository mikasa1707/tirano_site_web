import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import storageConfig from './config/storage.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { SiteServicesModule } from './site-services/site-services.module';
import { ProjectsModule } from './projects/projects.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { ArticlesModule } from './articles/articles.module';
import { MessagesModule } from './messages/messages.module';
import { MediaModule } from './media/media.module';
import { SettingsModule } from './settings/settings.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { DatabaseModule } from './database/database.module';
import { StorageModule } from './storage/storage.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { JwtGuard } from './auth/guards/jwt.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { SeedModule } from './database/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      load: [appConfig, databaseConfig, jwtConfig, storageConfig],
    }),

    DatabaseModule,

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),

    UsersModule,
    SiteServicesModule,
    ProjectsModule,
    ProductsModule,
    TestimonialsModule,
    ArticlesModule,
    MessagesModule,
    MediaModule,
    SettingsModule,
    DashboardModule,

    StorageModule,

    AuthModule,
    SeedModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
