import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from } from 'rxjs';
import { User } from '../user/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(user: User): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  comparePasswords(
    cleanPassword: string,
    hashedPassword: string,
  ): Observable<boolean> {
    return from(bcrypt.compare(cleanPassword, hashedPassword));
  }
}
