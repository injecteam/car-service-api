import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthenticationService } from './authentication.service';
import { AuthenticationJwtGuard } from './jwtauth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '10000s',
        },
      }),
    }),
  ],
  providers: [AuthenticationService, AuthenticationJwtGuard, JwtStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
