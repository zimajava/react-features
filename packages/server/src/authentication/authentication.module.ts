import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { TwoFactorAuthenticationController } from './twoFactor/twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from './twoFactor/twoFactorAuthentication.service';
import { JwtTwoFactorStrategy } from './jwt-two-factor.strategy';
import { EmailConfirmationModule } from '../emailConfirmation/emailConfirmation.module';

@Module({
  imports: [UsersModule, PassportModule, ConfigModule, JwtModule.register({}), EmailConfirmationModule],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    TwoFactorAuthenticationService,
    JwtTwoFactorStrategy,
  ],
  controllers: [AuthenticationController, TwoFactorAuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
