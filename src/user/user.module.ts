import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { User } from './user.entity';
import { AuthorizationModule } from 'src/authorization/authorization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthenticationModule,
    AuthorizationModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
