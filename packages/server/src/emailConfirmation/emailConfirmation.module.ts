import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailConfirmationService } from './emailConfirmation.service';
import { EmailModule } from '../email/email.module';
import { EmailConfirmationController } from './emailConfirmation.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, EmailModule, JwtModule.register({}), UsersModule],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
  controllers: [EmailConfirmationController],
})
export class EmailConfirmationModule {}
