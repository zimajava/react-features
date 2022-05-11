import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from '@hapi/joi';

import { ChatModule } from './chat/chat.module';
import { OptimizeModule } from './optimize/optimize.module';
import { EmailConfirmationModule } from './emailConfirmation/emailConfirmation.module';
import { GoogleAuthenticationModule } from './googleAuthentication/googleAuthentication.module';
import { DatabaseFilesModule } from './databaseFiles/databaseFiles.module';
import { DatabaseModule } from './database/database.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import HealthModule from './health/health.module';
import LogsMiddleware from './utils/logs.middleware';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
        JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        FRONTEND_URL: Joi.string(),
        PORT: Joi.number(),
        EMAIL_HOST: Joi.string().required(),
        EMAIL_PORT: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        // EMAIL_CONFIRMATION_URL: Joi.string().required(),
        // TWO_FACTOR_AUTHENTICATION_APP_NAME: Joi.string(),
        // GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
        // GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    AuthenticationModule,
    UsersModule,
    LoggerModule,
    // HealthModule,
    // ChatModule,
    // OptimizeModule,
    // EmailConfirmationModule,
    // GoogleAuthenticationModule,
    // DatabaseFilesModule,
  ],
  controllers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
