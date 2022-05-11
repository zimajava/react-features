import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import EmailService from '../email/email.service';
import User from '../users/user.entity';
import VerificationTokenPayload from './verificationTokenPayload.interface';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  public sendVerificationLink(user: User) {
    const payload: VerificationTokenPayload = { email: user.email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`,
    });

    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}/${token}`;
    const appName = `React features`;

    return this.emailService.sendMail({
      to: user.email,
      subject: 'Email confirmation',
      html: `<p>Hi, ${user.name}!</p>
              <p>Welcome to ${appName}. Please click the following link to confirm your email:</p>
              <p><a href="${url}" target="_blank"><button>Confirm email</button></a></p>
              <p>Below are your login information</p>
              <p>Your email is: ${user.email}</p>`,
    });
  }

  public async resendConfirmationLink(userId: number) {
    const user = await this.usersService.getById(userId);

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    await this.sendVerificationLink(user);
  }

  public async confirmEmail(email: string) {
    const user = await this.usersService.getByEmail(email);

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    await this.usersService.markEmailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }

      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }

      throw new BadRequestException('Bad confirmation token');
    }
  }
}
