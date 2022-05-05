import { Controller, Post, Req, UploadedFile, UseGuards } from '@nestjs/common';
import { Express } from 'express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UsersService } from './users.service';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import RequestWithUser from '../authentication/requestWithUser.interface';
import FileUploadDto from './dto/fileUpload.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'A new avatar for the user',
    type: FileUploadDto,
  })
  async addAvatar(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
    // return this.usersService.addAvatar(request.user.id, {
    //   path: file.path,
    //   filename: file.originalname,
    //   mimetype: file.mimetype,
    // });
  }
}
