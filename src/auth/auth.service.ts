import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { generate, Observable, from } from 'rxjs';
import { User } from 'src/user/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(user: User): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }
}
