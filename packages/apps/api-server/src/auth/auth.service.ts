import { ConflictException, Injectable } from '@nestjs/common';
import { PasswordService } from './password.service';

import { UserService } from '@aionx/data-access-admin';
import { JwtService } from '@nestjs/jwt';
import { SignupInput } from './dto/signup.input';
import { Token } from './models/token.model';
import { Prisma } from '@prisma/client/kcms';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from '../common/configs/configs.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async createUser(payload: SignupInput): Promise<Token> {
    // 密码加密
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );
    try {
      const user = await this.userService.createUser({
        ...payload,
        password: hashedPassword,
      });

      return this.generateTokens({
        userId: user.id,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`Email ${payload.email} already used.`);
      }
      throw new Error(e);
    }
  }

  generateTokens(payload: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }
}
