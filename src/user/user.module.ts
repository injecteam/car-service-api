import { User } from './user.entity';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { AuthorizationModule } from 'src/authorization/authorization.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';

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
