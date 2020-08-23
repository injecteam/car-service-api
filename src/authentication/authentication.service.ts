import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserJwtPayload } from './authentication.type';

@Injectable()
export class AuthenticationService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJWT(userJwtPayload: UserJwtPayload): Promise<string> {
    try {
      const jwt = await this.jwtService.signAsync({ user: userJwtPayload });
      return jwt;
    } catch (error) {
      // TODO: Error handling
      console.error(error);
    }
  }

  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 12);
    } catch (error) {
      // TODO: Error handling
      console.error(error);
    }
  }

  async comparePasswords(
    cleanPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      const passwordMatch = await bcrypt.compare(cleanPassword, hashedPassword);
      return passwordMatch;
    } catch (error) {
      // TODO: Error handling
      console.error(error);
    }
  }
}
