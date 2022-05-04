import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users.service';
import User from './user.entity';
import { UsersController } from './users.controller';
import { DatabaseFilesModule } from '../databaseFiles/databaseFiles.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), DatabaseFilesModule, ConfigModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
